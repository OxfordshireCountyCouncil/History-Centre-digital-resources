"use strict";

// Load plugins
const autoprefixer     = require("autoprefixer");
const browsersync      = require("browser-sync").create();
const cp               = require("child_process");
const cssnano          = require("cssnano");
const del              = require("del");
const eslint           = require("gulp-eslint");
const gulp             = require("gulp");
const imagemin         = require("gulp-imagemin");
const newer            = require("gulp-newer");
const plumber          = require("gulp-plumber");
const postcss          = require("gulp-postcss");
const rename           = require("gulp-rename");
const sass             = require("gulp-sass");
const nunjucksRender   = require('gulp-nunjucks-render');
const data             = require('gulp-data');


// Put this after including our dependencies
const paths = {
    styles: {
        src: "scss/*.scss",
        dest: "css"
    },
    dir: {
      sourceDir: "./source",
      sourcePages: "./source/pages",
      sourceSCSS: "./source/assets/scss",
      sourceIMG: "./source/assets/images",
      sourceJS: "./source/assets/js",
      deployDir: "./deploy/public",
      deployDirAssets: "./deploy/public/assets"
    }
 
};

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: paths.dir.deployDir
    },
    port: 3000
  });
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Clean assets
function clean() {
  return del([paths.dir.deployDir]);
}

// Optimize Images
function images() {
  return gulp
    .src(paths.dir.sourceIMG + "/**/*")
    .pipe(newer(paths.dir.deployDirAssets + "/images"))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: false,
              collapseGroups: true
            }
          ]
        })
      ])
    )
    .pipe(gulp.dest(paths.dir.deployDirAssets + "/images"));
}

// CSS task
function css() {
  return gulp
    .src(paths.dir.sourceSCSS + "/**/*.scss")
    .pipe(plumber())
    .pipe(sass({ includePaths: ['node_modules/occlss/scss/'], outputStyle: "expanded" }))
    .pipe(gulp.dest(paths.dir.deployDirAssets + "/css/"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest(paths.dir.deployDirAssets + "/css/"))
    .pipe(browsersync.stream());
}

// Lint scripts
function scriptsLint() {
  return gulp
    .src([paths.dir.sourceJS])
    .pipe(plumber())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

// Transpile, concatenate and minify scripts
function scripts() {
  return (
    gulp
      .src([paths.dir.sourceJS + "/**/*"])
      .pipe(plumber())
      .pipe(gulp.dest(paths.dir.deployDirAssets + "/js/"))
      .pipe(browsersync.stream())
  );
}

// Nunjucs template system
function nunjucks() {
  // Gets .html and .nunjucks files in pages
  return gulp.src(paths.dir.sourcePages + '/**/*.+(html|njk)')
  // Adding data to Nunjucks
  .pipe(data(function() {
      return require(paths.dir.sourceDir + '/data/data.json')
  }))
  // Renders template with nunjucks
  .pipe(nunjucksRender({
      path: [paths.dir.sourceDir + '/templates']
    }))
  // output files in app folder
  .pipe(gulp.dest(paths.dir.deployDir))
}

// Watch files
function watchFiles() {
  gulp.watch(paths.dir.sourceSCSS + "/**/*", css);
  gulp.watch(paths.dir.sourceJS + "/**/*", gulp.series(scriptsLint, scripts));
  gulp.watch(paths.dir.sourceIMG + "/**/*", images);
  gulp.watch(paths.dir.sourcePages + "/**/*.+(html|njk)", nunjucks);
  gulp.watch(paths.dir.sourceDir + "/templates/**/*.+(njk)", nunjucks);
  gulp.watch(paths.dir.deployDir + "/*.html", browserSyncReload);
  gulp.watch(paths.dir.deployDirAssets + "/**/*.*", browserSyncReload);
}

// define complex tasks
const js = gulp.series(scriptsLint, scripts);
const build = gulp.series(clean, gulp.parallel(css, images, js, nunjucks));
const watch = gulp.parallel(watchFiles, nunjucks, browserSync);

// export tasks
exports.nunjucks = nunjucks;
exports.images = images;
exports.css = css;
exports.js = js;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = build;
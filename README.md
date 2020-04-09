# Oxfordshire History Centre digital resources

Statick website builede using OCCLSS, njk and gulp

## How to run this project?

This is a static website and to compile all of the elements you will need node js v10.15.1 or higher, you can download nod js here [https://www.npackd.org/p/org.nodejs.NodeJS64/10.15.1].


After you install the nodejs you have to open terminal windows or CMD and cd into the folder with the package.json file in it.

Then you have to type:

1. Open comand promt and `cd /project folder/`
2. Run `npm install` this will install all of the required packages
3. after instalattion you can type `gulp watch` the comand will run and will open the project in the browser windows.
4. You can deploy project by running `gulp build` after this command done it will copy all of the files in the `deploy/public` folder this is compiled website that can go any server

## Cookie popup

The cookie popup file you can find in the `source/assets/js/occ-GDPR-popup.js`

To add to your project the popup you will need javascript file and HTML code...

You can see an example in `source/templates/layout.njk` there javascript reference at the bottom.
And the popup code in the `source/templates/partials/header.njk`


```html
<div
    id="occ-GDPR-popup"
    data-icon-url="/assets/images/occlss/occlss-sprite.svg#info"
    data-title="Cookies"
    data-popup-content="Cookies tell us which parts of our website people have visited, help us to measure the effectiveness of our content, and allow you to view videos on our website. We store no personal details. Control your"
    data-cancel-btn-text="Decline all"
    data-accept-btn-text="Accept all"
    data-settings-text="cookie settings."
    data-settings-path="/cookie.html"
    data-gaid="UA-90576415-1"></div>

<script src="/assets/js/occ-GDPR-popup.js"></script>
```

`id` - should be unchanged.
`data-icon-url` - this url to a svg sprite file, this will display exclamation mark icon.
`data-title` - this is popup title.
`data-popup-content` -  this is popup content.
`data-cancel-btn-text` - cancel button text.
`data-accept-btn-text` - accept button text.
`data-settings-text` - link to the cookie settings page.
`data-settings-path` - this is link to cookies settings page.
`data-gaid` - this is only for the functionality and must contain google id.


## Cookie settings form

The cookie settings form file you can find in the `source/assets/js/occ-GDPR-form.js`

To add to your project the form you will need javascript file and HTML code...

You can see an example in `source/pages/cookie.njk` there is code implemented inside the content.


```html
<div id="occ-GDPR-form"
    data-ga-text="We use Google Analytics to collect information about how visitors use our site. This information is used for reporting purposes and to help us improve the customer experience on our site.<br> Analytics uses its own cookie to track visitor interactions. The cookie is used to store information, such as what time the current visit occurred, whether the visitor has been to the site before, and what site referred the visitor to the web page."
    data-smb-text="Save changes">
</div>
<script src="/assets/js/occ-GDPR-form.js"></script>
```

`id` - should be unchanged.
`data-ga-text` - this is a description for the google option.
`data-smb-text` - this is the text for the submit button.


## Google analytics code

To use google analitics with popup and form you will need to add a javascript around it below


```html
<script>
    if (document.cookie.match('(^|;)\\s*google_stats\\s*=\\s*true')) {
       -- GOOGLE ANALYTICS JAVASCRIPT HERE --
    }
</script>
```

Example

```html
<script>
    if (document.cookie.match('(^|;)\\s*google_stats\\s*=\\s*true')) {
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');  ga('create', 'UA-90576415-1', 'auto');  ga('send', 'pageview');
    }
</script>
```
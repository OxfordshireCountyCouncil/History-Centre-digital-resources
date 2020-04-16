<template>
 <div aria-hidden="false" class="js-occlss-alert-cookiepopup occlss-alert occlss-alert--info occlss-alert--cookiepopup" v-if="popupStatus">
    <div class="occlss-layout">
        <div class="occlss-layout__col occlss-layout__col--2  occlss-alert__sign-cont">
            <span class="occlss-icon occlss-icon--info" aria-hidden="true">
                <svg aria-hidden="true" class="occlss-icon__container occlss-alert__sign">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="`${ iconUrl }`" class="icon__source icon__source--svg"></use>
                </svg>
            </span>
        </div>
        <div class="occlss-layout__col occlss-layout__col--10 occlss-alert__cont">
            <h2 class="occlss-alert__heading">{{ title }}</h2>        
            <p class="occlss-alert__text occlss-u-bspace-sm"><span v-html="popupContent"></span> <a v-bind:href="settingsPath">{{settingsText}}</a></p>
            <p>
                <button class="occlss-button occlss-button--neutral" style="display: inline-block; margin-right: 10px;" v-if="cancelBtnText" @click.prevent="OnClick('canceled')">{{ cancelBtnText }}</button>
                <button class="occlss-button occlss-button--primary js-occlss-alert-cookiepopup-close" style="display: inline-block" v-if="acceptBtnText" @click.prevent="OnClick('accepted')">{{ acceptBtnText }}</button>
            </p>
        </div>
    </div>
 </div>
</template>

<script>
export default {
  props: ['popupContent','title','iconUrl','cancelBtnText','acceptBtnText','gaid','settingsText','settingsPath'],
  name: "occ-popup",
  data () {
    return {
        popupStatus: false
    }
  },
  created() {
    const get_google_stats = this.$cookie.get('google_stats');
    const get_third_party = this.$cookie.get('third_party');
    const get_cookie_settings = this.$cookie.get('cookie_settings');

    if(get_google_stats == null) {
        this.SetCookie({'type': 'google', 'status' : true });
    }

    if(get_third_party == null) {
        this.SetCookie({'type': 'third_party', 'status' : false });
    }

    if(get_cookie_settings == null) {
        this.popupStatus = true;
        this.SetCookie({'type': 'cookie_settings', 'status' : false });
    }

    if(get_cookie_settings == 'false') {
        this.popupStatus = true;
    }

  },
  methods: {
    GetDomain() {
        let url = window.location.hostname;
        const subdomain = false;
        url = url.replace(/(https?:\/\/)?(www.)?/i, '');
        if (!subdomain) {
            url = url.split('.');
            url = url.slice(url.length - 2).join('.');
        }
        if (url.indexOf('/') !== -1) {
            return url.split('/')[0];
        }
        return  "." + url;
    },
    DeleteCookies() {
        this.$cookie.delete('_ga', {domain: this.GetDomain()});
        this.$cookie.delete('_gid', {domain: this.GetDomain()});
        this.$cookie.delete('_gat', {domain: this.GetDomain()});
    },
    SetCookie(value){

        const date = new Date;
        date.setDate(date.getDate() + 365);

        if(value.type == 'google'){
            this.$cookie.set('google_stats', value.status, { expires: date, domain: this.GetDomain()});
            if(value.status == true) {
                location.reload();
            }
        }

        if(value.type == 'third_party'){
            this.$cookie.set('third_party', value.status, { expires: date, domain: this.GetDomain()});
        }

        if(value.type == 'cookie_settings'){
            this.$cookie.set('cookie_settings', value.status, { expires: date, domain: this.GetDomain()});
        }

    },
    OnClick(value) {
        if(value == 'canceled'){
            this.popupStatus = false;
            this.SetCookie({'type': 'google', 'status' : false });
            this.SetCookie({'type': 'third_party', 'status' : false });
            this.SetCookie({'type': 'cookie_settings', 'status' : true });
            this.DeleteCookies();
        }
        if(value == 'accepted'){
            this.popupStatus = false;
            this.SetCookie({'type': 'google', 'status' : true });
            this.SetCookie({'type': 'third_party', 'status' : true });
            this.SetCookie({'type': 'cookie_settings', 'status' : true });
        }
    }
  }
}
</script>

<style lang="scss">
.occlss-alert--cookiepopup {
    position: fixed;
    left: 50%;
    right: 50%;
    top: 1rem;
    -webkit-transform: translate(-50%);
    -ms-transform: translate(-50%);
    transform: translate(-50%);
    max-width: 1100px;
    z-index: 9999;
    font-family: "Open Sans",sans-serif;
    color: #333333;
    font-weight: 400;
}

.occlss-button {
  cursor: pointer;
}
</style>

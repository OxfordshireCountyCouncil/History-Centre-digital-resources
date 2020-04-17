<template>

<div class="occlss-wrapper">

<form class="occlss-form">
  <fieldset v-if="gaText">
        <legend class="occlss-form__group-title occlss-form__group-title--large">Google analytics</legend>
        <p class="occlss-u-bspace-md" v-html="gaText"></p>
        <div class="occlss-form-cntrls ">
            <input type="radio" v-model="google_analytics" id="google-analytics-on" name="google_analytics" value="true" class="occlss-form-cntrls__radiobutton">
            <label class="occlss-form-cntrls__label occlss-form-cntrls__label--small" for="google-analytics-on">on</label>
        </div>
        <div class="occlss-form-cntrls">
            <input type="radio" v-model="google_analytics" id="google-analytics-off" name="google_analytics" value="false" class="occlss-form-cntrls__radiobutton">
            <label class="occlss-form-cntrls__label occlss-form-cntrls__label--small" for="google-analytics-off">off</label>
        </div>
  </fieldset>

    <nav class="occlss-form__controls occlss-u-bspace-large" role="navigation">
    <ul class="occlss-form__listitems">
      <li class="occlss-form__controls-list-item">
        <button @click="saveOptions" class="occlss-button occlss-button--primary">
          {{ smbText }}
        </button>
      </li>
    </ul>
  </nav>
  
</form>

</div>

</template>

<script>
export default {
  props: ['gaText','tpText','smbText'],
  name: "occ-cookie-form",
  data () {
      return {
        google_analytics: ''
      }
  },
  created() {
    const get_google_stats = this.$cookie.get('google_stats');
    const get_cookie_settings = this.$cookie.get('cookie_settings');

    this.google_analytics = get_google_stats;
    
    if(get_google_stats == null) {
        this.SetCookie({'type': 'google', 'status' : false });
    }

    if(get_cookie_settings == null) {
        this.SetCookie({'type': 'cookie_settings', 'status' : false });
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

        if(url != 'localhost') {
            url = "." + url;
        }

        return  url;
    },
    DeleteCookies() {
        this.$cookie.delete('_ga', {domain: this.GetDomain()});
        this.$cookie.delete('_gid', {domain: this.GetDomain()});
        this.$cookie.delete('_gat', {domain: this.GetDomain()});
    },
    saveOptions() {
      this.popupStatus = false;
      this.SetCookie({'type': 'google', 'status' : this.google_analytics });
      this.SetCookie({'type': 'cookie_settings', 'status' : true });
      if(this.google_analytics == 'false') {
              this.DeleteCookies();
      }
    },
    SetCookie(value){
        const date = new Date;
        date.setDate(date.getDate() + 365);

        if(value.type == 'google'){
            this.$cookie.set('google_stats', value.status, { expires: date, domain: this.GetDomain()});
        }

        if(value.type == 'cookie_settings'){
            this.$cookie.set('cookie_settings', value.status, { expires: date, domain: this.GetDomain()});
        }
    },


  }
}
</script>
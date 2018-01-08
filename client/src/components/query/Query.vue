<template>
  <section class="query">
    <div class="input-group ib">
      <input v-model="queryContent.steamid.value" type="text" name="steamid" :class="queryContent.steamid.focus" @focus='inputFocus($event)' @blur='inputBlur($event)'>
      <label>
        <span>64位ID</span>
      </label>
    </div>
    <div class="input-group ib apikey">
      <input v-model="queryContent.apikey.value" type="text" name="apikey" :class="queryContent.apikey.focus" @focus='inputFocus($event)' @blur='inputBlur($event)'>
      <label>
        <span>API密钥</span>
      </label>
    </div>
    <div class="button ib">
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="svg-filters">
        <defs>
          <filter id="wave">
            <feImage id="feImage" xlink:href="../../assets/images/ripple.png" :x="feImage.x" :y="feImage.y" :width="feImage.width" :height="feImage.height" result="ripple"></feImage>
            <feDisplacementMap id="feDisplacementMap" xChannelSelector="R" yChannelSelector="G" color-interpolation-filters="sRGB" in="SourceGraphic" in2="ripple" :scale="feDisplacementMap.scale" result="dm" />
            <feComposite operator="in" in2="ripple"></feComposite>
            <feComposite in2="SourceGraphic"></feComposite>
          </filter>
        </defs>
      </svg>
      <button class="search" type="button" @click="wave($event)">SEARCH</button>
    </div>
  </section>
</template>

<script>
  import anime from 'animejs';

  export default {
    name: 'Query',
    data() {
      return {
        feImage: {
          'x': 0,
          'y': 0,
          'width': 0,
          'height': 0
        },
        feDisplacementMap: {
          scale: 20
        },
        queryContent: {
          steamid: {
            value: '',
            focus: false
          },
          apikey: {
            value: '',
            focus: false
          }
        },
        tips: false
      }
    },
    methods: {
      wave: function(e) {
        const isFF = !!navigator.userAgent.match(/firefox/i);
        this.feImage = {
          'x': isFF ? e.offsetX : e.offsetX + 10,
          'y': isFF ? e.offsetY : e.offsetY + 10,
          'width': 0,
          'height': 0
        };
        this.feDisplacementMap = {
          scale: 20
        };
        anime({
          targets: this.feImage,
          easing: 'easeOutSine',
          duration: 3000,
          x: '-=300',
          y: '-=300',
          width: 600,
          height: 600,
        })
        anime({
          targets: this.feDisplacementMap,
          easing: 'easeOutSine',
          scale: {
            value: 0,
            duration: 2000
          }
        });
        this.query();
      },
      //传值给父组件
      query: function() {
        const steamid = this.queryContent.steamid.value;
        const apikey = this.queryContent.apikey.value;
        this.$emit('query', {
          steamid,
          apikey
        });
      },
      inputFocus: function(e) {
        this.queryContent[e.currentTarget.name].focus = 'focus';
      },
      inputBlur: function(e) {
        if (!this.queryContent[e.currentTarget.name].value) {
          this.queryContent[e.currentTarget.name].focus = false;
        }
      }
    },
    watch: {
      queryContent: {
        deep: true,
        handler: function() {
          sessionStorage.setItem('steamidCache', this.queryContent.steamid.value);
          sessionStorage.setItem('apikeyCache', this.queryContent.apikey.value);
        }
      }
    },
    mounted() {
      this.queryContent.steamid.value = sessionStorage.getItem('steamidCache') ? sessionStorage.getItem('steamidCache') : '';
      this.queryContent.apikey.value = sessionStorage.getItem('apikeyCache') ? sessionStorage.getItem('apikeyCache') : '';
    }
  }
</script>
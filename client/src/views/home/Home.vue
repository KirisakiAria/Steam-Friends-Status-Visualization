<template>
  <div class="home">
    <transition :name="link.class">
      <div v-if="link.show" class="link">
        <a class="github" href="https://github.com/KirisakiAria/Steam-Visualization" target="_blank"> <i class="iconfont">&#xe625;</i>
        </a>
        <a class="bgm" @click="play" :class="{audioPlay:audio.play}" href="javascript:;"> <i class="iconfont">&#xe658;</i>
        </a>
        <audio id="audio" src="../../assets/audio/stay.mp3" preload loop></audio>
      </div>
    </transition>
    <transition :name="header.class">
      <headerView v-if="header.show"></headerView>
    </transition>
    <main class="wrapper">
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="svg-filters">
        <defs>
          <filter id="shake">
            <feTurbulence id="feTurbulence" type="fractalNoise" :baseFrequency="baseFrequency" numOctaves="1" result="warp" />
            <feOffset dx="0" dy="0" result="warpOffset" />
            <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="30" in="SourceGraphic" in2="warpOffset" />
          </filter>
        </defs>
      </svg>
      <transition appear appear-class="mainTitle-appear" appear-active-class="animated mainTitle-active" appear-to-class="mainTitle-appear-to" @after-appear="mtAfterAppear">
        <p class="mainTitle" :style="{filter:filter}" @click="shake($event)" :class="{goTop:mainTitle.goTop}">
          STEAM
          <transition :name="mainTitle.subTitle">
            <span v-if="mainTitle.goTop">{{mainTitle.nowPosition}}</span>
          </transition>
        </p>
      </transition>
      <transition :name="routerView.class">
        <router-view class="routerview"></router-view>
      </transition>
    </main>
    <transition :name="footer.class">
      <footerView v-if="footer.show"></footerView>
    </transition>
  </div>
</template>

<script>
  import anime from 'animejs';
  import headerView from '../../components/header/Header';
  import footerView from '../../components/footer/footer';

  export default {
    name: 'Home',
    data() {
      return {
        audio: {
          play: false
        },
        header: {
          show: false,
          class: 'header-in'
        },
        footer: {
          show: false,
          class: 'footer-in'
        },
        link: {
          show: false,
          class: 'link-in'
        },
        mainTitle: {
          goTop: false,
          subTitle: 'visible-in',
          nowPosition: '',
        },
        routerView: {
          class: 'scale-visible'
        },
        init: false,
        filter: 'none',
        baseFrequency: `0.000001 0.000001`,
        turbVal: {
          val: 0.000001
        },
        tl: {},
      }
    },
    created() {
      sessionStorage.clear();
    },
    methods: {
      shake: function() {
        let ifInit = this.init;
        let that = this;
        if (ifInit) {
          this.tl.restart();
        } else {
          this.tl = anime.timeline({
            easing: 'easeOutCubic',
            begin: () => {
              that.filter = 'url(#shake)';
            },
            complete: () => {
              that.filter = 'none';
            }
          });
          this.tl.add({
            targets: that.turbVal,
            val: 0.8,
            duration: 1200,
          }).add({
            targets: that.turbVal,
            val: 0.001,
            duration: 400,
          });
          this.init = true;
          this.tl.restart();
        }
      },
      mtAfterAppear: function() {
        this.header.show = this.footer.show = this.link.show = true;
      },
      play: function(e) {
        let audio = document.querySelector('#audio');
        if (this.audio.play) {
          audio.pause();
          audio.currentTime = 0;
          this.audio.play = false;
        } else {
          this.audio.play = 'audio-play';
          audio.volume = 0.3;
          audio.play();
        }
      },
    },
    watch: {
      $route: function(to, from) {
        if (to.path == '/') {
          this.mainTitle.goTop = false;
          this.footer.show = true;
        } else {
          this.mainTitle.goTop = true;
          this.footer.show = false;
          this.mainTitle.nowPosition = to.path;
        }
      },
      turbVal: {
        deep: true,
        handler: function() {
          this.baseFrequency = `0.000001 ${this.turbVal.val}`;
        }
      }
    },
    components: {
      headerView,
      footerView,
    }
  }
</script>
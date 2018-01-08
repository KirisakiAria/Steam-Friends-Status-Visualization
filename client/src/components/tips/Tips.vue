<template>
  <section class="tips" id="tips">
    <div class="tooltip__base" :style="base">
      <svg class="tooltip__shape" width="100%" height="100%" viewBox="0 0 400 300">
        <path d="M 32.1,42.7 54.5,257 185,257 193,269 200,282 207,269 214,257 342,257 368,23.9 Z" stroke-dasharray="1102.7830810546875" :style="{'stroke-dashoffset':path.strokeDashoffset}"/></svg>
        <div class="tooltip__content" id="info-sadoc" :style="content">
          <p>{{message}}</p>
          <button type="button" @click="hide()">确定</button>
        </div>
      </div>
    </section>
  </template>

  <script>
  import anime from 'animejs';

  export default {
    name: 'Tips',
    data() {
      return {
        base: {
          opacity: 0,
          ty: 0,
          transform: 'translateY(0)'
        },
        path: {
          strokeDashoffset: 1100,
        },
        content: {
          opacity: 0,
          ty: 0,
          transform: 'translateY(0)'
        },
      }
    },
    props: [
      'message'
    ],
    methods: {
      show: function() {
        anime({
          targets: this.base,
          duration: 400,
          delay: 200,
          easing: 'linear',
          opacity: 1,
          ty: {
            value: '-50%',
            duration: 800,
            easing: 'easeInOutSine'
          }
        });
        anime({
          targets: this.path,
          duration: 800,
          delay: 400,
          easing: 'easeInOutSine',
          strokeDashoffset: 0
        });
        anime({
          targets: this.content,
          duration: 600,
          delay: 800,
          easing: 'easeInOutSine',
          ty: [20, 0],
          opacity: {
            value: 1,
            easing: 'linear',
            duration: 600
          }
        });
      },
      hide: function() {
        let that = this;
        anime({
          targets: this.base,
          duration: 400,
          easing: 'easeInOutSine',
          opacity: 0,
          complete: () => {
            that.$emit('closeTips', false);
          }
        });
      }
    },
    watch: {
      base: {
        deep: true,
        handler: function() {
          this.base.transform = `translateY(${this.base.ty})`;
        }
      },
      content: {
        deep: true,
        handler: function() {
          this.content.transform = `translateY(${this.content.ty})`;
        }
      }
    },
    mounted() {
      this.show();
    }
  }
</script>
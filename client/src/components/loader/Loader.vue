<template>
  <section id="loader" class="loaderView">
    <div class="loader" :style="loader">
      <div class="loader s" :style="loaders"></div>
    </div>
    <p>查询中...</p>
  </section>
</template>

<script>
  import anime from 'animejs';

  export default {
    name: 'Loader',
    data() {
      return {
        loader: {
          transform:'rotate(0)',
          deg:0
        },
        loaders: {
          transform:'rotate(0)',
          deg:1440
        }
      }
    },
    methods: {
      laoding: function() {
        anime({
          targets: this.loader,
          easing: 'easeInOutQuad',
          duration: 1400,
          direction: 'alternate',
          deg: {
            value: 720
          },
          loop: true
        });
        anime({
          targets: this.loaders,
          easing: 'easeInOutQuad',
          duration: 1400,
          direction: 'alternate',
          deg: {
            value: 0
          },
          loop: true
        })
      }
    },
    watch: {
      loader: {
        deep: true,
        handler: function() {
          this.loader.transform = `rotate(${this.loader.deg}deg)`;
        }
      },
      loaders: {
        deep: true,
        handler: function() {
          this.loaders.transform = `rotate(${this.loaders.deg}deg)`;
        }
      }
    },
    mounted() {
      this.laoding();
    }
  }
</script>
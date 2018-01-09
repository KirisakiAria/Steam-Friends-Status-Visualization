<template>
  <section id="charts" class="charts">
    <queryView @query="query"></queryView>
    <section class="chartsContent">
      <transition :name="loadIn">
        <loaderView v-show="loader"></loaderView>
      </transition>
      <transition :name="chartIn">
        <section v-show="chartView" id="chartView" class="chartView"></section>
      </transition>
      <tipsView v-if="tips.show" :message="tips.message" @closeTips="closeTips"></tipsView>
    </section>
  </section>
</template>

<script>
  import echarts from 'echarts';
  import anime from 'animejs';
  import queryView from '../../components/query/Query';
  import loaderView from '../../components/loader/Loader';
  import tipsView from '../../components/tips/Tips';

  export default {
    name: 'Charts',
    data() {
      return {
        loader: false,
        chartView: false,
        loadIn: 'visible-in',
        chartIn: 'visible-in',
        tips: {
          show: false,
          message: ''
        }
      }
    },
    methods: {
      query: function(queryContent) {
        this.chartView = false;
        this.loader = true;
        // this.chart.clear();
        let that = this;
        if (this.exam(queryContent)) {
          this.axios.post(`${this.url}/getChart`, {
            steamid: queryContent.steamid,
            apikey: queryContent.apikey
          }).then(function(res) {
            that.loader = false;
            console.log(res);
            if (res.data.code == 'ECONNRESET' || res.data.code == 'ETIMEDOUT' || res.data.code == 'ENOTFOUND') {
              that.showTips('请求超时，请重试！');
            } else if (res.data.status == 503) {
              that.showTips('503了，请稍后再试！');
            } else {
              that.chartView = true;
              that.$nextTick(function() {
                Object.assign(res.data.tooltip, {
                  formatter: function(obj) {
                    if (that.$route.path.includes('level')) {
                      let value = obj.value;
                      return `昵称:${value[2]}</br>等级:${value[1]}</br>注册时间:${value[3]}-${value[4]}</br>64位ID:${value[6]}</br>`;
                    } else if (that.$route.path.includes('ownedgames')) {
                      let value = obj.value;
                      return `昵称:${value[2]}</br>游戏数:${value[1]}</br>注册时间:${value[3]}-${value[4]}</br>64位ID:${value[6]}</br>`;
                    } else if (that.$route.path.includes('longestPeriod')) {
                      return `APPID:${obj.data.appid}</br>游戏名:${obj.data.name}</br>游戏总时长:${(obj.value/60).toFixed(2)}小时</br>`;
                    }
                  }
                });
                that.chart.setOption(res.data, true);
                that.chartEvent(that.chart);
              });
            }
          }).catch(function(error) {
            that.showTips('请求出错，请重试！');
          });
        }
      },
      exam: function(queryContent) {
        if (!queryContent.steamid || !queryContent.apikey) {
          this.showTips('请将表单填写完整！');
          return false;
        } else {
          return true;
        }
      },
      chartEvent: function(chart) {
        if (this.$route.path.includes('longestPeriod')) {
          chart.on('click', function(e) {
            window.open(`https://store.steampowered.com/app/${e.data.appid}`);
          });
        } else {
          chart.on('click', function(e) {
            window.open(e.value[5]);
          });
        }
      },
      showTips: function(message) {
        this.loader = false;
        this.tips.show = true;
        this.tips.message = message;
      },
      closeTips: function() {
        this.tips.show = false;
      }
    },
    computed: {
      url: function() {
        return this.$route.path
      },
      chart: function() {
        return echarts.init(document.getElementById('chartView'));
      }
    },
    watch:{
      $route:function(){
        this.chartView = false;
        this.loader = false;
      }
    },
    components: {
      queryView,
      loaderView,
      tipsView
    }
  }
</script>
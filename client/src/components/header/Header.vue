<template>
  <header class="header" id="header">
    <button @click="toggle">
      <span></span>
    </button>
    <transition :name="navToggle">
      <nav v-show="act">
        <button @click="toggle">
          <img src="../../assets/images/close.png"></button>
        <ol>
          <li>
            <router-link :to="{name:'level'}" @click.native="toggle">
              <span class="b">LEVEL</span>
              <span class="s">好友等级分布</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{name:'ownedgames'}" @click.native="toggle">
              <span class="b">GAMES</span>
              <span class="s">好友游戏数分布</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{name:'longestPeriod'}" @click.native="toggle">
              <span class="b">HOT</span>
              <span class="s">好友游戏总时长Top10</span>
            </router-link>
          </li>
        </ol>
        <div class="social">
          <div class="ib"></div>
        </div>
      </nav>
    </transition>
  </header>
</template>

<script>
  export default {
    name: 'Header',
    data() {
      return {
        act: false,
        navToggle:'navToggle'
      }
    },
    methods: {
      toggle: function() {
        this.act = !this.act;
      }
    }
  }
</script>
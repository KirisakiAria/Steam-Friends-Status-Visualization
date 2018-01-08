import './style/base-v1.4.css';
import './style/iconfont.css';
import './style/style.css';
import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';

Vue.prototype.axios = axios;

let app = new Vue({
	el: '#app',
	router,
	template: '<App/>',
	components: {
		App
	}
})
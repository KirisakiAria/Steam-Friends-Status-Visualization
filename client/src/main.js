import './style/base-v1.4.css';
import './style/iconfont.css';
import './style/style.css';
import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';

axios.defaults.retry = 50;
axios.defaults.retryDelay = 1000;

axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
	var config = err.config;
	// If config does not exist or the retry option is not set, reject
	if (!config || !config.retry) return Promise.reject(err);

	// Set the variable for keeping track of the retry count
	config.__retryCount = config.__retryCount || 0;

	// Check if we've maxed out the total number of retries
	if (config.__retryCount >= config.retry) {
		// Reject with the error
		return Promise.reject(err);
	}

	// Increase the retry count
	config.__retryCount += 1;

	// Create new promise to handle exponential backoff
	var backoff = new Promise(function (resolve) {
		setTimeout(function () {
			resolve();
		}, config.retryDelay || 1);
	});

	// Return the promise in which recalls axios to retry the request
	return backoff.then(function () {
		return axios(config);
	});
});

Vue.prototype.axios = axios;

let app = new Vue({
	el: '#app',
	router,
	template: '<App/>',
	components: {
		App
	}
})
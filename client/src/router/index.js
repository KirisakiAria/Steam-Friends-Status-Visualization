import Vue from 'vue';
import Router from 'vue-router';
import Charts from '../views/charts/Charts';

Vue.use(Router);

export default new Router({
	mode: 'history',
	routes: [{
		path: '/level',
		name: 'level',
		component: Charts
	}, {
		path: '/ownedgames',
		name: 'ownedgames',
		component: Charts
	}, {
		path: '/longestPeriod',
		name: 'longestPeriod',
		component: Charts
	}]
});
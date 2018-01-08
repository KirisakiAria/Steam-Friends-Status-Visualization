<template>
	<section id="app">
		<HomeView ref="homeView"></HomeView>
	</transition>
</section>
</template>

<script>
	import HomeView from './views/home/Home';

	export default {
		name: 'App',
		components: {
			HomeView
		}
	}
</script>
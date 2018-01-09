'use strict';

const express = require('express');
const router = express.Router();
const request = require('superagent');
// const cheerio = require('cheerio');
const async = require('async');
const config = require('../config/config');

router.get('/', (req, res) => {
	res.status(302).redirect('/');
});

/*先请求出好友列表，分析返回来的数组，根据得到的steamid再分别请求每个人的账户信息*/
router.post('/getChart', (req, res) => {
	let steamid = req.body.steamid;
	let apikey = req.body.apikey;
	request.get(config.firendList.url).query({
		steamid: steamid,
		key: apikey
	}).timeout(0).accept('application/json').then(data => {
		async.mapLimit(data.body.friendslist.friends, 40, async function(friend) {
			let response = await request.get(config.ownedGames.url).query({
				steamid: friend.steamid,
				key: apikey,
				include_appinfo: 1,
				include_played_free_games: 1
			}).timeout(0).accept('application/json').then(data => {
				/*
				push进每个账号游戏时间最长的前10位游戏,
				游戏时间相同则可能push进去>10+的游戏，
				账号内游戏数小于10则全部push，
				最后过滤掉游戏时间为0的游戏。
				*/
				if (data.body.response.games) {
					let gamesListNoSort = data.body.response.games;
					let gamesListSort = gamesListNoSort.sort((a, b) => {
						return b.playtime_forever - a.playtime_forever;
					});
					let top10GamesList = gamesListSort.slice(0, 10);
					return top10GamesList;
				} else {
					return [];
				}
			});
			return response;
		}, (err, results) => {
			if (err) {
				res.send(err);
			} else {
				if (!Array.isArray(results)) {
					res.send(new Error('请求出错，请重试！'));
				} else {
					/*
					遍历二维数组，提取出所有人的APPID，
					然后将每个APPID游玩时间相加，
					最后取时间前十的app。
					*/
					let appIDList = [];
					let existList = []; //用来判断同一appid是否已经push过
					results.forEach(re => {
						re.forEach(e => {
							let ifExist = existList.includes(e.appid);
							if (!ifExist) {
								existList.push(e.appid);
								appIDList.push({
									appid: e.appid,
									appName: e.name
								});
							}
						});
					});
					existList = null;
					let appListNoSort = [];
					appIDList.forEach(ae => {
						let appTime = 0;
						results.forEach(re => {
							re.forEach(e => {
								if (e.appid == ae.appid) {
									appTime += e.playtime_forever;
								}
							});
						});
						appListNoSort.push({
							appid: ae.appid,
							name: ae.appName,
							value: appTime
						});
					});
					let appListSort = appListNoSort.sort((a, b) => {
						return b.value - a.value;
					});
					let appList = appListSort.slice(0, 10);

					let nameList = [];
					appList.forEach(e => {
						nameList.push(e.name);
					});

					let options = {
						title: {
							text: '好友游戏时长Top10',
							subtext: 'Data From Steam WEB API',
							left: 'center'
						},
						tooltip: {
							trigger: 'item'
						},
						legend: {
							orient: 'vertical',
							left: 'left',
							data: nameList,
							tooltip: {
								show: true
							}
						},
						series: [{
							name: '访问来源',
							type: 'pie',
							radius: '70%',
							center: ['50%', '50%'],
							data: appList,
							roseType: 'radius',
							label: {
								normal: {
									textStyle: {
										color: '#999'
									}
								}
							},
							labelLine: {
								normal: {
									lineStyle: {
										color: '#999'
									},
									smooth: 0.2,
									length: 10,
									length2: 20
								}
							},
							itemStyle: {
								emphasis: {
									shadowBlur: 50,
									shadowOffsetX: 0,
									shadowColor: 'rgba(0, 0, 0, 0.5)'
								}
							},
							animationType: 'scale',
							animationEasing: 'elasticOut',
							animationDelay: function(idx) {
								return Math.random() * 200;
							}
						}]
					};
					res.send(options);
				}
			}
		});
	});
});

module.exports = router;
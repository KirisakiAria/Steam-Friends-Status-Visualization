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
	}).timeout(600000).accept('application/json').then(data => {
		async.mapLimit(data.body.friendslist.friends, 30, async function(friend) {
			let response = await request.get(config.summaries.url).query({
				steamids: friend.steamid,
				key: apikey
			}).timeout(600000).accept('application/json').then(data => {
				let user = {
					steamid: data.body.response.players[0].steamid,
					personaname: data.body.response.players[0].personaname,
					profileurl: data.body.response.players[0].profileurl,
					timecreated: data.body.response.players[0].timecreated
				}
				return user;
			});
			return response;
		}, (err, results) => {
			if (err) {
				res.send(err);
			} else {
				async.mapLimit(results, 30, async function(friend) {
					let response = await request.get(config.ownedGames.url).query({
						steamid: friend.steamid,
						key: apikey
					}).timeout(600000).accept('application/json').then(data => {
						Object.assign(friend, {
							games: data.body.response.game_count
						});
						return friend;
					});
					return response;
				}, (err, results) => {
					if (err) {
						res.send(err);
					} else {
						if (!Array.isArray(results)) {
							res.send(new Error('请求出错！'));
						} else {
							let gamesList = [];
							let maxGames = 0;
							results.forEach((e) => {
								let year = new Date(e.timecreated * 1000).getFullYear() ? new Date(e.timecreated * 1000).getFullYear() : 0;
								let month = new Date(e.timecreated * 1000).getMonth() + 1 ? new Date(e.timecreated * 1000).getMonth() + 1 : 0;
								let games = e.games;
								let personaname = e.personaname;
								let profileurl = e.profileurl;
								let steamid = e.steamid;
								gamesList.push([new Date().getFullYear() - (year + month / 12), games, personaname, year, month, profileurl, steamid]);
							});
							gamesList.forEach((e) => {
								maxGames = Math.max(e[1], maxGames);
							});
							if (maxGames % 500 !== 0) {
								for (maxGames; maxGames++; maxGames < maxGames + 500) {
									if (maxGames % 500 == 0) {
										break;
									}
								}
							}
							const options = {
								title: {
									text: '好友游戏数分布图',
									subtext: 'Data From Steam WEB API',
									left: 'right'
								},
								tooltip: {
									padding: 15,
									backgroundColor: 'rgba(0,0,0,.5)',
									fontSize: 16,
								},
								xAxis: {
									type: 'value',
									name: '账户年限',
									nameTextStyle: {
										fontSize: 20
									},
									min: 0,
									max: new Date().getFullYear() - 2004,
									interval: 1,
									scale: true,
									splitNumber: 4,
									splitLine: {
										show: false
									},
									axisLine: {
										lineStyle: {
											color: '#666'
										}
									},
									splitLine: {
										lineStyle: {
											type: 'dashed'
										}
									}
								},
								yAxis: {
									type: 'value',
									name: '游戏数',
									nameTextStyle: {
										fontSize: 20
									},
									min: 0,
									max: maxGames,
									interval: 500,
									splitLine: {
										show: false
									},
									axisLine: {
										lineStyle: {
											color: '#666'
										}
									},
									splitLine: {
										lineStyle: {
											type: 'dashed'
										}
									}
								},
								toolbox: {
									show: true,
									left: 'center',
									feature: {
										mark: {
											show: true
										},
										dataZoom: {
											show: true
										},
										dataView: {
											show: true,
											readOnly: false
										},
										restore: {
											show: true
										},
										saveAsImage: {
											show: true
										}
									}
								},
								series: [{
									type: 'scatter',
									symbolSize: function(data) {
										return 10;
									},
									itemStyle: {
										normal: {
											color: '#e74c3c'
										}
									},
									data: gamesList
								}]
							};
							res.send(options);
						}
					}
				});
			}
		});
	});
});

module.exports = router;
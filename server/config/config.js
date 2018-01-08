'use strict';

module.exports = {
	port: 8088,
	firendList: {
		url: 'https://api.steampowered.com/ISteamUser/GetFriendList/v1/'
	},
	summaries: {
		url: 'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/'
	},
	level: {
		url: 'https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/'
	},
	ownedGames: {
		url: 'https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/'
	}
}
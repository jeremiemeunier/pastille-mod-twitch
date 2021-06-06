const Discord = require('discord.js')
const path = require('path');
const fs = require('fs');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

let booty_settings = JSON.parse(fs.readFileSync('booty.json'));
let secret_settings = JSON.parse(fs.readFileSync('secret.json'));
let client = new Discord.Client();

function discordBotLive(settings) {
	var JsonUsers = fs.readFileSync('streamer.json');
	var dataUsers = JSON.parse(JsonUsers);
	var dataLenght = Object.keys(dataUsers).length;

	for(var i = 0; i < dataLenght; i++) {
		let data = dataUsers[i];
		isonliveid(data, settings);
	}
}
function xhrCheck(xhr) {
	if(xhr.readyState === 4 && xhr.status === 200) { return true; }
	else { return false; }
}

function boot() {
	let server = client.guilds.cache.get(secret_settings.GUILD_ID);
	let announce = client.channels.cache.find(channel => channel.name === booty_settings.channel.announce)
	let debug = client.channels.cache.find(channel => channel.name === booty_settings.channel.debug)
	let every = server.roles.cache.find(role => role.name === '@everyone');
	debug.send(`i'm in the place and i'm listening for the futur streaming`);
	
	if(booty_settings.waiting == true) {
		setInterval(function() {
			discordBotLive({"announce":announce,"debug":debug,"every":every});
		}, booty_settings.countdown);
	}
	else { discordBotLive({"announce":announce,"debug":debug,"every":every}); }
}

function isonliveid(data, settings) {
	let dateajd = new Date();
	let twitchData = new XMLHttpRequest();
	let twitchAuth = new XMLHttpRequest();
	let twitchAPI = booty_settings.api.twitch_stream + data.twitch_id;
	let twitchToken = `https://id.twitch.tv/oauth2/token?client_id=${secret_settings.TWITCH_CLIENT_TOKEN}&client_secret=${secret_settings.TWITCH_SECRET_TOKEN}&grant_type=client_credentials&scope=viewing_activity_read`;
	
	twitchAuth.onreadystatechange = function(e) {
		if(xhrCheck(twitchAuth)) {
			let twitchCode = JSON.parse(twitchAuth.responseText);

			twitchData.onreadystatechange = function() {
				if(xhrCheck(twitchData) === true) {
					let twitchResponse = JSON.parse(twitchData.responseText).data[0];

					if(twitchResponse != undefined){
						let streamClock = Date.parse(twitchResponse.started_at);
						let now = Date.parse(new Date());
						let pre = now - booty_settings.countdown;
						let nex = now + booty_settings.countdown;

						if(streamClock > pre && streamClock < nex && booty_settings.debug == false) {
							settings.announce.send(`Hey @everyone ! <@${data.discord_id}> est actuellement en live sur https://twitch.tv/${data.twitch_name} il stream **${twitchResponse.title}** sur **${twitchResponse.game_name}**`);
						}
                    }
				}
			}
			twitchData.open('GET', twitchAPI, false);
			twitchData.setRequestHeader('client-id', secret_settings.TWITCH_CLIENT_TOKEN);
			twitchData.setRequestHeader('Authorization', 'Bearer ' + twitchCode['access_token']);
			twitchData.send();
		}
	}
	twitchAuth.open('POST', twitchToken, false);
	twitchAuth.send();
}

client.on('ready', () => { boot(); });
client.login(secret_settings.BOT_TOKEN);
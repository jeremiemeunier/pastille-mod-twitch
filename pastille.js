const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const fs = require('fs');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

let booty_settings = JSON.parse(fs.readFileSync('data/pastille.json'));
let secret_settings = JSON.parse(fs.readFileSync('data/secret.json'));

logger(`\x1b[42m\x1b[30m pastille  [${booty_settings.version}] INITIALIZE \x1b[0m `, false);

if(booty_settings.debug == true) {
	logger(`\x1b[43m\x1b[30m DEBUG IS ENABLED \x1b[0m `, false);
	logger(`using \x1b[34m${booty_settings.channel.debug}\x1b[0m channel to send his messages`, false);
} else {
	logger(`\x1b[43m\x1b[30m DEBUG IS DISABLED \x1b[0m `, false);
	logger(`using \x1b[34m${booty_settings.channel.announce}\x1b[0m channel to send his messages`, false);
}

function logger(txt, timed = true) {
	let logs_tag = `\x1b[32mpastille[${booty_settings.version}]`;

	if(timed == true) {
		logs_tag += ` ${dateReturn()} \x1b[0m `;
	} else { logs_tag += `\x1b[0m `; }

	console.log(`${logs_tag}${txt}`);
	let ajd = new Date();

	if(ajd.getDate() < 10) { ajdDate = `0${ajd.getDate()}`; } else { ajdDate = ajd.getDate(); }
	if(Number(ajd.getMonth() + 1) < 10) { ajdMonth = `0${Number(ajd.getMonth())+1}`; } else { ajdMonth = Number(ajd.getMonth())+1; }

	let ajd_compose = `${ajdMonth}-${ajdDate}-${ajd.getFullYear()}`;
	fs.writeFile(`logs/pastille-${ajd_compose}.log`, `${logs_tag}${txt}\r\n`, { flag: 'a' }, err => {
		if(err) {
			console.log(err);
			return;
		}
	});
}

function start_stream(str, mtn) {
	if(mtn == undefined) { mtn = Date.parse(new Date()); }

		str = Date.parse(str);
	let pre = mtn - booty_settings.countdown;
	let nex = mtn + booty_settings.countdown;

	if(str > pre && str < nex) { return true; } else { return false; }
}

function discordBotLive(settings) {
	var JsonUsers = fs.readFileSync('data/streamer.json');
	var dataUsers = JSON.parse(JsonUsers);
	var dataLenght = Object.keys(dataUsers).length;

	for(var i = 0; i < dataLenght; i++) {
		let data = dataUsers[i];
		if(booty_settings.debug == true) { logger(`\x1b[43m\x1b[30m DEBUG : Avancement : ${i}/${dataLenght - 1})] \x1b[0m `); }
		isonliveid(data, settings);
	}
}

function xhrCheck(xhr) {
	if(booty_settings.debug == true) {
		logger(`\x1b[43m\x1b[30m DEBUG : CHECK [(STATE : ${xhr.readyState})(STATUS : ${xhr.status})] \x1b[0m `);
	}
	if(xhr.readyState === 4 && xhr.status === 200) { return true; }
	else { return false; }
}

function dateReturn(ajd) {
	let ret = '';

	if(ajd == undefined) { ajd = new Date(); }

	if(ajd.getHours() < 10) { ret += `0${ajd.getHours()}:`; } else { ret += `${ajd.getHours()}:`; }
	if(ajd.getMinutes() < 10) { ret += `0${ajd.getMinutes()}:`; } else { ret += `${ajd.getMinutes()}:`; }
	if(ajd.getSeconds() < 10) { ret += `0${ajd.getSeconds()}`; } else { ret += `${ajd.getSeconds()}`; }

	if(ajd.getMilliseconds() < 10 && ajd.getMilliseconds() < 100) { ret += `.00${ajd.getMilliseconds()}`; }
	else if(ajd.getMilliseconds() > 10 && ajd.getMilliseconds() < 100) { ret += `.0${ajd.getMilliseconds()}`; }
	else { ret += `.${ajd.getMilliseconds()}`; }

	return ret;
}

function boot() {
	logger(`as \x1b[34m${client.user.tag}\x1b[0m`, false);
	if(booty_settings.waiting == true) {
		logger(`countdown : \x1b[34m${booty_settings.countdown}ms\x1b[0m`, false);
		logger(`as now starting countdown`, false);
	}
	else { logger(`is to exited to wait`, false); }

	let server = client.guilds.cache.get(secret_settings.GUILD_ID);
	let announce = client.channels.cache.find(channel => channel.name === booty_settings.channel.announce)
	let debug = client.channels.cache.find(channel => channel.name === booty_settings.channel.debug)
	let every = server.roles.cache.find(role => role.name === '@everyone');

	if(booty_settings.debug == true) {
		logger(`\x1b[43m\x1b[30m START VAR SETTINGS \x1b[0m `, false);
		logger(`as set channel \x1b[34m${booty_settings.channel.announce}\x1b[0m to \x1b[34m${announce.id}\x1b[0m`, false);
		logger(`as set channel \x1b[34m${booty_settings.channel.debug}\x1b[0m to \x1b[34m${debug.id}\x1b[0m`, false);
		logger(`as set everyone to \x1b[34m${every.id}\x1b[0m`, false);
		logger(`\x1b[43m\x1b[30m END VAR SETTINGS \x1b[0m `, false);
	}

	logger(`send a message in \x1b[34m${booty_settings.channel.debug}\x1b[0m`, false);
	const bootEmbed = new MessageEmbed()
		.setColor('#5865f2')
		.setTitle('pastille as initialized')
		.setDescription('pastille[live_notif_mod] as full operate at ' + dateReturn(new Date()))
		.addFields(
			{ name: 'Debug', value: booty_settings.debug.toString() },
			{ name: 'Announce channel', value: announce.toString() },
			{ name: 'Announce role', value: '<@&' + booty_settings.role.announce.toString() + '>' }
		)
		.setTimestamp()
		.setFooter({ text: '— pastille ' + booty_settings.version.toString() });
		
	debug.send({ embeds: [bootEmbed] });

	logger(`is initialized at \x1b[34m${dateReturn(new Date())}\x1b[0m`, false);
	logger(`\x1b[42m\x1b[30m pastille  [${booty_settings.version}] INITIALIZED \x1b[0m `, false);
	
	if(booty_settings.waiting == true) {
		setInterval(function() {
			logger(`as waiting \x1b[34m${booty_settings.countdown}ms\x1b[0m`);
			logger(`as starting his work`);
			discordBotLive({"announce":announce,"debug":debug,"every":every});
			logger(`as ending his work`);
			logger(`as now starting countdown`);
		}, booty_settings.countdown);
	}
	else { discordBotLive({"announce":announce,"debug":debug,"every":every}); }
}

function isonliveid(data, settings) {
	let twitchData = new XMLHttpRequest();
	let twitchAuth = new XMLHttpRequest();
	let twitchAPI = booty_settings.api.twitch_stream + data.twitch_id;
	let twitchToken = `https://id.twitch.tv/oauth2/token?client_id=${secret_settings.TWITCH_CLIENT_TOKEN}&client_secret=${secret_settings.TWITCH_SECRET_TOKEN}&grant_type=client_credentials&scope=viewing_activity_read`;
	
	twitchAuth.onreadystatechange = function(e) {
		if(xhrCheck(twitchAuth)) {
			if(booty_settings.debug == true) {
				logger(`AUTH : [\x1b[32mDONE\x1b[0m  (STATUS : ${twitchAuth.status})(STATE : ${twitchAuth.readyState})]`); }
			let twitchCode = JSON.parse(twitchAuth.responseText);

			twitchData.onreadystatechange = function() {
				if(xhrCheck(twitchData) === true) {
					if(booty_settings.debug == true) {
						logger(`DATA : [\x1b[32mDONE\x1b[0m  (STATUS : ${twitchData.status})(STATE : ${twitchData.readyState})]`); }
					let twitchResponse = JSON.parse(twitchData.responseText).data[0];

					if(twitchResponse != undefined){
						if(booty_settings.debug == true) {
							logger(`ETAT : [\x1b[32mONLINE \x1b[0m (${data.twitch_id})]`); }

						if(start_stream(twitchResponse.started_at) && booty_settings.debug == false) {
							if(data.discord_id !== undefined) {
								if(data.notif_line !== undefined) {
									settings.announce.send(`Hey <@&${booty_settings.role.announce.toString()}> ! <@${data.discord_id}> est actuellement en live sur https://twitch.tv/${data.twitch_name.toString()}. ${data.notif_line}`);
								} else {
									settings.announce.send(`Hey <@&${booty_settings.role.announce.toString()}> ! <@${data.discord_id}> est actuellement en live sur https://twitch.tv/${data.twitch_name.toString()} il stream **${twitchResponse.title}** sur **${twitchResponse.game_name}**`);
								}
							} else {
								if(data.notif_line !== undefined) {
									settings.announce.send(`Hey <@&${booty_settings.role.announce.toString()}> ! ${data.twitch_name.toString()} est actuellement en live sur https://twitch.tv/${data.twitch_name.toString()}. ${data.notif_line}. Il stream **${twitchResponse.title}** sur **${twitchResponse.game_name}**`);
								} else {
									settings.announce.send(`Hey <@&${booty_settings.role.announce.toString()}> ! ${data.twitch_name.toString()} est actuellement en live sur https://twitch.tv/${data.twitch_name.toString()} il stream **${twitchResponse.title}** sur **${twitchResponse.game_name}**`);
								}
							}
							logger(`\x1b[41m Send a message \x1b[47m\x1b[30m ${data.twitch_name} \x1b[0m`);
							logger(`\x1b[41m Start at ${twitchResponse.started_at} \x1b[47m\x1b[30m ${data.twitch_name} \x1b[0m `);
						}
						else if(start_stream(twitchResponse.started_at) && booty_settings.debug == true) {
							logger(`\x1b[41m Envoie le message \x1b[0m `);
							logger(`\x1b[41m Start at ${twitchResponse.started_at} \x1b[47m\x1b[30m ${data.twitch_name} \x1b[0m `);
							settings.debug.send(`Hey <@&${booty_settings.role.announce.toString()}> ! <@${data.discord_id}> est actuellement en live sur https://twitch.tv/${data.twitch_name} il stream **${twitchResponse.title}** sur **${twitchResponse.game_name}**`);
						}
						else {
							logger(`\x1b[41m No message \x1b[47m\x1b[30m ${data.twitch_name} \x1b[0m `);
							logger(`\x1b[41m Start at ${twitchResponse.started_at} \x1b[47m\x1b[30m ${data.twitch_name} \x1b[0m `);
						}
                    }
                    else {
						if(booty_settings.debug == true) {
							logger(`ETAT : [\x1b[31mOFFLINE \x1b[0m (${data.twitch_name})]`); }
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
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, EmbedBuilder, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const config_settings = JSON.parse(fs.readFileSync('data/mod_twitch.json'));
const secret_settings = JSON.parse(fs.readFileSync('data/secret.json'));

// Base function for optimal working

function fc_stream_start(str, mtn) {
	if(mtn == undefined) { mtn = Date.parse(new Date()); }

		str = Date.parse(str);
	let pre = mtn - config_settings.countdown;
	let nex = mtn + config_settings.countdown;

	if(str > pre && str < nex) { return true; } else { return false; }
}
function fc_xhr_verifier(xhr) {
	if(xhr.readyState === 4 && xhr.status === 200) { return true; }
	else { return false; }
}
function fc_dateReturn(ajd) {
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
function fc_logger(txt, timed = true) {
	let logs_tag = `\x1b[32mmod_twitch[${config_settings.version}]`;

	if(timed == true) {
		logs_tag += ` ${dateReturn()} \x1b[0m `;
	} else { logs_tag += `\x1b[0m `; }

	console.log(`${logs_tag}${txt}`);
	let ajd = new Date();

	if(ajd.getDate() < 10) { ajdDate = `0${ajd.getDate()}`; } else { ajdDate = ajd.getDate(); }
	if(Number(ajd.getMonth() + 1) < 10) { ajdMonth = `0${Number(ajd.getMonth())+1}`; } else { ajdMonth = Number(ajd.getMonth())+1; }

	let ajd_compose = `${ajdMonth}-${ajdDate}-${ajd.getFullYear()}`;
	fs.writeFile(`logs/mod_twitch-${ajd_compose}.log`, `${logs_tag}${txt}\r\n`, { flag: 'a' }, err => {
		if(err) {
			console.log(err);
			return;
		}
	});
}
function fc_startlog() {
    let server = client.guilds.cache.get(secret_settings.GUILD_ID);
	let announce = client.channels.cache.find(channel => channel.name === config_settings.channel.announce)
	let debug = client.channels.cache.find(channel => channel.name === config_settings.channel.debug)
	let every = server.roles.cache.find(role => role.name === '@everyone');

    fc_logger(`as \x1b[34m${client.user.tag}\x1b[0m`, false);
    fc_logger(`\x1b[43m\x1b[30m START VAR SETTINGS \x1b[0m `, false);
    fc_logger(`as set channel \x1b[34m${config_settings.channel.announce}\x1b[0m to \x1b[34m${announce.id}\x1b[0m`, false);
    fc_logger(`as set channel \x1b[34m${config_settings.channel.debug}\x1b[0m to \x1b[34m${debug.id}\x1b[0m`, false);
    fc_logger(`as set everyone to \x1b[34m${every.id}\x1b[0m`, false);
    fc_logger(`\x1b[43m\x1b[30m END VAR SETTINGS \x1b[0m `, false);
    fc_logger(`is initialized at \x1b[34m${fc_dateReturn(new Date())}\x1b[0m`, false);
	fc_logger(`\x1b[42m\x1b[30m mod_twitch [${config_settings.version}] INITIALIZED \x1b[0m `, false);
}

// mod_twitch function

function fc_autoBotChecker(settings) {
	var JsonUsers = fs.readFileSync('data/streamer.json');
	var dataUsers = JSON.parse(JsonUsers);
	var dataLenght = Object.keys(dataUsers).length;

	for(var i = 0; i < dataLenght; i++) {
		let data = dataUsers[i];
		fc_isOnLive(data, settings);
	}
}
function fc_isOnLive(data, settings) {
    let _XML_data = new XMLHttpRequest();
    let _XML_auth = new XMLHttpRequest();
    let _API_data = config_settings.api.twitch_stream + data.twitch_id;
    let _API_auth = `https://id.twitch.tv/oauth2/token?client_id=${secret_settings.TWITCH_CLIENT_TOKEN}&client_secret=${secret_settings.TWITCH_SECRET_TOKEN}&grant_type=client_credentials&scope=viewing_activity_read`;

    _XML_auth.onreadystatechange = function(e) {
        if(fc_xhr_verifier(_XML_auth)) {
            let _API_auth_token = JSON.parse(_XML_auth.responseText);

            _XML_data.onreadystatechange = function(e) {
                if(fc_xhr_verifier(_XML_data)) {
                    let _API_data_response = JSON.parse(_XML_data.responseText).data[0];

                    if(_API_data_response != undefined) {
                        if(fc_stream_start(_API_data_response.started_at)) {
                            let live_button = new ActionRowBuilder()
                                                        .addComponents(
                                                            new ButtonBuilder()
                                                                    .setLabel('Rejoindre en live')
                                                                    .setStyle(ButtonStyle.Link)
                                                                    .setURL(`https://twitch.tv/${data.twitch_name.toString()}`)
                                                        );
                            let live_txt = `Hey <@&${config_settings.role.announce.toString()}> ! ${data.twitch_name.toString()} est actuellement en live. Il stream : **${_API_data_response.title}** sur **${_API_data_response.game_name}**`;
                            settings.announce.send({ content: live_txt, components: [live_button] });
                        }
                    }
                }
            }
            _XML_data.open('GET', _API_data, false);
			_XML_data.setRequestHeader('client-id', secret_settings.TWITCH_CLIENT_TOKEN);
			_XML_data.setRequestHeader('Authorization', 'Bearer ' + _API_auth_token['access_token']);
			_XML_data.send();
        }
    }
    _XML_auth.open('POST', _API_auth, false);
	_XML_auth.send();
}

function fc_booter() {
	let server = client.guilds.cache.get(secret_settings.GUILD_ID);
	let announce = client.channels.cache.find(channel => channel.name === config_settings.channel.announce)
	let debug = client.channels.cache.find(channel => channel.name === config_settings.channel.debug)
	let every = server.roles.cache.find(role => role.name === '@everyone');

	let bootEmbed = new EmbedBuilder()
                            .setColor('#5865f2')
                            .setTitle('mod_twitch as initialized')
                            .setDescription('mod_twitch[live_notif_mod] as full operate at ' + fc_dateReturn(new Date()))
                            .addFields(
                                { name: 'Debug', value: config_settings.debug.toString() },
                                { name: 'Announce channel', value: announce.toString() },
                                { name: 'Announce role', value: '<@&' + config_settings.role.announce.toString() + '>' }
                            )
                            .setTimestamp()
                            .setFooter({ text: '— mod_twitch ' + config_settings.version.toString() });
	debug.send({ embeds: [bootEmbed] });
    fc_startlog();

	if(config_settings.waiting == true) {
		setInterval(function() {
			fc_autoBotChecker({"announce":announce,"debug":debug,"every":every});
		}, config_settings.countdown);
	}
	else { fc_autoBotChecker({"announce":announce,"debug":debug,"every":every}); }
}

client.on('ready', () => { fc_booter(); });
client.login(secret_settings.BOT_TOKEN);
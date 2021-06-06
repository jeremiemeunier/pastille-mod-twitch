class Booty {
    #fs = require('fs');
    #XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

    /**
     * Construct Booty Class
     * @param {JSON} settings 
     * @param {JSON} secrets 
     * @param {JSON} streamers
     */

    constructor(settings, secrets, streamers) {
        this.settings = settings;
        this.secrets = secrets;
        this.streamers = streamers;
    }

    /**
     * Create log in console and in a log file
     * @param {String} log 
     */

    #logger(log) {
        let logs_tag = `\x1b[32mbootyJS[${booty_settings.version}]`;

        if(timed == true) {
            logs_tag += ` ${this.#dateReturn()} \x1b[0m `;
        } else { logs_tag += `\x1b[0m `; }

        console.log(`${logs_tag}${txt}`);
        let ajd = new Date();
        this.#fs.writeFile(`logs/booty-${ajd.getDate()}-${ajd.getMonth()}-${ajd.getFullYear()}.log`, `${logs_tag}${txt}\r\n`, { flag: 'a' }, err => {
            if(err) { console.log(err); return; } });
    }

    /**
     * Return a date in hh:mm:ss.ms format
     * @param {Object} [ajd] Date Object
     * @returns {String} hh:mm:ss.ms
     */

    #dateReturn(ajd = new Date()) { 
        let ret = '';
        if(ajd.getHours() < 10) { ret += `0${ajd.getHours()}:`; } else { ret += `${ajd.getHours()}:`; }
        if(ajd.getMinutes() < 10) { ret += `0${ajd.getMinutes()}:`; } else { ret += `${ajd.getMinutes()}:`; }
        if(ajd.getSeconds() < 10) { ret += `0${ajd.getSeconds()}`; } else { ret += `${ajd.getSeconds()}`; }
        if(ajd.getMilliseconds() < 10 && ajd.getMilliseconds() < 100) { ret += `.00${ajd.getMilliseconds()}`; }
        else if(ajd.getMilliseconds() > 10 && ajd.getMilliseconds() < 100) { ret += `.0${ajd.getMilliseconds()}`; }
        else { ret += `.${ajd.getMilliseconds()}`; }
        return ret;
    }

    /**
     * Test if an XMLHttpRequest as finished
     * @param {Object} xhr XHLHttpRequest Object
     * @returns {Boolean}
     */

    #xhrChecker(xhr) {
        if(xhr.readyState === 4 && xhr.status === 200) { return true; }
        else { return false; }
    }

    #booty(channels) {
        let nb_streamer = Object.keys(this.streamers).length;

        for(var i = 0; i < nb_streamer; i++) {
            this.#live_viewer(channels, this.streamers[i]);
        }
    }

    /**
     * Return a String with URL to send an API Request
     * @param {String} api_name
     * @param {JSON} settings
     * @returns {String}
     */

    #apiMaker (api_name, settings) {
        if(api_name === 'TWOA1') {
            return `https://id.twitch.tv/oauth2/token?client_id=${settings.public_token}
            &client_secret=${settings.secret_token}&grant_type=client_credentials&scope=viewing_activity_read`;
        }
        else if(api_name === 'TWSD1') {
            return `https://api.twitch.tv/helix/streams?user_id=${settings.data_token}`;
        }
    }

    /**
     * Test if a streamer_id twitch is on live
     * @param {JSON} settings
     */

    #live_viewer(settings) {
        let api_oauth = new this.#XMLHttpRequest();
        let api_data = new this.#XMLHttpRequest();

        api_oauth.onreadystatechange = function(e) {
            if(this.#xhrChecker(api_oauth)) {
                let oauth_response = JSON.parse(api_oauth.reponseText);

                api_data.onreadystatechange = function(e) {
                    if(this.#xhrChecker(api_oauth)) {
                        let data = api_data.reponseText;
                        if(data != undefined) {
                            console.log('bouh');
                        }
                        else { console.log('ouin'); }
                    }
                }

                api_data.open('GET', this.#apiMaker('TWSD1', {"data_token":settings.streamer_id}, false));
                api_data.setRequestHeader('client-id', this.secret_settings.TWITCH_SECRET_TOKEN);
                api_data.setRequestHeader('Authorization', `Bearer ${oauth_response}`);
                api_data.send();
            }
        }
        api_oauth.open('POST', this.#apiMaker('TWOA1', {"public_token":this.secrets.TWITCH_CLIENT_TOKEN, "secret_token":this.secrets.TWITCH_SECRET_TOKEN}), false);
        api_oauth.send();
    }

    /**
     * Boot the bot
     * @param {Object} client Discord.client Object
     */

    boot(client) {
        client.on('ready', () => {
            this.#logger(`as \x1b[34m${client.user.tag}\x1b[0m`, false);
            if(booty_settings.waiting == true) {
                this.#logger(`countdown : \x1b[34m${booty_settings.countdown}ms\x1b[0m`, false);
                this.#logger(`as now starting countdown`, false);
            }
            else { this.#logger(`is to exited to wait`, false); }
        
            let server = client.guilds.cache.get(secret_settings.GUILD_ID);
            let announce = client.channels.cache.find(channel => channel.name === booty_settings.channel.announce)
            let debug = client.channels.cache.find(channel => channel.name === booty_settings.channel.debug)
            let every = server.roles.cache.find(role => role.name === '@everyone');
        
            if(booty_settings.debug == true) {
                this.#logger(`\x1b[43m\x1b[30m START VAR SETTINGS \x1b[0m `, false);
                this.#logger(`as set channel \x1b[34m${booty_settings.channel.announce}\x1b[0m to \x1b[34m${announce.id}\x1b[0m`, false);
                this.#logger(`as set channel \x1b[34m${booty_settings.channel.debug}\x1b[0m to \x1b[34m${debug.id}\x1b[0m`, false);
                this.#logger(`as set everyone to \x1b[34m${every.id}\x1b[0m`, false);
                this.#logger(`\x1b[43m\x1b[30m END VAR SETTINGS \x1b[0m `, false);
            }
        
            this.#logger(`send a message in \x1b[34m${booty_settings.channel.debug}\x1b[0m`, false);
            debug.send(`i'm in the place and i'm listening for the futur streaming`);
            this.#logger(`is initialized at \x1b[34m${this.#dateReturn(new Date())}\x1b[0m`, false);
            this.#logger(`\x1b[42m\x1b[30m booty JS  [${booty_settings.version}] INITIALIZED \x1b[0m `, false);
            
            if(booty_settings.waiting == true) {
                setInterval(function() {
                    this.#logger(`as waiting \x1b[34m${booty_settings.countdown}ms\x1b[0m`);
                    this.#logger(`as starting his work`);
                    this.#booty({"announce":announce,"debug":debug,"every":every});
                    this.#logger(`as ending his work`);
                    this.#logger(`as now starting countdown`);
                }, booty_settings.countdown);
            }
            else { discordBotLive({"announce":announce,"debug":debug,"every":every}); }
        });
        client.login(this.secrets.BOT_TOKEN);
    }
}
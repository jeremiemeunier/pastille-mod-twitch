const Discord = require('discord.js');
const fs = require('fs');
const Booty = require('booty-class.js');

// ---------------------------------------- \\

let streamer = JSON.parse(fs.readFileSync('streamer.json'));
let settings = JSON.parse(fs.readFileSync('booty.json'));
let secret = JSON.parse(fs.readFileSync('secret.json'));

let booty = new Booty(settings, secret, streamer);

booty.boot(new Discord.client());
# pastille

 Create a discord js bot addon's for notification your community when your favourite or friendly (if is in the configuration file) streamer start a live on twitch.
 
 > I am currently working on a shell script solution to automatically install and launch pastille-mod-twitch </blockquote>
 
 ## Configuration
 
 Install npm and nodejs 16 and upload all files in your folder. Create a `data` folder.
 
 Run : `npm update`

### Settings files

You have three files of configuration that will need to create in the `data` folder :

- mod_twitch.json
- secret.json
- streamer.json

#### mod_twitch.json

This file is required for configure all parameters of the bot and his structure is :

```
{
    "countdown": "300000", /* An countdown in miliseconds (actually 5 minutes) */
    "version": "v0.5",
    "debug": false,
    "waiting": true,
    "channel": {
        "debug": [YOUR_DISCORD_CHANNEL_NAME],
        "announce": [YOUR_DISCORD_CHANNEL_NAME]
    },
    "role": {
        "announce": [YOUR_DISCORD_ROLE_ID],
        "community": [YOUR_DISCORD_ROLE_ID]
    },
    "api": {
        "twitch_stream": "https://api.twitch.tv/helix/streams?user_id=",
        "twitch_oauth": "https://id.twitch.tv/oauth2/token?client_id="
    }
}
```

#### secret.json

```
{
    "BOT_TOKEN": [YOUR_DISCORD_BOT_TOKEN],
    "BOT_OWNER_ID": [YOUR_DISCORD_ID],
    "TWITCH_SECRET_TOKEN": [YOUR_TWITCH_SECRET_TOKEN],
    "TWITCH_CLIENT_TOKEN": [YOUR_TWITCH_CLIENT_TOKEN],
    "GUILD_ID": [YOUR_DISCORD_SERVER_ID]
}
```

#### streamer.json

This file is the listing of all streamer who want to be notified. Mostly important to follow indexes (0, 1, 2, ...).
You have different parameters :
- `discord_id` → The streamer discord id's (Optionnal)
- `discord_name` → The streamer discord name's (Optionnal)
- `twitch_id` → The streamer twitch id's (Required) (Working on a solution to find easy this information)
- `twitch_name` → The streamer twitch name's (Required) (You find this in the URL bar : twitch.tv/[STREAMER_NAME])
- `progress` → If you want to push up this streamer (Optionnal) (This feature isn't implemented for this time)
- `notif_line` → If you want to add a personal text with the default message (Optionnal)

```
{
    "0": {
        "discord_id": [USER_DISCORD_ID],
        "discord_name": [USER_DISCORD_NAME],
        "twitch_id": [TWITCH_ID],
        "twitch_name": [TWITCH_CHANNEL_NAME],
        "progress": true
    },
    "1": {
        "discord_id": [USER_DISCORD_ID],
        "discord_name": [USER_DISCORD_NAME],
        "twitch_id": [TWITCH_ID],
        "twitch_name": [TWITCH_CHANNEL_NAME],
        "progress": true
    }
    "2": {
        "twitch_id": [TWITCH_ID],
        "twitch_name": [TWITCH_CHANNEL_NAME],
        "notif_line": [AN_PERSONNALIZED_TEXT]
    }
}
```

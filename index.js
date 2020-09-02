const express = require('express');
const logger = require('morgan');
const consola = require('consola');
const lusca = require('lusca');
const helmet = require('helmet');
const compression = require('compression');

/**
 * Load environment variables from the .env file, where API keys and passwords are stored.
 */
require('dotenv').config();

/**
 * Created Express server.
 */
const app = express();

/**
 * Express configuration (compression, logging, body-parser,methodoverride)
 */
app.set('view engine', 'ejs');
app.set('host', process.env.IP || '127.0.0.1');
app.set('port', process.env.PORT || 8080);
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
lusca.referrerPolicy('same-origin');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('etag', false);
app.use(helmet());
app.use(compression());
app.disable('x-powered-by');

// const corsOptions = {
//   origin: [process.env.WEB_URI, process.env.API_URI]
// };

switch (process.env.NODE_ENV) {
  case 'production':
    app.use(logger('combined'));
    // app.use(cors(corsOptions));
    app.enable('trust proxy');
    app.set('trust proxy', 1);
    break;
  default:
    app.use(logger('dev'));
}

/**
 * Primary app routes.
 */

// client.post(
//   'account/update_profile',
//   {
//     name: '🔴Live | Nathan Henniges'
//   },
//   (error, response) => {}
// );

/**
 * Handle 404 errors
 */
app.use((req, res, next) => {
  res.status(404);

  if (req.path === '/api' || RegExp('/api/.*').test(req.path)) {
    return res
      .status(404)
      .json({ error: 'Whoops, this resource or route could not be found' });
  }
  res.type('txt').send('Not found');
});

app.listen(app.get('port'), () => {
  // Log infomation after everything is started.
  consola.log('----------------------------------------');
  consola.info(`Environment: ${app.get('env')}`);
  consola.info(`App URL: http://localhost:${app.get('port')}`);
  consola.log('----------------------------------------');
});

const discord = require('./discord/index');

discord.login(process.env.DISCORD_TOKEN);

function changeDiscordPresence(presence, type, url) {
  try {
    discord.user.setActivity(presence, {
      type,
      url,
    });
  } catch (e) {
    consola.error(new Error(e));
  }
}

// When connected to discord
discord.on('ready', async () => {
  consola.ready({
    badge: true,
    message: 'Discord Bot Connected',
  });
  // Init discord presence
  changeDiscordPresence(process.env.DISCORD_BOT_STATUS, 'PLAYING', null);

  // Change it every 1 mins if its updated
  // setInterval(() => {
  // changeDiscordPresence('running demonwolfdev.com', 'PLAYING', null);
  // }, 1000 * 60);
  // changeDiscordPresence('MrDemonWolf: Coffee n Chill', 'STREAMING', 'https://www.twitch.tv/mrdemonwolf')
});

const twitchBot = require('./twitch/index');

// Connect Twitch Bot
try {
  twitchBot.connect();
  consola.ready({
    badge: true,
    message: 'Twitch Bot Connected',
  });
} catch (error) {
  consola.error(new Error(error));
}

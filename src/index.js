const Discord = require('discord.js');
const Twitter = require('twitter');
const express = require('express');
const logger = require('morgan');
const consola = require('consola');
const bodyParser = require('body-parser');
const lusca = require('lusca');
const helmet = require('helmet');

/**
 * Load environment variables from the .env file, where API keys and passwords are stored.
 */
require('dotenv').config();

// Create Twitter Client
const twitter = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// Discord Client
const discord = new Discord.Client();

/**
 * Created Express server.
 */
const app = express();

/**
 * Setup host and port.
 */
app.set('host', process.env.IP || '127.0.0.1');
app.set('port', process.env.PORT || 8080);

/**
 * Express configuration (compression, logging, body-parser,methodoverride)
 */
app.set('view engine', 'ejs');
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.disable('x-powered-by');

switch (process.env.NODE_ENV) {
  case 'production ':
    app.use(logger('combined'));
    app.enable('trust proxy');

    app.set('trust proxy', 1);
    break;
  case 'test':
    break;
  default:
    app.use(logger('dev'));
}

/**
 * Helmet - security for HTTP headers
 * Learn more at https://helmetjs.github.io/
 */
app.use(helmet());

/**
 * Load middlewares
 */

/**
 * Load vaildation middleware
 */

/**
 * Primary app controllers.
 */
const indexController = require('./controllers/index');

app.get('/', indexController.getIndex);

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

// Discord clietn
discord.on('ready', async () => {
  consola.ready({ badge: true, message: `Discord Bot Connected` });
  // Gives a invite link for the bot
  try {
    const link = await discord.generateInvite(['ADMINISTRATOR']);
    consola.info(
      `[ Discord] Please use the following link to invite the discord bot to your server ${link}`
    );

    discord.user.setActivity(process.env.DISCORD_BOT_STATUS, {
      type: 'PLAYING'
    });
  } catch (e) {
    consola.error(new Error(e));
  }
});

discord.login(process.env.DICORD_TOKEN);

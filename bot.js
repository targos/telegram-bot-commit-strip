'use strict';

const fs = require('fs');
const path = require('path');

require('dotenv').config();
const Telegram = require('telegraf/telegram');
const parser = require('fast-xml-parser');
const got = require('got');

const telegram = new Telegram(process.env.BOT_TOKEN);
const chatId = process.env.CHAT_ID;
const stripUrlFeed = 'https://www.commitstrip.com/en/feed/';
const lastPath = path.join(__dirname, 'last.txt');

async function run() {
  console.error(new Date().toISOString());
  console.error('checking for new commit strip');
  let last = false;
  try {
    last = fs.readFileSync(lastPath, 'utf8');
  } catch {}
  const xml = await got(stripUrlFeed);
  const parsed = parser.parse(xml.body);
  const {
    rss: {
      channel: { item }
    }
  } = parsed;
  const mostRecentStrip = item[0];
  const stripId = mostRecentStrip.guid;
  if (last === stripId) {
    console.error('already sent most recent strip');
    return;
  }
  const html = mostRecentStrip['content:encoded'];
  const match = /src="([^"]+)"/.exec(html);
  if (!match) {
    console.error('no match found:');
    console.error(mostRecentStrip.title);
    console.error(mostRecentStrip.pubDate);
    console.error(mostRecentStrip['content:encoded']);
    return;
  }

  console.error('sending image for strip ' + stripId);

  const imgUrl = match[1];
  await telegram.sendPhoto(chatId, imgUrl, { caption: mostRecentStrip.title });
  fs.writeFileSync(lastPath, stripId);
}

run().catch((e) => {
  console.error('fatal error');
  console.error(e.stack);
  process.exitCode = 1;
});

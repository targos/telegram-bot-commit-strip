# telegram-bot-commit-strip

Telegram bot that posts new CommitStrip strips on a selected channel.

## Setup

- Add your bot to the group.
- Get the chat_id:
  - Send a message with `/my_id @MyBot`.
  - Go to `https://api.telegram.org/bot{BOT_TOKEN}/getUpdates`.
  - Look for `chat.id` in the JSON.
- Copy `.env.example` to `.env` and put the bot's token and the chat id inside.
- Run `npm install`.

## Run

There is only one script to run: `node bot.js`.

The script will get the latest strip and if it's not the same as the last run,
it will send that strip and its title to the chat group. In case a message was
already sent with that strip, the script stops and no message will be sent.

To remember what the last strip was, it's GUID is stored locally in a file
named `last.txt`.

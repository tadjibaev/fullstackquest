const parser = require('./questionsParser');

const TelegramBot = require('node-telegram-bot-api');

const token = '832332477:AAEuAJ3vOe2hS3RLkp1HdjtLQy1z4zBxTec';

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];
  bot.sendMessage(chatId, resp);
});


function getData(questionId,onlyNext=false){
  var keyboard = {
    "inline_keyboard": [
        onlyNext ? [    
          {"text": "Next", "callback_data": "next"}
        ]:[
            {"text": "Show answer", "callback_data": JSON.stringify({questionId:questionId})},
            {"text": "Next", "callback_data": "next"}
        ]
    ]
  };
  var data = {
    "parse_mode":"Markdown",
    "reply_markup": JSON.stringify(keyboard)
  };
  return data;
}

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  var random = Math.floor(Math.random() * parser.questions.length); 
  
  bot.sendMessage(chatId, parser.questions[random].question,getData(random));
});
bot.on('callback_query', function onCallbackQuery(callbackQuery) {
  var dataValue = callbackQuery.data;
  const chatId = callbackQuery.message.chat.id;

  if(dataValue == "next") {
    var random = Math.floor(Math.random() * parser.questions.length); 
    bot.sendMessage(chatId, parser.questions[random].question,getData(random));
  } else {
    var dataObject = JSON.parse(dataValue);
    bot.sendMessage(chatId, parser.questions[dataObject.questionId].answer,getData(dataObject.questionId,true));
  }
});
bot.on("polling_error", (err) => console.log(err));

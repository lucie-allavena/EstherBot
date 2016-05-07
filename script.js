'use strict';

const Script = require('smooch-bot').Script;

module.exports = new Script({
    processing: {
        prompt: (bot) => bot.say('Hhhmmm...'),
        receive: () => 'processing'
    },

    start: {
        receive: (bot) => {
            return bot.say('*Un petit robot étrange... comme un assemblage de morceaux de codes éparses... un post-it sur le front "Parlez bot"')
                .then(() => 'askName');
        }
    },

    askName: {
        prompt: (bot) => bot.say('Quel est ton nom ?'),
        receive: (bot, message) => {
            const name = message.text;
            return bot.setProp('name', name)
                .then(() => bot.say(`Très bien, je vais t\'appeler ${name} dans ce cas... C\'est un joli nom, enfin, j\imagine^^'`))
                .then(() => 'finish');
        }
    },

    finish: {
        receive: (bot, message) => {
            return bot.getProp('name')
                .then((name) => bot.say(`Oh, je suis désolé ${name}, je ne suis qu'un reflet, je n'ai pas souvenir d'avoir su répondre à ça... '))
                .then(() => 'finish');
        }
    }
});

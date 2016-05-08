'use strict';

const _ = require('lodash');
const Script = require('smooch-bot').Script;

const scriptRules = require('./script.json');

module.exports = new Script({
    processing: {
        //prompt: (bot) => bot.say('Hhhmm...'),
        receive: () => 'processing'
    },

    start: {
        receive: (bot) => {
            return bot.say('*Un robot inanimé, un post-it collé sur sa tête marqué "Parlez BOT"*')
                .then(() => 'askName');
        }
    },
    askName: {
          receive: (bot, message) => {
            let upperText = message.text.trim().toUpperCase();
            function updateSilent() {
                switch (upperText) {
                    case "BOT": 
                        return bot.say('*Ses yeux s\'ouvrent, rond et perplexe* \n Je suis le bot personnel de Maxime, et toi qui es-tu ?'),
           receive: (bot, message) => {
                const name = message.text;
                return bot.setProp('name', name)
                    .then(() => bot.say(`Great! I'll call you ${name}... C'est un joli prénom ! \n Enfin, c'est ce que les gens disent, je ne saurais juger...`))
                    .then(() => 'speak');
        }
    },
    speak: {
        receive: (bot, message) => {

            let upperText = message.text.trim().toUpperCase();

            function updateSilent() {
                switch (upperText) {
                    case "BOT": 
                    case "CONNECT ME":
                        return bot.setProp("silent", true);
                    case "DISCONNECT":
                        return bot.setProp("silent", false);
                    default:
                        return Promise.resolve();
                }
            }

            function getSilent() {
                return bot.getProp("silent");
            }

            function processMessage(isSilent) {
                if (isSilent) {
                    return Promise.resolve("speak");
                }

                if (!_.has(scriptRules, upperText)) {
                    return bot.say(`Je ne suis qu'un BOT, qu'un reflet... Je ne comprends pas tout, utilise des mots simples, ou les boutons proposés`).then(() => 'speak');
                }

                var response = scriptRules[upperText];
                var lines = response.split('\n');

                var p = Promise.resolve();
                _.each(lines, function(line) {
                    line = line.trim();
                    p = p.then(function() {
                        console.log(line);
                        return bot.say(line);
                    });
                })

                return p.then(() => 'speak');
            }

            return updateSilent()
                .then(getSilent)
                .then(processMessage);
        }
    }
});

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
            return bot.say(`Bonjour, je suis le bot personnel de Maxime, un jeune-diplômé en communication et innovation, il m'a chargé de discuter à sa place. \n ![maxime](https://raw.githubusercontent.com/MaximeNialiv/EstherBot/master/img/maxime.jpg)`)
                .then(() => 'askName');
        }
    },

    askName: {
        prompt: (bot) => bot.say(`Puis-je connaître ton nom avant de commencer ?`),
        receive: (bot, message) => {
            const name = message.text;
            return bot.setProp('name', name)
                .then(() => bot.say(` " ${name} "... C'est un joli nom ! \n Enfin, c'est ce que l'on m'a dit de dire. Je ne saurais juger^^'\n Je n'ai pas d'oreilles pour l'instant, du coup, il faut interagir avec les boutons. Si un bouton ne marche pas, il suffit d'écrire son intitulé pour l'actionner. \n Maxime m'a dit qu'il attendait une visite de la part de STORMZ %[STORMZ](postback:lol), vous venez pour cela ? \n Sinon on peut discuter de MAXIMEBOT %[MAXIMEBOT](postback:lol), les gens sont souvent intéressés par ma création. \n Ou alors on peut parler de MAXIME %[MAXIME](postback:lol), j'ai été créé pour lui trouver du boulot, mais vu qu'il en a trouvé un, je suis en train d'être reprogrammé... \n Du coup si tu veux savoir ce qu'il fait comme METIER %[METIER](postback:lol) et que veulent bien pouvoir dire GROWTH HACKING %[GROWTH HACKING](postback:lol) et UX DESIGN %[UX DESIGN](postback:lol), tu peux appuyer sur les boutons :) Je peux également te conter une histoire dont tu es le héros ou CYOP %[CYOP](postback:lol), pour Choose Your Ow Path ! Tu peux y aller, c'est plein de zombies et de chevaliers arthuriens :) ",
`))
                .then(() => 'speak');
        }
    },
    error: {
        prompt: (bot) => bot.say(` Désolé ${name}... Je ne suis qu\'un BOT, qu\'un reflet... Je ne comprends pas tout, utilise des mots simples, ou les boutons proposé`),
        receive: () => 'speak'
    },
    speak: {
        prompt: (bot) => bot.say(`Avant de commencer à discuter, je dois te prévenir, je comprends les mots-clés, mais les phrases m\'échappent... \n Mais ne t\'inquiètes pas ${name} , on va bien arriver à discuter :) `),
        receive: (bot, message) => {

            let upperText = message.text.trim().toUpperCase();

            function updateSilent() {
                switch (upperText) {
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
                    return bot.say(` Désolé ${name}... Je ne suis qu'un BOT, qu'un reflet... Je ne comprends pas tout, utilise des mots simples, ou les boutons proposés`).then(() => 'speak');
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
    /* shifumi: {
        receive: (bot, message) => {
            let upperText = message.text.trim().toUpperCase();
            function processMessage() {
                var computerChoice = Math.random();
                    if (computerChoice < 0.34) {computerChoice = "PAPIER";
                    } else if(computerChoice <= 0.67) {computerChoice = "CAILLOU";
                    } else {computerChoice = "CISEAUX";
                };
            }
            case "PAPIER ": 
                if (computerChoice === "CISEAUX"){
                    return bot.say (`scissors wins`); 
                }else{
                    return bot.say (`paper wins`);
                };
            case "CAILLOU": 
                if (computerChoice === "CISEAUX"){
                    return bot.say (`rocks wins`); 
                }else {
                    return bot.say (`paper wins`);
                };
            case "CISEAUX": 
                if (computerChoice === "PAPIER "){
                    return bot.say (`scissors wins`);
                }else{
                    return bot.say (`rocks wins`);
                    
                };
                }
            }
            
        }
    }, */
});

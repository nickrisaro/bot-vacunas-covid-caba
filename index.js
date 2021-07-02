const fs = require("fs");
const TelegramBot = require("node-telegram-bot-api");
const VerificadorDeInscripciones = require("./verificadorDeInscripciones");

const port = process.env.PORT || 3000;

const url = process.env.URL || "";
const token = process.env.TOKEN || "";

const options = {
  webHook: {
    port: port,
  },
};

const bot = new TelegramBot(token, options);

const suscriptores = require("./suscriptores.json");

bot.setWebHook(`${url}/bot${token}`);
bot.onText(/\/ping/, function (msg, match) {
  var fromId = msg.chat.id;
  var message = "Estoy vivo, bueno, no realmente\n";
  bot.sendMessage(fromId, message);
});

bot.onText(/\/suscribirse/, function (msg, match) {
  var fromId = msg.chat.id;
  console.log("Nuevo suscriptor");
  suscriptores.push(fromId);
  var message =
    "Listo, te suscribiste, te mando un mensaje cuando haya un cambio\n";
  bot.sendMessage(fromId, message);
  fs.writeFile(
    "./suscriptores.json",

    JSON.stringify(suscriptores),

    function (err) {
      if (err) {
        console.error("No pude guardar los suscriptores");
      }
    }
  );
});

let verificador = new VerificadorDeInscripciones((nuevasVacunaciones) => {
  console.log("El notificador recibio", nuevasVacunaciones);
  var message = "Hubo un cambio, ahora las vacunaciones habilitadas son:\n";
  nuevasVacunaciones.forEach((nuevaVacunacion) => {
    message += "* " + nuevaVacunacion + "\n";
  });
  suscriptores.forEach((suscriptor) => {
    bot.sendMessage(suscriptor, message);
  });
});

setInterval(function () {
  console.log(new Date());
  verificador.verSiHayNuevasInscripciones();
}, 10 * 1000);

const https = require("https");
const fs = require("fs");
const DomParser = require("dom-parser");

class VerificadorDeInscripciones {
  constructor(notificador) {
    this.vacunaciones = require("./vacunaciones.json");
    this.notificador = notificador;
    this.optionsHomeInscripcionesCaba = {
      hostname: "www.buenosaires.gob.ar",
      path: "/coronavirus/vacunacion-covid-19",
    };
    this.parser = new DomParser();
  }

  verSiHayNuevasInscripciones() {
    console.log("Buscando nuevas inscripciones");
    var self = this;

    var request = https.request(
      self.optionsHomeInscripcionesCaba,
      function (res) {
        var data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          console.log("Recibi la página, buscando inscripciones habilitadas");
          var dom = self.parser.parseFromString(data);
          var titulos = dom.getElementsByClassName("tituloSPh3");
          var nuevasVacunaciones = [];
          titulos.forEach((titulo) => {
            if (
              titulo.innerHTML != "Vacunación en datos" &&
              titulo.innerHTML !=
                "Vacunación coronavirus preguntas frecuentes " &&
              titulo.innerHTML != "Estudio de combinación de vacunas "
            ) {
              nuevasVacunaciones.push(titulo.innerHTML);
            }
          });

          var hayNuevasVacunaciones = !(
            self.vacunaciones.length === nuevasVacunaciones.length &&
            self.vacunaciones.every((v, i) => v === nuevasVacunaciones[i])
          );

          console.log(
            "Hay nuevas inscripciones habilitadas",
            hayNuevasVacunaciones
          );

          if (hayNuevasVacunaciones) {
            self.vacunaciones = nuevasVacunaciones;
            self.notificador(self.vacunaciones);
            fs.writeFile(
              "./vacunaciones.json",

              JSON.stringify(nuevasVacunaciones),

              function (err) {
                if (err) {
                  console.error("No pude guardar las nuevas inscripciones");
                }
              }
            );
          }
        });
      }
    );
    request.on("error", (e) => {
      console.error("Error accediendo a los datos: " + e.message);
    });
    request.end();
  }
}

module.exports = VerificadorDeInscripciones;

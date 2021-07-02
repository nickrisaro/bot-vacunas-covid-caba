# BOT Vacunas COVID CABA (No estoy para pensar nombres)

Pequeño comprobador de cambios en la página de vacunación contra la COVID de CABA. Me cansé de apretar F5 así que hice un bot que lo haga por mí.

## Prerequisitos

Necesitás:

- Una URL pública con https para que telegram te avise cuando alguien interactúa con tu BOT (ngrok es tu amigo si querés correr local).
- Un token de telegram (Se lo pedís a @Botfather)
- Node

## Ejecución

- Seteá una variable de ambiente con tu URL

`export URL=https://....`

- Seteá una variable de ambiente con tu token

`export TOKEN=15454878:AA...`

- Seteá una variable de ambiente con el puerto local que vas a usar

`export PORT=3000`

- Descargá las dependencias

`npm install`

- Ejecutá el bot

`npm start`

const { Client, GatewayIntentBits } = require('discord.js'); // Librería Discord.js
const axios = require('axios'); // Para enviar datos al webhook
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates, // Para detectar eventos de voz
  ],
});

const WEBHOOK_URL = process.env.WEBHOOK_URL;

// Evento que detecta cambios en los estados de voz
client.on('voiceStateUpdate', (oldState, newState) => {
  // Detecta cuando alguien se conecta a un canal de voz
  if (!oldState.channelId && newState.channelId) {
    const user = newState.member.user;
    const channel = newState.channel.name;

    console.log(`${user.username} se conectó al canal de voz ${channel}`);

    // Enviar datos al webhook de Make.com
    axios.post(WEBHOOK_URL, {
      username: user.username,
      userId: user.id,
      channel: channel,
      action: 'connected',
    })
    .then(() => console.log('Evento enviado al webhook de Make.com'))
    .catch(err => console.error('Error al enviar al webhook:', err));
  }
});

// Evento que avisa cuando el bot está listo
client.once('ready', () => {
  console.log(`Bot iniciado como ${client.user.tag}`);
});

// Iniciar sesión en Discord con el token del bot
client.login(process.env.DISCORD_TOKEN); // Reemplaza con tu token

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const dialogflow = require('dialogflow');

// Valida a variável de ambiente GOOGLE_CREDENTIALS
if (!process.env.GOOGLE_CREDENTIALS) {
  console.error('Erro: Variável de ambiente GOOGLE_CREDENTIALS não definida.');
  process.exit(1);
}

let credentials;
try {
  credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
} catch (error) {
  console.error('Erro ao parsear GOOGLE_CREDENTIALS:', error);
  process.exit(1);
}

// Configura o cliente do Dialogflow
const sessionClient = new dialogflow.SessionsClient({ credentials });
const projectId = credentials.project_id || 'furiachatbot'; // Fallback pro projectId
const sessionPath = sessionClient.sessionPath(projectId, 'unique-session-id');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Porta dinâmica pro Render
const PORT = process.env.PORT || 3000;

// Configura a pasta frontend como estática pra servir index.html, style.css, imagens, etc.
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Serve o index.html na rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Função pra simular updates de jogos (fictícios, pra dar vibe de live)
function sendGameUpdate() {
  const updates = [
    'Clutch do KSCERATO! 3k na bombsite B! 🔥',
    'Placar atual: FURIA 8 x 6 Inimigo. Tô sentindo o comeback! 🐆',
    'yuurih tá on fire! Headshot atrás de headshot! 💪',
    'molodoy com um no-scope insano! AWP na mão é perigo! 🏆',
    'YEKINDAR abrindo o jogo com 2k na entrada! Agressivo demais! 🔥',
    'Intervalo! FURIA 7 x 8 Inimigo. Bora virar isso, nação!'
  ];
  const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
  io.emit('gameUpdate', randomUpdate);
}

// Envia updates de jogo a cada 30 segundos
setInterval(sendGameUpdate, 30000);

// Função pra enviar mensagem pro Dialogflow e obter resposta
async function detectIntent(text) {
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: text,
        languageCode: 'pt-BR'
      }
    }
  };
  const responses = await sessionClient.detectIntent(request);
  return responses[0].queryResult.fulfillmentText;
}

io.on('connection', (socket) => {
  console.log('Fã conectado!');

  // Envia boas-vindas
  socket.emit('message', 'Bot da FURIA: Salve, mano! Bem-vindo ao chat da nação! 🐆 Digita aí e bora torcer!');

  socket.on('chatMessage', async (msg) => {
    // Envia a mensagem do fã pra todos
    io.emit('message', msg);

    // Extrai o texto após "Fã: "
    const userMessage = msg.replace(/^Fã: /, '');

    // Envia pro Dialogflow e obtém resposta
    try {
      const botResponse = await detectIntent(userMessage);
      if (botResponse) {
        io.emit('message', `Bot da FURIA: ${botResponse}`);
      }
    } catch (error) {
      console.error('Erro no Dialogflow:', error);
      io.emit('message', 'Bot da FURIA: Opa, deu um erro aqui. Tenta de novo, mano! 😅');
    }
  });

  socket.on('disconnect', () => {
    console.log('Fã desconectado.');
  });
});

server.listen(PORT, () => {
  console.log(`Chat da FURIA rodando na porta ${PORT}`);
});
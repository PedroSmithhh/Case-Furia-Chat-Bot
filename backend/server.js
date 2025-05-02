const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const dialogflow = require('dialogflow');

// Configura o cliente do Dialogflow com o arquivo de credenciais
const sessionClient = new dialogflow.SessionsClient({
    keyFilename: path.join(__dirname, 'furia-bot-credentials.json') // JSON do DialogFlow
  });
  const projectId = 'furiachatbot-458501'; // ID do projeto Google Cloud
  const sessionPath = sessionClient.sessionPath(projectId, 'unique-session-id');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Porta dinâmica pro Render
const PORT = process.env.PORT || 3000;

// Configura a pasta frontend como estática pra servir index.html, style.css, etc.
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Serve o index.html na rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
  res.sendFile(path.join(__dirname, '..', 'frontend', 'img', "logo_furia_sem_fundo.png"));
});

// Função pra simular updates de jogos (fictícios, pra dar vibe de live)
function sendGameUpdate() {
  const updates = [
    'Clutch do KSCERATO! 3k na bombsite B! 🔥',
    'Placar atual: FURIA 8 x 6 Inimigo. Tô sentindo o comeback! 🐆',
    'Yuurih tá on fire! Headshot atrás de headshot! 💪',
    'Intervalo! FURIA 7 x 8 Inimigo. Bora virar isso, nação!'
  ];
  const randomUpdate = updates[Math.floor(Math.random() * updates.length)]; // Escolhe um indice aleatório
  io.emit('gameUpdate', randomUpdate);
}

// Envia updates de jogo a cada 30 segundos (pra simular live)
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
    socket.emit('message', 'Salve, mano! Bem-vindo ao chat da nação! 🐆 Digita aí e bora torcer!');
  
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
        io.emit('message', 'Opa, deu um erro aqui. Tenta de novo, mano! 😅');
      }
    });
  
    socket.on('disconnect', () => {
      console.log('Fã desconectado.');
    });
  });
  
  server.listen(PORT, () => {
    console.log(`Chat da FURIA rodando na porta ${PORT}`);
  });

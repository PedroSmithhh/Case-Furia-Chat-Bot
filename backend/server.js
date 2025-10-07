const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
// Importa especificamente o SessionsClient do pacote do Dialogflow
const { SessionsClient } = require('@google-cloud/dialogflow');

// --- SEÇÃO DE AUTENTICAÇÃO REMOVIDA ---
// Não precisamos mais verificar e parsear 'process.env.GOOGLE_CREDENTIALS'.
// A biblioteca do Google fará a autenticação automaticamente.

// Configura o cliente do Dialogflow (sem passar credenciais no código)
// A biblioteca irá procurar a variável de ambiente GOOGLE_APPLICATION_CREDENTIALS sozinha.
const sessionClient = new SessionsClient();

// Define o ID do projeto explicitamente. É mais seguro e claro.
const projectId = 'furiachatbot-458501'; 
const sessionId = 'unique-session-id'; // Pode ser um ID único por usuário no futuro
const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

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
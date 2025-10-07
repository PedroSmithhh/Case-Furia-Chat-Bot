const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { SessionsClient } = require('@google-cloud/dialogflow');


// Função principal assíncrona para capturar erros de inicialização
async function startServer() {
  try {
    // ---- TODO O SEU CÓDIGO ANTIGO VAI AQUI DENTRO ----

    // Configura o cliente do Dialogflow
    console.log('Iniciando cliente do Dialogflow...');
    const sessionClient = new SessionsClient();
    console.log('Cliente do Dialogflow iniciado com sucesso.');

    const projectId = 'furiachatbot-458501';
    const sessionId = 'unique-session-id';
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

    const app = express();
    const server = http.createServer(app);
    const io = socketIo(server);

    const PORT = process.env.PORT || 3000;

    app.use(express.static(path.join(__dirname, '..', 'frontend')));

    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
    });

    function sendGameUpdate() {
        // ... (sua função sendGameUpdate sem alterações)
        const updates = [
            'Clutch do KSCERATO! 3k na bombsite B! 🔥',
            'Placar atual: FURIA 8 x 6 Inimigo. Tô sentindo o comeback! 🐆',
            'yuurih tá on fire! Headshot atrás de headshot! 💪'
        ];
        const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
        io.emit('gameUpdate', randomUpdate);
    }

    setInterval(sendGameUpdate, 30000);

    async function detectIntent(text) {
        // ... (sua função detectIntent sem alterações)
        const request = {
            session: sessionPath,
            queryInput: {
                text: { text, languageCode: 'pt-BR' }
            }
        };
        const responses = await sessionClient.detectIntent(request);
        return responses[0].queryResult.fulfillmentText;
    }

    io.on('connection', (socket) => {
        // ... (seu io.on('connection') sem alterações)
        console.log('Fã conectado!');
        socket.emit('message', 'Bot da FURIA: Salve, mano! Bem-vindo ao chat da nação! 🐆 Digita aí e bora torcer!');
        socket.on('chatMessage', async (msg) => {
            io.emit('message', msg);
            const userMessage = msg.replace(/^Fã: /, '');
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

    // ---- FIM DO CÓDIGO ANTIGO ----
  } catch (error) {
    // Se qualquer coisa der errado na inicialização, o erro será exibido aqui
    console.error('--- ERRO FATAL AO INICIAR O SERVIDOR ---');
    console.error(error);
    process.exit(1); // Encerra o processo com um código de erro
  }
}

// Inicia a aplicação
startServer();
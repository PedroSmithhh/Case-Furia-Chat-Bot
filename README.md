# Chat da FURIA

Um chatbot conversacional para os fãs da FURIA acompanharem o time de Counter-Strike (CS), com atualizações fictícias de partidas em tempo real e respostas interativas sobre os jogadores da line-up atual (KSCERATO, FalleN, yuurih, molodoy, YEKINDAR). Desenvolvido como case para o processo seletivo da FURIA, o projeto utiliza **Dialogflow** para processamento de linguagem natural (NLP), **Socket.IO** para chat em tempo real, e **Node.js/Express** para o backend. O design é inspirado nas cores da FURIA, com uma interface vibrante e uma imagem personalizada.

O chatbot está deployado no **Render** e acessível online, com uma seção lateral que simula updates de jogos a cada 30 segundos, criando a vibe de uma transmissão ao vivo. Este projeto foi construído para engajar a nação FURIA, oferecendo uma experiência imersiva e interativa.

## Funcionalidades
- **Chat em Tempo Real:** Integração com Socket.IO para mensagens instantâneas entre fãs, com suporte a múltiplos usuários.
- **Bot Conversacional:** Utiliza Dialogflow para responder perguntas sobre a FURIA e os jogadores (KSCERATO, FalleN, yuurih, molodoy, YEKINDAR) em português, com respostas personalizadas e na linguagem da torcida.
- **Updates Fictícios de Partidas:** Exibe atualizações simuladas de jogos na interface (ex.: "Clutch do KSCERATO! 3k na bombsite B! 🔥") a cada 30 segundos, refletindo a line-up atual.
- **Design Temático:** Interface com as cores da FURIA (preto e laranja) e o logo oficial no topo.
- **Deploy Online:** Hospedado no Render com suporte a WebSockets, acessível globalmente.

## Tecnologias Utilizadas
- **Backend:** Node.js, Express, Socket.IO
- **NLP:** Dialogflow (Google Cloud)
- **Frontend:** HTML, CSS, JavaScript
- **Deploy:** Render (plano gratuito)
- **Outros:** Git, GitHub

## Pré-requisitos
- **Node.js** (v16 ou superior): [https://nodejs.org/](https://nodejs.org/)
- **Conta no Dialogflow**: [https://dialogflow.cloud.google.com/](https://dialogflow.cloud.google.com/)
- **Conta no Render**: [https://render.com/](https://render.com/) (para deploy)

## Como Rodar Localmente
1. **Clone o repositório:**
   ```bash
   git clone https://github.com/SEU_USUARIO/furia-chat.git
   cd furia-chat
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```
3. **Rode o servidor:**
   ```bash
   npm start
   ```
4. **Acesse o chat:**
   - Abra `http://localhost:3000` no navegador.
   - Teste mensagens como:
     - `Fã: Quem é molodoy?`
     - `Fã: YEKINDAR é agressivo?`
     - `Fã: Quem é KSCERATO?`
     - `Fã: Próximo jogo?`
     - `Fã: Time de cs?`
   - Verifique os updates na seção lateral.

## Deploy
O chat está hospedado online e pode ser acessado em: https://case-furia-chat-bot.onrender.com

## Contribuição
Este projeto foi criado como case para a FURIA. Para contribuir:
1. Faça um fork do repositório.
2. Crie uma branch: `git checkout -b minha-feature`.
3. Commit suas mudanças: `git commit -m "Adiciona feature"`.
4. Push para a branch: `git push origin minha-feature`.
5. Abra um Pull Request.

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

let waitingPlayer = null;

const io = new Server(server, {
  cors: {
    origin: "*", // replace by your client's url
    methods: ["GET", "POST"]
  }
});

app.use(express.json()); // Ajoutez ceci pour que Express puisse analyser le JSON dans le corps des requêtes

app.post('/users/id-web-socket', (req, res) => {
  const userId = req.body.userId; // Remplacez ceci par la logique d'authentification pour obtenir l'ID de l'utilisateur
  const socketId = req.body.socketId;

  console.log(`Received socket ID ${socketId} for user ${userId}`);
  
  // Ici, vous pouvez stocker `userId` et `socketId` dans votre base de données

  res.send({ success: true }); // Renvoyer une réponse pour que le client sache que la requête a réussi
});


io.on('connection', (socket) => {
  console.log(`a user connected = ${socket.id}`);
  
  socket.on('storeClientInfo', function (data) {
    // Ici, vous pouvez stocker `data.userId` et `data.socketId` dans votre base de données
    console.log('Received ID:', data.socketId, 'for user:', data.userId);
  });

  // if (waitingPlayer) {
  //   // Il y a un joueur en attente, alors les mettre ensemble dans une salle
  //   const room = `room-${waitingPlayer.id}-${socket.id}`;
  //   socket.join(room);
  //   waitingPlayer.join(room);

  //   // Vous pouvez maintenant utiliser `io.to(room).emit()` pour envoyer des messages à ces deux joueurs

  //   console.log(`Users ${waitingPlayer.id} and ${socket.id} are paired together.`);
  //   waitingPlayer = null; // Réinitialisez le joueur en attente
  // } else {
  //   // Aucun joueur n'attend, alors mettez ce joueur en attente
  //   waitingPlayer = socket;
  // }

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });

});

const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

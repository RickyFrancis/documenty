const mongoose = require('mongoose');
const Document = require('./models/Document');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const express = require('express');

const cors = require('cors');
const documentRoutes = require('./routes/documentRoutes');
const userRoutes = require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware.js');

dotenv.config();

const app = express();
const server = http.createServer(app);

mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const io = socketio(server, {
  cors: {
    origin: 'http://localhost:5000',
    methods: ['GET', 'POST'],
  },
});

const defaultValue = '';

io.on('connection', (socket) => {
  socket.on('get-document', async (documentId, userId) => {
    const document = await findOrCreateDocument(documentId, userId);
    socket.join(documentId);
    socket.emit('load-document', document.data, document.name, document.owner);

    socket.on('send-changes', (delta) => {
      socket.broadcast.to(documentId).emit('receive-changes', delta);
    });

    socket.on('save-document', async (data) => {
      await Document.findByIdAndUpdate(documentId, { data });
    });
  });
});

async function findOrCreateDocument(id, userId) {
  if (id == null || userId == null) return;
  const document = await Document.findById(id);
  if (
    document &&
    (document.owner == userId || document.editors.includes(userId))
  ) {
    return document;
  } else if (document) {
    return false;
  } else {
    return await Document.create({
      _id: id,
      data: defaultValue,
      name: `Untitled-${id}`,
      owner: userId,
    });
  }
}

app.use(cors());
app.use(express.json());

app.use('/api/documents', documentRoutes);
app.use('/api/users', userRoutes);

// const __dirname = path.resolve();

process.env.NODE_ENV = 'production';

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

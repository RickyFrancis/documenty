const mongoose = require('mongoose');
const Document = require('./models/Document');
const dotenv = require('dotenv');
const express = require('express');
const app = express();
const cors = require('cors');
const documentRoutes = require('./routes/documentRoutes');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const io = require('socket.io')(3001, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const defaultValue = '';

io.on('connection', (socket) => {
  socket.on('get-document', async (documentId) => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit('load-document', document.data, document.name);

    socket.on('send-changes', (delta) => {
      socket.broadcast.to(documentId).emit('receive-changes', delta);
    });

    socket.on('send-changes-name', (name) => {
      socket.broadcast.to(documentId).emit('receive-name-changes', name);
    });

    socket.on('save-document', async (data, name) => {
      await Document.findByIdAndUpdate(documentId, { data, name });
    });
  });
});

async function findOrCreateDocument(id) {
  if (id == null) return;

  const document = await Document.findById(id);
  if (document) return document;
  return await Document.create({
    _id: id,
    data: defaultValue,
    name: `Untitled-${id}`,
  });
}

app.use(cors());
app.use(express.json());

app.use('/api/documents', documentRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

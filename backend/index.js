import express from 'express';
import { createServer } from 'http';
import { Connection } from './DB/db.js';
import route from './routes/route.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import initSocket from './socket.js';

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3001;

Connection();
app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', route);

initSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});

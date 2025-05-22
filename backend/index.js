import express from 'express';
import { Connection } from './DB/db.js';
import route from './routes/route.js';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3001;

Connection();
app.use(cors());
app.use(bodyParser.json({extended:true}));
app.use(bodyParser.urlencoded({extended:true}));

app.use('/api',route);

app.listen(PORT, ()=>{
    console.log(`Server is running on PORT: ${PORT}`);
    
})
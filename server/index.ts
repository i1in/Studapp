import 'dotenv/config';

import express from 'express';
import http from 'http';
import sequelize from './config/database.js';
import cors from 'cors';

import router from './routes/index.js'
import ErrorHandlingMiddleware from './middleware/ErrorHandlingMiddleware.js';
import { initSocket } from './socket/index.js';

import { fileURLToPath } from 'url';
import path from 'path';

import './models/associations.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 5001;

const app = express();

app.use(cors())
app.use(express.json())
app.use('/static', express.static(path.resolve(__dirname, 'static')));

app.use('/', router)
app.use(ErrorHandlingMiddleware)

const server = http.createServer(app);
initSocket(server);

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();

        server.listen(PORT, () => console.log(`Server is runnin on localhost:${PORT}`));
    } catch (e) {
        console.log(e)
    }
}

start()
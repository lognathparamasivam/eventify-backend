import express from 'express';
import bodyParser from 'body-parser';
import databaseConnect from './database/datasource';
import logger from './logger';
import properties from './properties';

const app = express();
const port = properties.port;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Welcome to Eventify');
});

databaseConnect();

app.listen(port, () => {
    logger.info(`Server Started in ${properties.env} mode on ${port}`);
    logger.info(`Log Level = ${properties.logLevel}`);
});

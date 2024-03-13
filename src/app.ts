import express from 'express';
import  { databaseConnect } from './database/datasource';
import logger from './logger';
import properties from './properties';
import passport from 'passport';
import { authenticateToken } from './middleware/authenticateToken';
import login from './routes/auth'
import session from 'express-session';
import { passportConfig } from './middleware/passportConfig';
import userRoute from './routes/users';
import eventRoute from './routes/events';
import invitationRoute from './routes/invitations';

const app = express();
const port = properties.port;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to Eventify');
});

app.use(session({
    secret: properties.secretKey, 
    resave: false,
    saveUninitialized: false,
  }));
  

app.use(passport.initialize());  
app.use(passport.session());
passportConfig(passport);

app.get("/health", (req, res) => {
  res.status(200).send({
    status: "UP",
  });
});
app.get("/error", (req, res) => {
  res.status(500).send({
    message: "Internal Server Error",
  });
});
  app.use('/auth', login);
  app.use("/api/v1/users", authenticateToken, userRoute);
  app.use("/api/v1/events", authenticateToken, eventRoute);
  app.use("/api/v1/invitations", authenticateToken, invitationRoute);

databaseConnect();

app.listen(port, () => {
    logger.info(`Server Started in ${properties.env} mode on ${port}`);
    logger.info(`Log Level = ${properties.logLevel}`);
});

export default app;
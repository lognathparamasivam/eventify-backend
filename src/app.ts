import express from 'express';
import session, { MemoryStore } from 'express-session';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';

import { databaseConnect } from './database/datasource';
import logger from './logger';
import properties from './properties';
import specs from '../swaggerConfig';
import { passportConfig } from './middleware/passportConfig';
import { authenticateToken } from './middleware/authenticateToken';
import login from './routes/auth';
import userRoute from './routes/users';
import eventRoute from './routes/events';
import invitationRoute from './routes/invitations';
import notificationRoute from './routes/notifications';
import feedbackRoute from './routes/feedbacks';

const app = express();
const port = properties.port;

// Middleware
app.use(express.json());
try {
    app.use(session({
        name: 'eventify-session',
        secret: properties.secretKey,
        resave: true,
        store: new MemoryStore(),
        saveUninitialized: true,
    }));


    app.use(passport.initialize());
    app.use(passport.session());
    passportConfig(passport);

    // Routes
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    app.get('/', (req, res) => {
        res.send('Welcome to Eventify');
    });

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

    // Authentication Routes
    app.use('/auth', login);

    // API Routes with Authentication Middleware
    app.use("/api/v1/users", authenticateToken, userRoute);
    app.use("/api/v1/events", authenticateToken, eventRoute);
    app.use("/api/v1/invitations", authenticateToken, invitationRoute);
    app.use("/api/v1/notifications", authenticateToken, notificationRoute);
    app.use("/api/v1/feedbacks", authenticateToken, feedbackRoute);

    // Database connection and server start
    databaseConnect().then(() => {
        logger.info(`Database Connection Establised !!!`);
        app.listen(port, () => {
            logger.info(`Server Started in ${properties.env} mode on ${port}`);
            logger.info(`Log Level = ${properties.logLevel}`);
        });
    }).catch((err) => {
        logger.error(`Error on Connecting Database ${err}`);

    });
}
catch (err) {
    // global fallback error handler
    logger.error(err);
    app.use((req, res) => {
        res.status(500).json({
            success: false,
            message: err,
        });
    });
}

export default app;

import express, { Request, Response, NextFunction } from 'express';

// import routes
import feedRouter from './Routes/feed';
import errorHandler from './Middlewares/error-handler';
import cookieParser from 'cookie-parser';

const app = express();

app.set('trust proxy', true);

app.use(cookieParser());

app.use(express.json());

// routes
app.use('/api/feed', feedRouter);

// middlewares
app.use(errorHandler);

export default app;
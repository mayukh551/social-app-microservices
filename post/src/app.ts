import express, { Request, Response, NextFunction } from 'express';

// import routes
import postRouter from './Routes/post';
import errorHandler from './Middlewares/error-handler';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cookieParser());

app.use(express.json());

// routes
app.use('/api/post', postRouter);

// middlewares
app.use(errorHandler)

export default app;
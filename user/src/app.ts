import express, { Request, Response, NextFunction } from 'express';

// import routes
import userRouter from './Routes/user';
import errorHandler from './Middlewares/error-handler';

const app = express();

app.set('trust proxy', true);

app.use(express.json());

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('User Server is Live');
})

// routes
app.use('/api/user', userRouter);

// middlewares
app.use(errorHandler);

export default app;
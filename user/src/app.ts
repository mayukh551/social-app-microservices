import express, { Request, Response, NextFunction } from 'express';

// import routes
import userRouter from './Routes/user';

const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('User Server is Live');
})

// routes
app.use('/api/user', userRouter);

// middlewares


export default app;
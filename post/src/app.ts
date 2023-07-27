import express, { Request, Response, NextFunction } from 'express';

// import routes
import postRouter from './Routes/post';

const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('Post Server is Live');
})

// routes
app.use('/api/post', postRouter);

// middlewares


export default app;
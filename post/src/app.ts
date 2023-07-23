import express, { Request, Response, NextFunction } from 'express';

// import routes


const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('Post Server is Live');
})

// routes


// middlewares


export default app;
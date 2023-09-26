import app from './app';

const PORT: number = 5003 || process.env.PORT;

app.listen(PORT, () => {
    console.log(`Feed Server live on ${PORT}`);
});
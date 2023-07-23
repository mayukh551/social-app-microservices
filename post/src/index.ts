import app from './app';

const PORT: number = 5002 || process.env.PORT;

app.listen(PORT, () => {
    console.log(`Post Server live on ${PORT}`);
});
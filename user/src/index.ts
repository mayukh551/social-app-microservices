import app from './app';

const PORT: number = 5001 || process.env.PORT;

app.listen(PORT, () => {
    console.log(`User Server live on ${PORT}`);
});
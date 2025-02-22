import express from 'express';

const app = express();
const PORT: Number = 3000;

app.listen(PORT, () => {
    console.log('The application is listening '
        + 'on port http://localhost:' + PORT);
})
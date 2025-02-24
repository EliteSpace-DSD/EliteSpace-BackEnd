import express from 'express';
import config from "./config/config";
import morgan from 'morgan'; // Http request logger, help debug



// Configuration
const app = express();
const HOST: string = config.HOST;
const PORT: number = config.PORT;

app.use(morgan("common"));

//Place holder
app.get('/', (req, res) => {
  res.send('Place holder for Elite Space App!')
})

// Listener
app.listen(PORT, HOST, () => {
    console.log(`Elite Space App is listening on port ${PORT} of ${HOST}!`);
})
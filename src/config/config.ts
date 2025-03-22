import 'dotenv/config'

export default {
  HOST: process.env.HOST || "localhost",
  PORT: Number(process.env.PORT) || 3000,
};
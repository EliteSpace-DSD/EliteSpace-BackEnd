import 'dotenv/config'

import express, {Request, Response} from 'express';
const router = express.Router();


//Example route
router.get('/', (req:Request, res:Response) => {
  res.send('Place holder for Elite Space App!')
})


export default router;
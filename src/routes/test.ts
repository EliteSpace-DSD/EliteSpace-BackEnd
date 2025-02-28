import express, {Request, Response} from 'express';
const router = express.Router();


// Temp test will delete in due time
// reference tenant id: tenantId: '8eb494f7-76d7-4f2c-a6ae-4410734894eb',
import { createComplaint } from '../db/models/complaint';
router.get('/complaints', async (req: Request, res:Response) => {
  const result = await createComplaint( {
    tenantId: '8eb494f7-76d7-4f2c-a6ae-4410734894eb',
    issueType: 'noise',
    description: 'Neighbor is unfit to be a shower singer',
    priority: 'high'
  })
  res.send(result);
})

export default router;
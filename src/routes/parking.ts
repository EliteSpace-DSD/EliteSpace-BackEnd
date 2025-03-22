import express, { Request, Response } from 'express';
const router = express.Router();
import { createParkingPermit, getAllParkingSpaces } from '../db/models/parkingPermit';
import { ParkingPermitInsertType } from '../db/schema';

router.get('/', async (req: Request, res: Response) => {
  try {
    const parkingSpaces = await getAllParkingSpaces();
    res.status(200).json(parkingSpaces);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
    return;
  }
});

router.post('/', async (req: Request, res: Response) => {
  const { guestName, licensePlate, parkingId } = req.body;
  if (!guestName || !licensePlate || !parkingId) {
    res.status(400).json({ error: 'Guest, license plate, and a parking selection are all required.' });
    return;
  }

  const parkingPermit: ParkingPermitInsertType = {
    tenantId: req.user.userId,
    guestName,
    licensePlate,
    parkingSpace: parkingId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
  };

  try {
    const result = await createParkingPermit(parkingPermit);
    if (!result) {
      res.status(400).json({ error: 'Failed to create a parking permit.' });
      return;
    }

    res.status(200).json({
      message: `Parking request for ${guestName} with license plate ${licensePlate} received.`,
    });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
    return;
  }
});

export default router;

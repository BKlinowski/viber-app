import express from 'express';

const router = express.Router();

import { getContacts, getMessages, getCalls } from '../controllers/main.js';

router.get('/messages', getMessages);

router.get('/calls', getCalls);

router.get('/contacts', getContacts);

export default router;

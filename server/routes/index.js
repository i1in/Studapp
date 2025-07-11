import { Router } from 'express';
import userRoute from './userRoute.js';
import postRoute from './postRoute.js';
import followRoute from './followRoute.js'
import feedRoute from './feedRoute.js'
import adminRoute from './adminRoute.js'

const router = new Router();

router.use('/', userRoute);
router.use('/', postRoute);
router.use('/', followRoute);
router.use('/', feedRoute);
router.use('/', adminRoute);

export default router;
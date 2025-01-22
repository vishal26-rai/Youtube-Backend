import {routes} from 'express';
import {getHealthCheck} from '../controllers/healthcheck.controller.js';

const router = Router();

router.route('/').get(getHealthCheck);

export default router;
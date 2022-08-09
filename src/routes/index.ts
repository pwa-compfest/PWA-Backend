import { Router } from 'express'
const router = Router();
import docs from './docs'
import user from './user'

router.use('/docs', docs);
router.use('/user', user);

export default router;
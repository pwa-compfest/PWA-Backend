import { Router } from 'express'
const router = Router();
import docs from './docs'
import user from './api/user'

router.use('/docs', docs);
router.use('/users', user);

export default router;
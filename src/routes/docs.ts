import { Router } from 'express'
import swaggerUI from 'swagger-ui-express'
import {swaggerDocument} from '../docs'
const router = Router();

router.use(
  '/',
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocument, {
    customCss:
      '.swagger-ui .topbar { display: none } #swagger-ui {max-width: 960px; margin: auto } .swagger-ui .info .base-url { margin-top: 8px; font-size: 24px } .live-responses-table { width: 100%; border-collapse: collapse; background: #e4ffbf; display: table-cell; padding: 10px!important; }',
    customSiteTitle: 'API',
  })
);

export default router;

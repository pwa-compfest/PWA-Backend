import { Router } from 'express'
import { Request, Response } from 'express'
import { downloadObject } from '@/utils'
const router = Router()

router.get('/:folder/:file', (req: Request, res: Response) => {
    const {folder,file}  = req.params
    const bucket = `${'perwibuan-mooc'+'/'+folder}`
    const readStream = downloadObject(file, bucket)
    readStream.on('error', (err) => {
        res.status(500).send(err.message)
    }).pipe(res)
})
export default router;
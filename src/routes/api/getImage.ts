import { Router } from 'express'
import { Request, Response } from 'express'
import {getSignedUrl } from '@/utils'
const router = Router()

router.get('/:folder/:file', (req: Request, res: Response) => {
    const {folder,file}  = req.params
    const bucket = `${'perwibuan-mooc'+'/'+folder}`
    const getUrl = getSignedUrl(file,bucket)
    if(getUrl){
        res.json({
            url: getUrl
        })
    }else{
        res.status(404).send('Not Found')
    }
    // const readStream = downloadObject(file, bucket)
    // readStream.on('error', (err) => {
    //     res.status(500).send(err.message)
    // }).pipe(res)
})
export default router;
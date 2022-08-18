import multer from 'multer'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/uploads');
    },
    filename: function (req, file, callback) {
        callback(null,Date.now() + '-' + file.originalname);
    },
});

const upload = multer({
    storage : storage,
    limits : {fileSize : 1024*1024}
})

export default upload
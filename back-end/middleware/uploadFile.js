import multer from 'multer'
import { RootDir } from '../helpers/rootDir.js'
import { v4 as uuidV4 } from 'uuid'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, RootDir(['public', req.uploadFilePath]))
  },
  filename: (req, file, cb) => {
    if (req.uploadFilePath === 'voices') return cb(null, `${uuidV4()}.wav`)
    
    const orgName = file.originalname

    const splitN = orgName.split(".")
    const format = splitN[splitN.length - 1]
    const joinN = splitN.filter(s => s !== format).join('.')
    const newN = `${joinN}&&${uuidV4()}.${format}`

    cb(null, newN)
  },
})

export const UploadFile = multer({
  storage,
  // fileFilter: (req, file, cb) => {
  //   const fileSize = parseInt(req.headers["content-length"])

  //   if (["image/jpeg", "image/png", "image/jpg"].includes(file.mimetype) && fileSize <= 2000000) {
  //     cb(null, true)
  //   } else {
  //     cb(null, false)
  //   }
  // }
})
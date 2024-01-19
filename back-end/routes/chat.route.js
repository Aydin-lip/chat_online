import { Router } from "express"
import { UploadFile } from '../middleware/uploadFile.js'

const ChatRouter = Router()

ChatRouter.post('/file', (req, res, next) => {
  req.uploadFilePath = 'uploads'
  next()
}, UploadFile.single('file'), (req, res, next) => {
  res.status(200).send({ name: req.file?.originalname, path: `http://192.168.10.19:8080/uploads/${req.file?.filename}` })
  next()
})

ChatRouter.post('/voice', (req, res, next) => {
  req.uploadFilePath = 'voices'
  next()
}, UploadFile.single('voice'), (req, res, next) => {
  res.status(200).send({ path: `http://192.168.10.19:8080/voices/${req.file?.filename}` })
  next()
})

export default ChatRouter
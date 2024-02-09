import { Router } from "express"
import { UploadFile } from '../middleware/uploadFile.js'
import { configDotenv } from "dotenv"
configDotenv()

const ChatRouter = Router()

const port = process.env.PORT || 8008
const host = process.env.HOST || 'localhost'

ChatRouter.post('/file', (req, res, next) => {
  req.uploadFilePath = 'uploads'
  next()
}, UploadFile.single('file'), (req, res, next) => {
  res.status(200).send({ name: req.file?.originalname, path: `http://${host}:${port}/uploads/${req.file?.filename}` })
  next()
})

ChatRouter.post('/voice', (req, res, next) => {
  req.uploadFilePath = 'voices'
  next()
}, UploadFile.single('voice'), (req, res, next) => {
  res.status(200).send({ path: `http://${host}:${port}/voices/${req.file?.filename}` })
  next()
})

export default ChatRouter
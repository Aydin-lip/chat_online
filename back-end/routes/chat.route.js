const { Router } = require("express")
const { uploadFile } = require('../middleware/uploadFile')

const ChatRouter = Router()

ChatRouter.post('/file', (req, res, next) => {
  req.uploadFilePath = 'uploads'
  next()
}, uploadFile.single('file'), (req, res, next) => {
  res.status(200).send({ name: req.file?.originalname, path: `http://localhost:8080/uploads/${req.file?.filename}` })
  next()
})

ChatRouter.post('/voice', (req, res, next) => {
  req.uploadFilePath = 'voices'
  next()
}, uploadFile.single('voice'), (req, res, next) => {
  res.status(200).send({ path: `http://localhost:8080/voices/${req.file?.filename}` })
  next()
})

module.exports = ChatRouter
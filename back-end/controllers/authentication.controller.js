import jwt from 'jsonwebtoken'
import dot from 'dotenv'
import UsersMD from "../models/users.model.js"
import { SignInValidation, SingUpValidation } from "../validations/users.validation.js"

dot.config()

const SignIn = (req, res) => {
  SignInValidation.validate(req.body, { abortEarly: false })
    .then(resV => {
      const User = new UsersMD(req.body)
      User.login((resU, err) => {
        if (!err) {
          const token = jwt.sign({ user_id: resU.id }, process.env.JWT_SECRET, { algorithm: process.env.JWT_ALGORITHM })
          res.status(200).send({ ...resU, token })
        } else {
          res.status(400).send({ message: 'Error database!', error: err.message })
        }
      })
    })
    .catch(err => {
      res.status(412).send({ message: 'Error message for validation', error: err.errors })
    })
}

const SignUp = (req, res) => {
  SingUpValidation.validate(req.body, { abortEarly: false })
    .then(resV => {
      const User = new UsersMD(req.body)
      User.register((resU, err) => {
        if (!err) {
          const token = jwt.sign({ user_id: resU.id }, process.env.JWT_SECRET, { algorithm: process.env.JWT_ALGORITHM })
          res.status(200).send({ ...resU, token })
        } else {
          res.status(400).send({ message: 'Error database!', error: err.message })
        }
      })
    })
    .catch(err => {
      res.status(412).send({ message: 'Error message for validation', error: err.errors })
    })
}

export {
  SignIn,
  SignUp
}
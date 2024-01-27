import dotenv from "dotenv"
import bcrypt from 'bcryptjs'
import { Op } from 'sequelize'

import { UsersDB } from "../db/models/index.js"

dotenv.config()

class UsersMD {
  constructor({ firstname, lastname, username, password, phone, bio, avatar, last_seen }) {
    const values = { firstname, lastname, username, password, phone, bio, avatar, last_seen }
    Object.entries(values).forEach(([k, v]) => {
      if (v && (v || v.length >= 0))
        this[k] = v
    })
  }

  async register(callback) {
    const passHash = await bcrypt.hash(this.password, process.env.SALT_BCRYPT)
    UsersDB.create({ ...this, password: passHash })
      .then(({ dataValues }) => callback(dataValues))
      .catch(err => callback(null, err))
  }

  async login(callback) {
    UsersDB.findOne({
      where: {
        [Op.or]: [
          { username: this.username },
          { phone: this.phone }
        ]
      }
    })
      .then(async ({ dataValues }) => {
        const matchPass = await bcrypt.compare(this.password, dataValues)
        if (matchPass) {
          callback(dataValues)
        } else {
          callback(null, new Error('Password is false!'))
        }
      })
      .catch(err => callback(null, err))
  }

  async editProfile(id, callback) {
    delete this.password
    UsersDB.update(this, { where: { id } })
      .then(res => callback(res))
      .catch(err => callback(null, err))
  }

  static async editPassword(id, oldPassword, newPassword, callback) {
    UsersDB.findOne({ where: { id } })
      .then(async ({ dataValues }) => {
        const matchPass = await bcrypt.compare(oldPassword, dataValues.password)
        if (matchPass) {
          const passHash = await bcrypt.compare(newPassword, process.env.SALT_BCRYPT)
          UsersDB.update({ password: passHash }, { where: { id } })
            .then(res => callback(res))
            .catch(err => callback(null, err))
        } else {
          callback(null, new Error('oldPassword is false!'))
        }
      })
      .catch(err => callback(null, err))
  }

  static lastSeen(id, callback) {
    const nowDate = new Date().toISOString()
    UsersDB.update({ last_seen: nowDate }, { where: { id } })
      .then(res => callback(res))
      .catch(err => callback(null, err))
  }

  static getUserInfo(id, callback) {
    UsersDB.findOne({ where: { id } })
      .then(({ dataValues }) => callback(dataValues))
      .catch(err => callback(null, err))
  }

  static getUserProfile(id, callback) {
    UsersDB.findOne({
      attributes: ['id', 'firstname', 'lastname', 'username', 'bio', 'avatar', 'last_seen'],
      where: { id }
    })
      .then(({ dataValues }) => callback(dataValues))
      .catch(err => callback(null, err))
  }
}

export default UsersMD
import dotenv from "dotenv"
import bcrypt from 'bcryptjs'
import { Op, literal } from 'sequelize'

import { UsersDB } from "../db/models/index.js"
import OnlineUsersMD from "./online_users.model.js"

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
    const passHash = await bcrypt.hash(this.password, +process.env.SALT_BCRYPT)
    UsersDB.create({ ...this, avatar: [], password: passHash })
      .then(({ dataValues }) => callback(dataValues))
      .catch(err => callback(null, err))
  }

  async login(callback) {
    UsersDB.findOne({
      where: {
        [Op.or]: [
          { username: this.username ?? '' },
          { phone: this.phone ?? '' }
        ]
      }
    })
      .then(async ({ dataValues }) => {
        const matchPass = await bcrypt.compare(this.password, dataValues.password)
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
          const passHash = await bcrypt.compare(newPassword, +process.env.SALT_BCRYPT)
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

  static async getUserProfileChat(id, callback) {
    return await Promise.all([
      UsersDB.findOne({
        where: { id },
        attributes: ['id', 'firstname', 'lastname', 'avatar', 'username']
      }),
      OnlineUsersMD.hasUser(id)
    ])
      .then(res => {
        const [{ dataValues: user }, online] = res
        if (online) {
          user.online = true
        } else {
          user.online = false
        }
        callback?.(user)
        return user
      })
      .catch(err => {
        callback?.(null, err)
        return (err)
      })
  }

  static async getUserCustomInfo(id, attributes = [], callback) {
    if (attributes?.find(item => !['firstname', 'lastname', 'phone', 'online', 'username', 'bio', 'avatar', 'last_seen']?.includes(item)))
      return callback?.(null, new Error("attributes is false"))

    return UsersDB.findOne({
      where: { id },
      attributes: ['id', ...attributes.filter(att => att !== 'online')],
    })
      .then(async ({ dataValues }) => {
        if (!attributes.includes('online')) {
          callback?.(dataValues)
          return dataValues
        }

        try {
          const hasUser = await OnlineUsersMD.hasUser(id)
          if (hasUser)
            dataValues.online = true
          else
            dataValues.online = false
          callback?.(dataValues)
          return dataValues
        } catch (error) {
          callback?.(null, error)
          return error
        }
      })
      .catch(err => {
        callback?.(null, err)
        return err
      })
  }

  static async getUsersCustomInfo(ids, attributes = [], option, callback) {
    const pageLimited = option ? {
      limit: page * pageSize,
      offset: (page - 1) * pageSize
    } : {}

    if (attributes?.find(item => !['firstname', 'lastname', 'phone', 'username', 'bio', 'avatar', 'last_seen']?.includes(item)))
      return callback?.(null, new Error("attributes is false"))

    return UsersDB.findAll({
      where: {
        id: {
          [Op.or]: ids.map(id => literal(`JSON_CONTAINS(id, ${id})`))
        }
      },
      attributes: ['id', ...attributes],
      ...pageLimited
    })
      .then(res => {
        callback?.(res?.map(r => r?.dataValues))
        return res?.map(r => r?.dataValues)
      })
      .catch(err => {
        callback?.(null, err)
        return err
      })
  }

}

export default UsersMD
import { OnlineUsersDB } from "../db/models/index.js"
import { Op } from 'sequelize'

class OnlineUsersMD {

  static async add(user_id, callback) {
    OnlineUsersDB.create({ user_id })
      .then(({ dataValues }) => callback(dataValues))
      .catch(err => callback(null, err))
  }

  static selectChat(user_id, chat_id, callback) {
    OnlineUsersDB.update({ chat_id }, { where: { user_id } })
      .then(res => callback?.(res))
      .catch(err => callback?.(null, err))
  }

  static delete(user_id, callback) {
    OnlineUsersDB.destroy({ where: { user_id } })
      .then(res => callback(res))
      .catch(err => callback(null, err))
  }

  static async hasUser(user_id, callback) {
    return await OnlineUsersDB.findOne({ where: { user_id } })
      .then((res) => {
        callback?.(res)
        return res
      })
      .catch(err => {
        callback?.(null, err)
        return err
      })
  }

  static async getAll(attributes = [], callback) {
    return await OnlineUsersDB.findAll(attributes.length > 0 && { attributes })
      .then(res => {
        callback?.(res.map(r => r?.dataValues))
        return res.map(r => r?.dataValues)
      })
      .catch(err => {
        callback?.(null, err)
        return err
      })
  }

  static async getAllByIds(ids, attributes = [], callback) {
    const att = attributes.length > 0 && { attributes }
    return await OnlineUsersDB.findAll({
      where: {
        user_id: {
          [Op.regexp]: JSON.stringify(ids)
        }
      },
      ...att
    })
      .then(res => {
        callback?.(res.map(r => r?.dataValues))
        return res.map(r => r?.dataValues)
      })
      .catch(err => {
        callback?.(null, err)
        return err
      })
  }

}

export default OnlineUsersMD
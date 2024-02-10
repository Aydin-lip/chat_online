import { OnlineUsersDB } from "../db/models/index.js"
import { Op, literal } from 'sequelize'

class OnlineUsersMD {

  static async add(id, user_id, callback) {
    OnlineUsersDB.create({ id, user_id })
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

  static async getAllByUsersId(users_id, attributes = [], callback) {
    const att = attributes.length > 0 && { attributes }
    return await OnlineUsersDB.findAll({
      where: {
        user_id: {
          [Op.or]: users_id.map(id => literal(`JSON_CONTAINS(user_id, ${id})`))
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

  static async getAllByIds(ids, attributes = [], callback) {
    const att = attributes.length > 0 && { attributes }
    return await OnlineUsersDB.findAll({
      where: {
        id: {
          [Op.or]: ids.map(id => literal(`JSON_CONTAINS(id, ${id})`))
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

  static async getAllByChatId(chat_id, attributes = [], callback) {
    const att = attributes.length > 0 && { attributes }
    return await OnlineUsersDB.findAll({
      where: {
        chat_id
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
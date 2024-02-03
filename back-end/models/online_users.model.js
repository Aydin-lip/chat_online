import { OnlineUsersDB } from "../db/models/index.js"

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

  static getAll(callback) {
    OnlineUsersDB.findAll()
      .then(({ dataValues }) => callback(dataValues))
      .catch(err => callback(null, err))
  }
}

export default OnlineUsersMD
import { Op } from 'sequelize'

import { ChatsDB, UsersDB } from "../db/models/index.js";


class ChatsMD {
  constructor({ user_1, user_2 }) {
    this.user_1 = user_1
    this.user_2 = user_2
  }

  create(callback) {
    ChatsDB.create(this)
      .then(res => callback(res))
      .catch(err => callback(null, err))
  }

  static delete(id, callback) {
    ChatsDB.destroy({ where: { id } })
      .then(res => callback(res))
      .catch(err => callback(null, err))
  }

  static get(user_id, callback) {
    ChatsDB.findAll({
      where: {
        [Op.or]: [
          { user_1: user_id },
          { user_2: user_id },
        ]
      }
    })
      .then(({ dataValues }) => callback(dataValues))
      .catch(err => callback(null, err))
  }

}

export default ChatsMD;
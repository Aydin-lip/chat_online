import { Op } from 'sequelize'
import { v4 as uuidV4 } from 'uuid'

import { ChatsDB } from "../db/models/index.js";


class ChatsMD {
  constructor({ user_1, user_2 }) {
    this.user_1 = user_1
    this.user_2 = user_2
  }

  create(callback) {
    ChatsDB.create({ id: uuidV4(), ...this })
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
      .then(res => callback(res?.map(r => r.dataValues)))
      .catch(err => callback(null, err))
  }

}

export default ChatsMD;
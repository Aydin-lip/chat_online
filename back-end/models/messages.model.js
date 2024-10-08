import { Op, literal } from 'sequelize'
import { MessagesDB, UsersDB } from "../db/models/index.js"
import UsersMD from './users.model.js'

// option: {
//   page,
//   pageSize,
// }

class MessagesMD {
  constructor({ ref_id, user_id, type, path, name, description, size, time, text }) {
    const values = { ref_id, user_id, type, path, name, description, size, time, text }
    Object.entries(values).forEach(([k, v]) => {
      if (v && (v || v.length >= 0))
        this[k] = v
    })
  }

  add(callback) {
    MessagesDB.create({ ...this, seen: [this.user_id], actions: [] })
      .then(({ dataValues }) => callback(dataValues))
      .catch(err => callback(null, err))
  }

  edit(id, callback) {
    let updateItems = {}
    const { path, name, description, size, time, text } = this
    Object.entries({ path, name, description, size, time, text }).forEach(([k, v]) => {
      if (v && (v || v.length >= 0))
        updateItems[k] = v
    })

    MessagesDB.update(updateItems, { where: { id } })
      .then(res => callback(res))
      .catch(err => callback(null, err))
  }

  static delete(id, callback) {
    MessagesDB.destroy({ where: { id } })
      .then(res => callback(res))
      .catch(err => callback(null, err))
  }

  static getById(id, option, callback) {
    const { page = 1, pageSize = 20 } = option

    MessagesDB.findOne({
      where: { id },
      order: [['id', 'DESC']],
      limit: page * pageSize,
      offset: (page - 1) * pageSize,
    })
      .then(({ dataValues }) => callback(dataValues))
      .catch(err => callback(null, err))
  }

  static getByUserId(user_id, option, callback) {
    const { page = 1, pageSize = 20 } = option

    MessagesDB.findAll({
      where: { user_id },
      limit: page * pageSize,
      offset: (page - 1) * pageSize
    })
      .then((res) => callback(res?.map(r => r?.dataValues)))
      .catch(err => callback(null, err))
  }

  static getByRefId(ref_id, option, callback) {
    const pageLimited = option ? {
      limit: page * pageSize,
      offset: (page - 1) * pageSize
    } : {}

    console.log(pageLimited, option)

    MessagesDB.findAll({
      where: { ref_id },
      // order: [['id', 'DESC']],
      ...pageLimited
    })
      .then(async res => {
        const data = res.map(r => r?.dataValues)
        const ids = data.map(r => r.user_id)
        try {
          const resultUP = await UsersMD.getUsersCustomInfo(ids, ['firstname', 'lastname', 'username', 'avatar'], option)
          const newData = data.map((r, idx) => ({ ...r, user: resultUP[idx] }))
          callback(newData)
        } catch (error) {
          callback(null, error)
        }
      })
      .catch(err => callback(null, err))
  }

  static async getByRefIdLast(ref_id, callback) {
    return await MessagesDB.findAll({
      where: { ref_id },
      order: [['id', 'DESC']],
      limit: 1
    })
      .then(res => {
        callback?.(res?.map(r => r.dataValues)[0])
        return res?.map(r => r.dataValues)?.[0]
      })
      .catch(err => {
        callback?.(null, err)
        return err
      })
  }

  static getByType(type, option, callback) {
    const { page = 1, pageSize = 20 } = option

    MessagesDB.findAll({
      where: { type },
      // order: [['id', 'DESC']],
      limit: page * pageSize,
      offset: (page - 1) * pageSize
    })
      .then(({ dataValues }) => callback(dataValues))
      .catch(err => callback(null, err))
  }

  static async countByRefIdNotSeen(ref_id, user_id, callback) {
    return await MessagesDB.findAndCountAll({
      where: {
        [Op.and]: [
          { ref_id }, {
            seen: {
              [Op.notRegexp]: user_id
            }
          }, {
            user_id: {
              [Op.ne]: user_id
            }
          }
        ]
      }
    })
      .then(res => {
        callback?.(res)
        return res
      })
      .catch(err => {
        callback?.(null, err)
        return err
      })
  }

  static addSeen(ids, user_id, callback) {
    MessagesDB.findAll({
      where: {
        [Op.and]: [
          {
            id: {
              [Op.or]: ids.map(id => literal(`JSON_CONTAINS(id, ${id})`))
            }
          }, {
            seen: {
              [Op.notRegexp]: literal(`JSON_CONTAINS(seen, ${user_id})`)
            }
          }
        ]
      }
    })
      .then(res => {
        const messages = res?.map(r => r?.dataValues)
        Promise.all(messages.map(message =>
          MessagesDB.update({ seen: [...JSON.parse(message.seen), user_id] }, { where: { id: message.id } })
        ))
          .then(resP => callback({ response: resP, seen: messages.map(msg => msg.id) }))
          .catch(errP => callback(null, errP))
      })
      .catch(err => callback(null, err))


    // MessagesDB.findOne({ where: { id } })
    //   .then(({ dataValues }) => {
    //     const allSeen = dataValues.seen
    //     if (allSeen.includes(user_id))
    //       return callback(new Error('This user id already visited message!'))

    //     allSeen.push(user_id)
    //     MessagesDB.update({ seen: allSeen }, { where: { id } })
    //       .then(res => callback(res))
    //       .catch(err => callback(null, err))
    //   })
    //   .catch(err => callback(null, err))
  }

  static addAction(id, user_id, action, callback) {
    MessagesDB.findOne({ where: { id } })
      .then(({ dataValues }) => {
        const allAction = JSON.stringify(dataValues.actions)
        console.log(allAction)
        allAction[user_id] = action
        MessagesDB.update({ actions: allAction }, { where: { id } })
          .then(res => callback(res))
          .catch(err => callback(null, err))
      })
      .catch(err => callback(null, err))
  }

  static removeAction(id, user_id, callback) {
    MessagesDB.findOne({ where: { id } })
      .then(({ dataValues }) => {
        const allAction = JSON.stringify(dataValues.actions)
        delete allAction[user_id]
        MessagesDB.update({ actions: allAction }, { where: { id } })
          .then(res => callback(res))
          .catch(err => callback(null, err))
      })
      .catch(err => callback(null, err))
  }

}

export default MessagesMD
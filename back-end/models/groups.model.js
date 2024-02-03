import { Op } from 'sequelize'
import { GroupsDB } from "../db/models/index.js"

class GroupsMD {
  constructor({ owner, name, profile, description, members }) {
    const values = { owner, name, profile, description, members }
    Object.entries(values).forEach(([k, v]) => {
      if (v && (v || v.length >= 0))
        this[k] = v
    })
  }

  create(callback) {
    GroupsDB.create({ ...this, admins: [], members: [...this?.members, owner] })
      .then(res => callback(res))
      .catch(err => callback(null, err))
  }

  edit(id, callback) {
    let updateItems = {}
    const { name, description } = this
    Object.entries({ name, description }).forEach(([k, v]) => {
      if (v && (v || v.length >= 0))
        updateItems[k] = v
    })

    GroupsDB.update(updateItems, { where: { id } })
      .then(res => callback(res))
      .catch(err => callback(null, err))
  }

  static delete(id, callback) {
    GroupsDB.destroy({ where: { id } })
      .then(res => callback(res))
      .catch(err => callback(null, err))
  }

  static getGroupById(id, callback) {
    GroupsDB.findOne({
      where: { id }
    })
      .then(dataValues => callback?.(dataValues))
      .catch(err => callback(null, err))
  }

  static getGroupsById(user_id, callback) {
    GroupsDB.findAll({
      where: {
        members: {
          [Op.regexp]: user_id
        }
      },
      attributes: ['id', 'name', 'profile']
    })
      .then(res => callback(res?.map(r => r.dataValues)))
      .catch(err => callback(null, err))
  }

  static editProfile(id, profile, callback) {
    GroupsDB.update(profile, { where: { id } })
      .then(res => callback(res))
      .catch(err => callback(null, err))
  }

  static addMember(id, user_id, callback) {
    GroupsDB.findOne({ where: { id } })
      .then(({ dataValues }) => {
        const allMembers = dataValues.members
        if (allMembers.includes(user_id)) return callback(null, new Error('This user already has in group!'))

        allMembers.push(user_id)
        GroupsDB.update({ members: allMembers }, { where: { id } })
          .then(res => callback(res))
          .catch(err => callback(null, err))
      })
      .catch(err => callback(null, err))
  }

  static removeMember(id, user_id, callback) {
    GroupsDB.findOne({ where: { id } })
      .then(({ dataValues }) => {
        let allMembers = dataValues.members
        if (!allMembers.includes(user_id)) return callback(null, new Error('This user not join in group!'))

        allMembers = allMembers.filter(id => id !== user_id)
        GroupsDB.update({ members: allMembers }, { where: { id } })
          .then(res => callback(res))
          .catch(err => callback(null, err))
      })
      .catch(err => callback(null, err))
  }

  static addAdmin(id, user_id, callback) {
    GroupsDB.findOne({
      where: {
        [Op.and]: [
          { id }, {
            members: {
              [Op.regexp]: user_id
            }
          }
        ]
      },
    })
      .then(({ dataValues }) => {
        const allAdmins = dataValues.admins
        if (allAdmins.includes(user_id)) return callback(null, new Error('This user already has admin in group!'))

        allAdmins.push(user_id)
        GroupsDB.update({ admins: allAdmins }, { where: { id } })
          .then(res => callback(res))
          .catch(err => callback(null, err))
      })
      .catch(err => callback(null, err))
  }

  static removeAdmin(id, user_id, callback) {
    GroupsDB.findOne({
      where: {
        [Op.and]: [
          { id }, {
            members: {
              [Op.regexp]: user_id
            }
          }
        ]
      },
    })
      .then(({ dataValues }) => {
        let allAdmins = dataValues.admins
        if (!allAdmins.includes(user_id)) return callback(null, new Error('This user not admin in group!'))

        allAdmins = allAdmins.filter(id => id !== user_id)
        GroupsDB.update({ admins: allAdmins }, { where: { id } })
          .then(res => callback(res))
          .catch(err => callback(null, err))
      })
      .catch(err => callback(null, err))
  }

}

export default GroupsMD
import { Op, literal } from 'sequelize'
import { GroupsDB } from "../db/models/index.js"
import { v4 as uuidV4 } from 'uuid'
import OnlineUsersMD from './online_users.model.js'

class GroupsMD {
  constructor({ owner, name, profile, description, members }) {
    const values = { owner, name, profile, description, members }
    Object.entries(values).forEach(([k, v]) => {
      if (v && (v || v.length >= 0))
        this[k] = v
    })
  }

  create(callback) {
    GroupsDB.create({ id: uuidV4(), ...this, admins: [], members: [...this?.members, owner] })
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

  static getGroupsByUserId(user_id, callback) {
    GroupsDB.findAll({
      where: {
        members: literal(`JSON_CONTAINS(members, ${user_id})`)
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
            members: literal(`JSON_CONTAINS(members, ${user_id})`)
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
            members: literal(`JSON_CONTAINS(members, ${user_id})`)
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

  static getGroupCustomInfo(id, attributes = [], callback) {
    let members = attributes.includes('members')
    const onlineMembers = attributes.includes('online_members')
    if (onlineMembers) attributes = attributes.filter(item => item !== 'online_members')

    if (attributes?.find(item => !['owner', 'admins', 'name', 'profile', 'description', 'members', 'online_members']?.includes(item)))
      return callback?.(null, new Error("attributes is false"))

    if (onlineMembers && !members) {
      attributes.push('members')
      members = true
    }

    GroupsDB.findOne({
      where: { id },
      attributes: ['id', ...attributes]
    })
      .then(async ({ dataValues }) => {
        if (members) dataValues.members = JSON.parse(dataValues.members)

        if (!onlineMembers) return callback(dataValues)

        try {
          const result = await OnlineUsersMD.getAllByUsersId(dataValues.members, ['id', 'user_id'])
          const allOnlineUsersSocket_Id = result.map(r => r?.id)
          const allOnlineUsersUser_Id = result.map(r => r?.user_id)
          dataValues.online_members = allOnlineUsersUser_Id
          dataValues.online_members_socket = allOnlineUsersSocket_Id
          callback(dataValues)
        } catch (error) {
          callback(null, error)
        }
      })
      .catch(err => callback(null, err))
  }

}

export default GroupsMD
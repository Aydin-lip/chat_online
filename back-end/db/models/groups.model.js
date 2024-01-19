import { DataTypes } from 'sequelize'
import sequelize from "../mysql.js";

const GroupsDB = sequelize.define('group', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  owner: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  admins: {
    type: DataTypes.JSON,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  profile: {
    type: DataTypes.JSON
  },
  description: {
    type: DataTypes.TEXT
  },
  members: {
    type: DataTypes.JSON
  }
})

// User.hasMany(Message, { foreignKey: 'username', onDelete: 'CASCADE', onUpdate: 'CASCADE' })

export default GroupsDB
import { DataTypes } from 'sequelize'
import sequelize from "../mysql.js";

const MessagesDB = sequelize.define('message', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  ref_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  is_group: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  type: {
    type: DataTypes.ENUM,
    values: ['text', 'file', 'voice'],
    allowNull: false
  },
  path: {
    type: DataTypes.STRING
  },
  name: {
    type: DataTypes.STRING
  },  
  description: {
    type: DataTypes.TEXT
  },
  size: {
    type: DataTypes.INTEGER
  },
  text: {
    type: DataTypes.TEXT
  },
  seen: {
    type: DataTypes.JSON
  },
  actions: {
    type: DataTypes.JSON
  },
  // time: {
  //   type: DataTypes.DATE
  // },
})

// User.hasMany(Message, { foreignKey: 'username', onDelete: 'CASCADE', onUpdate: 'CASCADE' })

export default MessagesDB
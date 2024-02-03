import { DataTypes } from 'sequelize'
import sequelize from "../mysql.js";

const ChatsDB = sequelize.define('chat', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    // autoIncrement: true
  },
  user_1: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_2: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
})

// User.hasMany(Message, { foreignKey: 'username', onDelete: 'CASCADE', onUpdate: 'CASCADE' })

export default ChatsDB
import { DataTypes } from 'sequelize'
import sequelize from "../mysql.js";

const OnlineUsersDB = sequelize.define('online_user', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: {
      msg: 'An user with this id already exists!'
    },
  },
  chat_id: {
    type: DataTypes.INTEGER,
  }
})

// User.hasMany(Message, { foreignKey: 'username', onDelete: 'CASCADE', onUpdate: 'CASCADE' })

export default OnlineUsersDB
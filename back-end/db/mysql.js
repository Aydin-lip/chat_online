import dotenv from 'dotenv'
import { Sequelize } from "sequelize";
dotenv.config()

const [db, username, password, host] = [process.env.DB, process.env.USER_DB, process.env.PASSWORD_DB, process.env.HOST_DB]

const sequelize = new Sequelize(db, username, password, {
  host,
  dialect: 'mysql'
})

export default sequelize
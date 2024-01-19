import { DataTypes } from 'sequelize'
import sequelize from "../mysql.js";

const UsersDB = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  firstname: {
    type: DataTypes.STRING,
    validate: {
      len: {
        args: [0, 20],
        msg: 'The number of firstname character must be between 0 and 20 length. checked :)'
      }
    }
  },
  lastname: {
    type: DataTypes.STRING,
    validate: {
      len: {
        args: [0, 20],
        msg: 'The number of lastname character must be between 0 and 20 length. checked :)'
      }
    }
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    unique: {
      msg: 'An user with this username already exists!'
    },
    validate: {
      is: {
        args: /^[a-zA-Z][a-zA-Z0-9_.]{0,20}$/i,
        msg: 'Not invalid! ^[a-zA-Z][a-zA-Z0-9_.]{0, 20}$'
      },
      len: {
        args: [0, 20],
        msg: 'The number of username characters must be between 0 and 20 length. checked :)'
      },
      notNull: {
        msg: 'Username is required!'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Password is required!'
      }
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    unique: {
      msg: 'An user with this phone already exists!'
    },
    validate: {
      len: {
        args: [11, 15],
        msg: 'The number of phone characters must be between 11 and 15 length. checked :)'
      },
      isNumeric: {
        msg: 'Phone just accept number'
      },
      notNull: {
        msg: 'Phone is required!'
      },
    }
  },
  bio: {
    type: DataTypes.TEXT,
    validate: {
      len: {
        args: [0, 255],
        msg: 'The number of bio characters must be between 0 and 255 length. checked :)'
      }
    }
  },
  avatar: {
    type: DataTypes.JSON,
  },
  last_name: {
    type: DataTypes.DATE
  }
})

// UsersDB.hasMany(Message, { foreignKey: 'username', onDelete: 'CASCADE', onUpdate: 'CASCADE' })

export default UsersDB
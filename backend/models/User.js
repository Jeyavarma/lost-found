const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    shift: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rollNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
        hooks: {
      beforeValidate: (user) => {
        if (user.email) {
          user.email = user.email.toLowerCase();
        }
        if (user.rollNumber) {
          user.rollNumber = user.rollNumber.toUpperCase();
        }
        if (user.studentId) {
          user.studentId = user.studentId.toUpperCase();
        }
      },
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });

  // Method to compare passwords
  User.prototype.isValidPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  User.associate = (models) => {
    User.hasMany(models.Item, { foreignKey: 'userId', as: 'items' });
    User.hasMany(models.Notification, { foreignKey: 'userId', as: 'notifications' });
  };

  return User;
};

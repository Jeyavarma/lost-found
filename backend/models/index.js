const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  logging: false, // Disable logging for production
});

const db = {};

// Read all model files from the current directory
fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== 'index.js' && file.slice(-3) === '.js')
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Set up associations
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
    db[modelName].associate(db);
  }

});

// Associations are defined in individual model files and handled by the loop above.

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

'use strict'

module.exports = (sequelize, DataTypes) => {

  const Notes = sequelize.define('Notes', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  })

  Notes.sync({ force: false }).then(() => {})

  return Notes
}
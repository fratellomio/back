'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    static associate(models) {}
  }
  Book.init(
    {
      ISBN: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      title: { type: DataTypes.STRING, allowNull: false },
      author: { type: DataTypes.STRING, allowNull: false },
      publisher: { type: DataTypes.STRING, allowNull: false },
      category: { type: DataTypes.JSON, allowNull: true },
      description: { type: DataTypes.STRING, allowNull: true },
      language: { type: DataTypes.STRING, allowNull: true },
      cover: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize,
      modelName: 'Book',
    }
  );
  return Book;
};

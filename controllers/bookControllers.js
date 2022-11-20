const db = require('../models');
const book = db.Book;
const { Op } = require('sequelize');
const { sequelize } = require('../models');
module.exports = {
  test: async (req, res) => {
    res.status(200).send('test');
  },
  view: async (req, res) => {
    try {
      const books = await book.findAll();
      res.status(200).send(books);
    } catch (error) {
      res.status(400).send(error);
    }
  },
  addBook: async (req, res) => {
    try {
      const { ISBN, title, author, publisher, category, desc, cover } =
        req.body;
      const add = await book.create({
        ISBN,
        title,
        author,
        publisher,
        category,
        desc,
        cover,
      });
      res.status(200).send(add);
    } catch (error) {
      res.status(400).send(error);
    }
  },
  view2: async (req, res) => {
    try {
      const {
        category,
        language,
        page,
        limit,
        search_query,
        order,
        order_direction,
      } = req.query;
      const categories = category || '';
      const languages = language || '';
      const booklist_page = parseInt(page) || 0;
      const list_limit = parseInt(limit) || 10;
      const search = search_query || '';
      const offset = list_limit * booklist_page;
      const orderby = order || 'ISBN';
      const direction = order_direction || 'ASC';
      const categoriesNormalize = categories
        .split(',')
        .join("%' or category like '%");
      const totalRows = await book.count({
        where: {
          [Op.and]: [
            {
              language: {
                [Op.like]: '%' + languages + '%',
              },
              [Op.and]: [
                {
                  category: {
                    [Op.like]: sequelize.literal(`'%${categoriesNormalize}%'`),
                  },
                },
              ],
              [Op.or]: [
                {
                  title: {
                    [Op.like]: '%' + search + '%',
                  },
                },
                {
                  author: {
                    [Op.like]: '%' + search + '%',
                  },
                },
                {
                  publisher: {
                    [Op.like]: '%' + search + '%',
                  },
                },
              ],
            },
          ],
        },
      });
      const totalPage = Math.ceil(totalRows / limit);
      const result = await book.findAll({
        where: {
          [Op.and]: [
            {
              language: {
                [Op.like]: '%' + languages + '%',
              },
              [Op.and]: [
                {
                  category: {
                    [Op.like]: sequelize.literal(`'%${categoriesNormalize}%'`),
                  },
                },
              ],
              [Op.or]: [
                {
                  title: {
                    [Op.like]: '%' + search + '%',
                  },
                },
                {
                  author: {
                    [Op.like]: '%' + search + '%',
                  },
                },
                {
                  publisher: {
                    [Op.like]: '%' + search + '%',
                  },
                },
              ],
            },
          ],
        },
        offset: offset,
        limit: list_limit,
        order: [[orderby, direction]],
      });

      res.status(200).json({
        result: result,
        page: booklist_page,
        limit: list_limit,
        totalRows: totalRows,
        totalPage: totalPage,
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
};

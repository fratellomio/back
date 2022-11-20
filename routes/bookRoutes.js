const { bookControllers } = require('../controllers');
const router = require('express').Router();

router.get('/', bookControllers.test);
router.get('/books', bookControllers.view);
router.get('/books2', bookControllers.view2);
router.post('/addBook', bookControllers.addBook);
module.exports = router;

const router = require('express').Router();

const { authControllers } = require('../controllers');

router.post('/login', authControllers.login);
router.post('/logout', authControllers.logout);
router.post('/register', authControllers.register);
router.get('/keepLogin', authControllers.keepLogin);
router.get('/verification/:token', authControllers.verification);

module.exports = router;

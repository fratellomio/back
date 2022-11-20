const db = require('../models');
const user = db.User;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const transporter = require('../helpers/transporter');
const fs = require('fs');
const handlebars = require('handlebars');

module.exports = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      if (password.length < 8) throw 'password min 8 character';

      const salt = await bcrypt.genSalt(10);

      const hashPass = await bcrypt.hash(password, salt);

      await user.create({
        username,
        email,
        password: hashPass,
      });

      const token = jwt.sign({ email: email, username: username }, 'azmi', {
        expiresIn: '10m',
      });

      const tempEmail = fs.readFileSync(
        './template/verificationEmail.html',
        'utf-8'
      );
      const tempCompile = handlebars.compile(tempEmail);
      const tempResult = tempCompile({
        username,
        link: `http://localhost:8000/verification/${token}`,
      });

      await transporter.sendMail({
        from: 'Admin',
        to: email,
        subject: 'Verification User',
        html: tempResult,
      });

      res.status(200).send('Register Success');
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  },
  login: async (req, res) => {
    try {
      const { nim, password } = req.body;

      const nimExist = await user.findOne({
        where: {
          nim,
        },
        raw: true,
      });
      if (nimExist === null) throw 'user not found';

      const isValid = await bcrypt.compare(password, nimExist.password);

      if (!isValid) throw 'nim or password incorrect';

      if (nimExist.isVerified == false)
        throw 'user has not been verified yet. Please check your email';

      const token = jwt.sign(
        { username: nimExist.username, nim: nimExist.nim },
        'azmi'
      );

      res.status(200).send({
        user: {
          username: nimExist.username,
          nim: nimExist.nim,
        },
        token,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  },

  keepLogin: async (req, res) => {
    try {
      const verify = jwt.verify(req.token, 'azmi');
      const result = await user.findOne({
        where: {
          nim: verify.nim,
        },
      });

      res.status(200).send({
        nim: result[0].nim,
        username: result[0].username,
      });
    } catch (err) {
      res.status(400).send(err);
    }
  },

  verification: async (req, res) => {
    const { token } = req.params;

    try {
      const verify = jwt.verify(token, 'azmi');

      await user.update(
        {
          isVerified: true,
        },
        {
          where: {
            email: verify.email,
          },
        }
      );

      const u = await user.findOne({
        where: {
          email: verify.email,
        },
      });

      const { username, email, nim } = u.dataValues;

      const tempEmail = fs.readFileSync(
        './template/successVerificationEmail.html',
        'utf-8'
      );
      const tempCompile = handlebars.compile(tempEmail);
      const tempResult = tempCompile({
        username,
        email,
        nim,
      });

      await transporter.sendMail({
        from: 'Admin',
        to: email,
        subject: 'Verification Success',
        html: tempResult,
      });
      res.status(200).send('Verification Success');
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  },
};

const User = require('../models/User')
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('user', { user: 'Aryan' });
});

router.post('/register', async function (req, res, next) {
  try {
    let success = false;
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      res.status(400).json({ error: "fill all fields" })
    }
    else {
      const userExists = await User.findOne({ email })
      console.log(userExists, 'userExists');
      if (userExists) {
        res.status(400).json({ error: "user already exists" })
      }
      else {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const user = new User({
          name,
          email,
          password: hashPassword
        })
        await (await user.save())
        const data = {
          user: {
            id: user._id,
            name: user.name,
            email: user.email
          }
        }
        let authToken = jwt.sign(data, process.env.JWT_SECRET);
        console.log(authToken);
        success = true;
        res.json({ success, authToken });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "server error" })
  }
})

router.post('/login', async function (req, res, next) {
  try {
    let success = false;
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ error: "fill all fields" })
    }

    else {
      const userExists = await User.findOne({ email });
      if (userExists) {
        const isMatch = await bcrypt.compare(password, userExists.password);
        if (isMatch) {
          const data = {
            user: {
              id: userExists._id,
              name: userExists.name,
              email: userExists.email
            }
          }

          let authToken = jwt.sign(data, process.env.JWT_SECRET);

          success = true;
          res.json({ success, authToken });

        }
        else {
          res.status(400).json({ error: "invalid credentials" })
        }
      }
      else {
        res.status(400).json({ error: "invalid credentials" })
      }
    }



  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "server error" })
  }
})

module.exports = router;

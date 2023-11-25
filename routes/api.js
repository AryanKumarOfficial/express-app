const User = require('../models/User')
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Note = require('../models/Notes');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('user', { user: 'Aryan' });
});

// user api

router.post('/register', async function (req, res, next) {
  try {
    let success = false;
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      res.status(200).json({ error: "fill all fields" })
    }
    else {
      const userExists = await User.findOne({ email })
      console.log(userExists, 'userExists');
      if (userExists) {
        res.status(200).json({ error: "user already exists" })
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
      res.status(200).json({ success, error: "fill all fields" })
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
          res.status(401).json({ success, error: "invalid credentials" })
        }
      }
      else {
        res.status(401).json({ success, error: "invalid credentials" })
      }
    }



  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "server error" })
  }
})

router.post('/getuser', async function (req, res, next) {
  try {
    let success = false;
    const { authToken } = req.body
    if (!authToken) {
      res.status(200).json({ success, error: "no token" })
    }
    else {
      const user = jwt.verify(authToken, process.env.JWT_SECRET);
      if (user) {
        success = true;
        res.json({ success, user })
      }
      else {
        res.status(401).json({ success, error: "invalid token" })
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ response: "server error", error })
  }
})

router.post('/getuserbyid', async function (req, res, next) {
  try {
    let success = false;
    const { id } = req.body
    if (!id) {
      res.status(200).json({ success, error: "no id" })
    }
    else {
      const user = await User.findById(id);
      if (user) {
        success = true;
        res.json({ success, user })
      }
      else {
        res.status(401).json({ success, error: "invalid id" })
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ response: "server error", error })
  }
})

router.post('/updateuser', async function (req, res, next) {
  try {
    let success = false;
    const { _id, name, email } = req.body
    if (!id || !name || !email) {
      res.status(200).json({ success, error: "fill all fields" })
    }
    else {
      const user = await User.findById(_id);
      if (user) {
        const update = await User.findByIdAndUpdate(_id, {
          name,
          email
        })
        success = true;
        res.json({ success, user: update })

      }
      else {
        res.status(401).json({ success, error: "invalid id" })
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ response: "server error", error })
  }
})

router.post('/deleteuser', async function (req, res, next) {
  try {
    let success = false;
    const { id } = req.body
    if (!id) {
      res.status(200).json({ success, error: "no id" })
    }
    else {
      const user = await User.findById(id);
      if (user) {
        const del = await User.findByIdAndDelete(id);
        success = true;
        res.json({ success, user: del })

      }
      else {
        res.status(401).json({ success, error: "invalid id" })
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ response: "server error", error })
  }
})

router.get('/getallusers', async function (req, res, next) {
  try {
    let success = false;
    const users = await User.find();
    if (users) {
      success = true;
      res.json({ success, users })
    }
    else {
      res.status(401).json({ success, error: "invalid id" })
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ response: "server error", error })
  }
})

// notes api

router.post('/addnote', async function (req, res, next) {
  let success = false;
  try {

    const { category, title, content, authToken } = req.body;
    if (!category || !title || !content || !authToken) {
      res.status(200).json({ error: "fill all fields" })
    }
    else {
      const user = jwt.verify(authToken, process.env.JWT_SECRET);
      if (user) {
        const note = new Note({
          category: category === 'default' ? 'General' : category,
          title,
          desc: content,
          user: user.user.id
        })
        await (await note.save())
        success = true;
        res.json({ note, success })
      }
      else {
        res.status(401).json({ error: "invalid token", success })
      }
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ response: "server error", error, success })

  }
})

router.post('/getnotes', async function (req, res, next) {
  let success = false;
  try {
    const { authToken } = req.body;
    if (!authToken) {
      res.status(200).json({ error: "no token" })
    }
    else {
      const user = jwt.verify(authToken, process.env.JWT_SECRET);
      if (user) {
        const notes = await Note.find({ user: user.user.id }).sort({ date: -1 });
        success = true;
        res.json({ notes, success })
      }
      else {
        res.status(401).json({ error: "invalid token", success })
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ response: "server error", error, success })

  }
}
)

router.post('/getnotesbycategory', async function (req, res, next) {
  let success = false;
  try {
    const { authToken, category } = req.body;
    if (!authToken) {
      res.status(200).json({ error: "no token" })
    }
    else {
      const user = jwt.verify(authToken, process.env.JWT_SECRET);
      if (user) {
        const notes = await Note.find({ user: user.user.id, category }).sort({ date: -1 });
        success = true;
        res.json({ notes, success })
      }
      else {
        res.status(401).json({ error: "invalid token", success })
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ response: "server error", error, success })

  }
})

router.post('/getnotesbyid', async function (req, res, next) {
  let success = false;
  try {
    const { authToken, id } = req.body;
    if (!authToken) {
      res.status(200).json({ error: "no token" })
    }
    else {
      const user = jwt.verify(authToken, process.env.JWT_SECRET);
      if (user) {
        const note = await Note.findById(id);
        success = true;
        res.json({ note, success })
      }
      else {
        res.status(401).json({ error: "invalid token", success })
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ response: "server error", error, success })

  }
})

router.post('/updatenote', async function (req, res, next) {
  let success = false;
  try {
    const { authToken, id, category, title, content } = req.body;
    if (!authToken) {
      res.status(200).json({ error: "no token" })
    }
    else {
      const user = jwt.verify(authToken, process.env.JWT_SECRET);
      if (user) {
        const note = await Note.findById(id);
        if (note) {
          const update = await Note.findByIdAndUpdate(id, {
            category: category === 'default' ? 'General' : category,
            title,
            desc: content
          })
          success = true;
          res.json({ note: update, success })
        }
        else {
          res.status(401).json({ error: "invalid id", success })
        }
      }
      else {
        res.status(401).json({ error: "invalid token", success })
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ response: "server error", error, success })

  }
}

)

router.post('/deletenote', async function (req, res, next) {
  let success = false;
  try {
    const { authToken, id } = req.body;
    if (!authToken) {
      res.status(200).json({ error: "no token" })
    }
    else {
      const user = jwt.verify(authToken, process.env.JWT_SECRET);
      if (user) {
        const note = await Note.findById(id);
        if (note) {
          const del = await Note.findByIdAndDelete(id);
          success = true;
          res.json({ note: del, success })
        }
        else {
          res.status(401).json({ error: "invalid id", success })
        }
      }
      else {
        res.status(401).json({ error: "invalid token", success })
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ response: "server error", error, success })

  }
}

)

router.get('/getallnotes', async function (req, res, next) {
  let success = false;
  try {
    const notes = await Note.find();
    success = true;
    res.json({ notes, success })
  } catch (error) {
    console.log(error);
    res.status(500).json({ response: "server error", error, success })

  }
})

router.post('/getnotesbysearch', async function (req, res, next) {
  let success = false;
  try {
    const { authToken, search } = req.body;
    if (!authToken) {
      res.status(200).json({ error: "no token" })
    }
    else {
      const user = jwt.verify(authToken, process.env.JWT_SECRET);
      if (user) {
        const notes = await Note.find({ user: user.user.id, title: { $regex: search, $options: 'i' } }).sort({ date: -1 });
        success = true;
        res.json({ notes, success })
      }
      else {
        res.status(401).json({ error: "invalid token", success })
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ response: "server error", error, success })

  }
}
)

router.post('/getnotesbycategoryandsearch', async function (req, res, next) {
  let success = false;
  try {
    const { authToken, category, search } = req.body;
    if (!authToken) {
      res.status(200).json({ error: "no token" })
    }
    else {
      const user = jwt.verify(authToken, process.env.JWT_SECRET);
      if (user) {
        const notes = await Note.find({ user: user.user.id, category, title: { $regex: search, $options: 'i' } }).sort({ date: -1 });
        success = true;
        res.json({ notes, success })
      }
      else {
        res.status(401).json({ error: "invalid token", success })
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ response: "server error", error, success })

  }
})

router.post('/getfewnotes', async function (req, res, next) {
  let success = false;
  try {
    const { authToken, limit } = req.body;
    if (!authToken) {
      res.status(200).json({ error: "no token" })
    }
    else {
      const user = jwt.verify(authToken, process.env.JWT_SECRET);
      if (user) {

        const notes = await Note.find({ user: user.user.id }).sort({ date: -1 }).limit(limit);
        success = true;
        res.json({ notes, success })
      }
      else {
        res.status(401).json({ error: "invalid token", success })
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ response: "server error", error, success })

  }
})


module.exports = router;

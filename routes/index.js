var express = require('express');
const Note = require('../models/Notes');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'iNoteBook-Home' });
});

router.get('/about', function (req, res, next) {
  res.render('about', { title: 'iNoteBook-About' });
}
);

router.get('/contact', function (req, res, next) {
  res.render('contact', { title: 'iNoteBook-Contact' });
}
);


router.get('/login', function (req, res, next) {
  res.render('login', { title: 'iNoteBook-Login' });
}
);

router.get('/register', function (req, res, next) {
  res.render('register', { title: 'iNoteBook-Register' });
}
);

router.get('/forgot', function (req, res, next) {
  res.render('forgot', { title: 'iNoteBook-Forgot' });
}
);

router.get('/notes', async function (req, res, next) {
  const notes = await Note.find()
  res.render('notes', { title: 'iNoteBook-Notes', notes: notes || [] });
}
);





module.exports = router;

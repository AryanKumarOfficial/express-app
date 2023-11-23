var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'iNOteBook-Home' });
});

router.get('/about', function (req, res, next) {
  res.render('about', { title: 'iNOteBook-About' });
}
);

router.get('/contact', function (req, res, next) {
  res.render('contact', { title: 'iNOteBook-Contact' });
}
);


router.get('/login', function (req, res, next) {
  res.render('login', { title: 'iNOteBook-Login' });
}
);

router.get('/register', function (req, res, next) {
  res.render('register', { title: 'iNOteBook-Register' });
}
);

router.get('/forgot', function (req, res, next) {
  res.render('forgot', { title: 'iNOteBook-Forgot' });
}
);




module.exports = router;

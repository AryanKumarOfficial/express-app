'use strict';

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const apiRoutes = require('./routes/api');
const connectDB = require('./connectdb');
const cors = require('cors');
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const app = express();

// Establish database connection
connectDB();

// Start the server
gulp.task('start-server', () => {
  app.use(express.static(path.join(__dirname, 'public')));
  app.listen(3000, () => {
    console.log('Server started on port 3000');
  });
});

// Watch for changes in files
gulp.task('watch', () => {
  gulp.watch(['./public/**/*.html', './public/**/*.css', './public/**/*.js', './views/**/*.jade'], gulp.series(browserSync.reload));
});

// Start BrowserSync
gulp.task('browser-sync', gulp.series('start-server', () => {
  browserSync.init({
    proxy: 'http://localhost:3000',
    files: ['public/**/*.html', 'public/**/*.css', 'public/**/*.js', 'views/**/*.jade'],
    port: 7000
  });
}));

app.use(cors());

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Express middleware configuration
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route handlers
app.use('/', indexRouter);
app.use('/api', apiRoutes);

// Error handling
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  // Set locals, providing error in development mode only
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

gulp.task('default', gulp.parallel('browser-sync', 'watch'));

module.exports = app;

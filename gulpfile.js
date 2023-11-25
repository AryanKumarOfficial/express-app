const gulp = require('gulp');
const livereload = require('gulp-livereload');
const browser = require('browser-sync').create();
gulp.task('serve', function () {
    browser.init({
        server: './public', // Change this to your public directory
    });

    // Watch for changes in HTML, Pug, CSS, or JS files
    gulp.watch(['public/**/*.html', 'views/**/*.pug', 'public/**/*.css', 'public/**/*.js']).on('change', browser.reload);
});

gulp.task('default', gulp.series('serve'));

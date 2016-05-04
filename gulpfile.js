// include plug-ins
var gulp           = require('gulp');
var concat         = require('gulp-concat');
var uglify         = require('gulp-uglify');
var del            = require('del');
var path           = require('path');
var sourcemaps     = require('gulp-sourcemaps');
var watch          = require("gulp-watch");

//=============================================================================

var config = {
    js: {
        src: ['src/client/**/*.js', '!src/client/plugins/**/*.js', '!src/client/**/*.min.js', '!src/client/**/*.tests.js'],
        dest: "src/public/js"
    },

    jsplugins: {
        src: ['src/client/plugins/**/*.js', '!src/client/plugins/**/*.min.js', '!src/client/plugins/**/*.tests.js'],
        dest: "src/public/js"
    }
};

//=============================================================================

// Synchronously delete the output file(s)
gulp.task('clean', function () {
    del.sync([
        'src/public/js/client.js',
        'src/public/js/client.min.js',
        'src/public/js/plugins.js',
        'src/public/js/plugins.min.js'
    ]);
});

// Combine and minify all files from the app folder
gulp.task('scripts', ['clean'], function () {
    return gulp.src(config.js.src)
      .pipe(concat('client.js'))
      .pipe(gulp.dest(config.js.dest))
      .pipe(uglify())
      .pipe(concat('client.min.js'))
      .pipe(gulp.dest(config.js.dest));
});

// Combine and minify all files from the app folder
gulp.task('scripts-plugins', function () {
    return gulp.src(config.jsplugins.src)
      .pipe(concat('plugins.js'))
      .pipe(gulp.dest(config.jsplugins.dest))
      .pipe(uglify())
      .pipe(concat('plugins.min.js'))
      .pipe(gulp.dest(config.jsplugins.dest));
});

gulp.task("scripts-watch", function () {
    return gulp.watch(config.js.src, ["scripts-plugins","scripts"])
});

//=============================================================================

//Set a default task
gulp.task('default', ["scripts", "scripts-plugins"], function () {

});
// include plug-ins
var gulp           = require('gulp');
var concat         = require('gulp-concat');
var uglify         = require('gulp-uglify');
var del            = require('del');
var path           = require('path');
var sourcemaps     = require('gulp-sourcemaps');
var watch          = require("gulp-watch");

//=============================================================================

var clientModules = {
    "my-repos": {
        src: ["src/client/pages/my-repos/**/*.js", '!src/client/pages/my-repos/**/*.tests.js'],
        dest: "src/public/js/pages"
    },
    "repo-details": {
        src: ["src/client/pages/repo-details/**/*.js", '!src/client/pages/repo-details/**/*.tests.js'],
        dest: "src/public/js/pages"
    },
    "shared": {
        src: ['src/client/shared/**/*.js', '!src/client/shared/**/*.min.js', '!src/client/shared/**/*.tests.js'],
        dest: 'src/public/js'
    },
    "open-lib": {
        src: ['src/client/open-lib/**/*.js', '!src/client/open-lib/**/*.min.js', '!src/client/open-lib/**/*.tests.js'],
        dest: 'src/public/js'
    }
};

//=============================================================================

var defaultTasks = [];
var watchTasks = [];

buildDefaultTasks();

//Set a default task
gulp.task('default', defaultTasks, function () { });
gulp.task('watch', watchTasks, function () { });

function buildDefaultTasks(){
    var moduleNames = Object.keys(clientModules);

    moduleNames.forEach(moduleName => {

        var module = clientModules[moduleName];

        // clean
        gulp.task(`${moduleName}_clean_task`, function(){
            del.sync(module.dest);
        });

        // build
        gulp.task(`${moduleName}_build_task`, function(){
            return gulp.src(module.src)
                    .pipe(concat(`${moduleName}.js`))
                    .pipe(gulp.dest(module.dest))
                    .pipe(uglify())
                    .pipe(concat(`${moduleName}.min.js`))
                    .pipe(gulp.dest(module.dest));
        });

        // module task
        defaultTasks.push(`${moduleName}_task`)
        gulp.task(`${moduleName}_task`, [
            `${moduleName}_clean_task`,
            `${moduleName}_build_task`
        ], function () { });

        // watch task
        watchTasks.push(`${moduleName}_watch_task`);
        gulp.task(`${moduleName}_watch_task`, function(){
            return gulp.watch(module.src, [`${moduleName}_task`])
        });

    });
}
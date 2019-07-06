// Initialize modules
const { src, dest, watch, series, parallel } = require('gulp');
// Importing all the Gulp-related packages we want to use
const browsersync = require('browser-sync').create();
const concat = require('gulp-concat');   //concatenates multiple JS files into one file
const uglify = require('gulp-uglify');   //minifies JS
const babel = require('gulp-babel');
const jshint = require('gulp-jshint');



// File paths
const files = {
    jsPath: './js/*.js',
    htmlPath: '*.html'
};

// JS task: concatenates and transpiles JS files to all.js
function jsTask() {
    return src([
        files.jsPath
    ])
        .pipe(jshint({
            esversion: 8
        }))
        .pipe(jshint.reporter('default'))
        .pipe(babel({
            presets: [
                "@babel/preset-env"
            ]
        }))
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(dest('dist')
        );
}
//HTML  task
function htmlTask() {
    return src([
        files.htmlPath
    ])
        .pipe(dest('dist'));
}


// Watch task: watch JS files for changes
// If any change, run  js tasks 
function watchTask() {
    watch([files.jsPath, files.htmlPath],
        parallel(jsTask, htmlTask));
}

// Init BrowserSync.
function browserSync(done) {
    browsersync.init({
        server: './dist',
        port: 8080,
        ui: {
            port: 8081
        }
    });
    done();
}

// Runs the html and js tasks simultaneously
// then watch task
exports.default = series(
    parallel(htmlTask, jsTask),
    browserSync,
    watchTask);
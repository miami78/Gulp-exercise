const gulp = require('gulp');
const jshint = require('gulp-jshint');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const webpack = require('webpack-stream');
const named = require('vinyl-named')
const browserSync = require('browser-sync').create();

gulp.task('processHTML', function (done) {
    gulp.src('*.html')
        .pipe(gulp.dest('dist'));
    done();
});

gulp.task('processImages', function (done) {
    gulp.src('images/**.svg')
        .pipe(gulp.dest('dist/images'));
    done();
});

gulp.task('processJS', function (done) {
    gulp.src(['*.js', '!gulpfile.js'])
        .pipe(jshint({
            esversion: 8
        }))
        .pipe(jshint.reporter('default'))
        .pipe(babel())
        .pipe(named())
        .pipe(webpack())
        // .pipe(uglify())
        .pipe(gulp.dest('dist'));
    done();
});

// gulp.task('babelPolyfill', () => {
//     gulp.src('node_modules/babel-polyfill/browser.js')
//         .pipe(gulp.dest('dist/node_modules/babel-polyfill'));
// });

gulp.task('browserSync', function (done) {
    browserSync.init({
        server: './dist',
        port: 8080,
        ui: {
            port: 8081
        }
    });
    done();
});

gulp.task('watch', gulp.series('browserSync', function (done) {
    gulp.watch(['*.js', '!gulpfile.js'], gulp.series('processJS'));
    gulp.watch('*.html', gulp.series('processHTML'));
    gulp.watch('dist/*.js', browserSync.reload);
    gulp.watch('dist/*.html', browserSync.reload);

    done();
}));

gulp.task('default', gulp.series('processJS', 'processHTML', 'processImages', 'watch', function (done) {
    done();
}));
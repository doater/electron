const gulp = require('gulp');
const spritesmith = require('gulp.spritesmith');
const moment = require('moment');
const merge = require('merge-stream');
const uglify = require('gulp-uglify');

const paths = {
    src: {
        dir: './',
        js: ['./mobile/build/js/*.js', '!./mobile/build/**/*.map'],
        img: ['./mobile/build/img/**/*'],
        html: ['./mobile/*.html']
    },
    dist: {
        dir: './dist/web'
    }
};
module.exports=function(gulp){
    // 复制mobile
    function copyMobile() {
        var imgData = gulp.src(paths.src.img, {
                base: paths.src.dir
            })
            .pipe(gulp.dest(paths.dist.dir));
        var jsData = gulp.src(paths.src.js, {
                base: paths.src.dir
            })
            .pipe(uglify())
            .pipe(gulp.dest(paths.dist.dir));
        var htmlData = gulp.src(paths.src.html, {
                base: paths.src.dir
            })
            .pipe(gulp.dest(paths.dist.dir));
        return merge(imgData, jsData, htmlData);
    }
    gulp.task('copyMobile',gulp.series(copyMobile))
}
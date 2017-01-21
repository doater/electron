const gulp = require('gulp');
const spritesmith = require('gulp.spritesmith');
const merge = require('merge-stream');
const uglify = require('gulp-uglify');
const gulpif = require('gulp-if');
const del=require('del');
const moment = require('moment');
const replace = require('gulp-replace');
const version = moment().format('MMDDHHmm');
const paths = {
    src: {
        dir: './',
        source: ['./wap/**/*', '!./wap/Gruntfile.js', '!./wap/package.json', '!./wap/node_modules/**'],
        img: ['./wap/statics/img/icons/*.png']
    },
    dev: {
        img: './wap/statics/img/',
        css: './wap/statics/sass'
    },
    dist: {
        dir: './dist/web',
        statics: ['./dist/web/wap/statics/sass', './dist/web/wap/statics/img/icons'],
        html:['./dist/web/wap/*.html']
    }
};
module.exports = function(gulp) {
    function sprite() {
        var spriteData = gulp.src(paths.src.img)
            .pipe(spritesmith({
                retinaSrcFilter: './wap/statics/img/icons/*@2x.png',
                imgName: 'spritesheet.retina.png',
                retinaImgName: 'spritesheet.retina@2x.png',
                cssName: '_spritesheet.scss',
                cssSpritesheetName: 'icon',
                padding: 5
            }));
        var imgStream = spriteData.img.pipe(gulp.dest(paths.dev.img));
        var cssStream = spriteData.css.pipe(gulp.dest(paths.dev.css));
        return merge(imgStream, cssStream);
    }

    function copyWap() {
        return gulp.src(paths.src.source, {
                base: paths.src.dir
            })
            .pipe(gulpif((file) => {
                var path = file.path;
                path = path.replace(/\\/g, '/');
                if (path.indexOf('/page') > -1) {
                    return true;
                } else {
                    return false;
                }
            }, uglify()))
            .pipe(gulp.dest(paths.dist.dir));
    }

    function cleanStatics() {
        return del(paths.dist.statics);
    }

    function addVersion() {
        return gulp.src(paths.dist.html, {
                base: paths.dist.dir
            })
            .pipe(replace(/@@version/g, version))
            .pipe(gulp.dest(paths.dist.dir));
    }
    gulp.task('wap_icons', gulp.series(sprite));
    gulp.task('copyWap', gulp.series(
        copyWap,
        cleanStatics,
        addVersion
    ));
}
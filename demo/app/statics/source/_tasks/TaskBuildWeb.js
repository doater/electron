const gulp = require('gulp');
const spritesmith = require('gulp.spritesmith');
const sass = require('gulp-sass');
const moment = require('moment');
const del = require('del');
const replace = require('gulp-replace');
const merge = require('merge-stream');
const gulpif = require('gulp-if');
const uglifyjs = require('uglify-js');
const minifier = require('gulp-uglify/minifier')
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
require('gulp-grunt')(gulp);
const version = moment().format('MMDDHHmm');
const paths = {
    src: {
        dir: './',
        images: ['./web/statics/images/icons/*.png', './web/statics/images/large/*.png', './web/statics/images/login/*.png', './web/statics/images/saas_console/icons/*.png'],
        source: ['./web/**/*', '!./web/plugins/**/*'],
        modules: './web/modules/**/*',
        sprite: './web/statics/sass/_sprite.scss'
    },
    dist: {
        dir: './dist',
        tpl: ['./dist/web/modules/**/*.tpl', '!./dist/web/modules/page/account/**/*.tpl'],
        cleanmodules: './dist/web/modules/**/*',
        modules: './dist/web/modules',
        base: './dist/web/modules/base/**/*.js',
        css: ['./dist/web/statics/styles/**/*.css', '!./dist/web/statics/**/*.min.css'],
        html: ['./dist/web/*.html'],
        statics: [
            './dist/web/statics/images/icons',
            './dist/web/statics/images/large',
            './dist/web/statics/images/login',
            './dist/web/statics/sass',
            './dist/web/tmp',
            './dist/web/modules/view'
        ],
        others: ['./dist/web/statics/scripts/sha1.js', './dist/web/statics/scripts/sha1_worker.js'],
        gif: './dist/web/statics/sass/_sprite_gif.scss',
        sass: ['./dist/web/statics/sass/**/*.scss'],
        styles: './dist/web/statics/styles'
    },
    tmp: {
        dir: './dist/web/tmp',
        base: './dist/web/tmp/modules/base',
        modules: './dist/web/tmp/modules/**/*'
    }
};
module.exports = function(gulp) {
    // 复制modules
    function copySource() {
        return gulp.src(paths.src.source, {
            base: paths.src.dir
        }).pipe(gulp.dest(paths.dist.dir));
    }

    function copyBase() {
        return gulp.src(paths.dist.base)
            .pipe(gulp.dest(paths.tmp.base));
    }


    function replaceTpl() {
        return gulp.src(paths.dist.tpl, {
                base: paths.dist.dir
            }).pipe(replace(/\\/g, '\\\\'))
            .pipe(gulp.dest(paths.dist.dir))
    }
    // 清除dist文件夹中的文件
    function cleanDist() {
        return del([paths.dist.dir]);
    }
    // 压缩js
    function uglifyJS() {
        return gulp.src(paths.tmp.modules)
            .pipe(minifier({
                output:{
                    quote_keys:true
                },
                compress:{
                    screw_ie8:false
                }
            }, uglifyjs))
            .pipe(gulp.dest(paths.dist.modules));
    }
    // 压缩其他
    function uglifyOthers() {
        return gulp.src(paths.dist.others, {
                base: paths.dist.dir
            })
            .pipe(minifier({
                output:{
                    quote_keys:true
                },
                compress:{
                    screw_ie8:false
                }
            }, uglifyjs))
            .pipe(gulp.dest(paths.dist.dir))
    }
    // 压缩css
    function uglifyCss() {
        return gulp.src(paths.dist.css, {
                base: paths.dist.dir
            })
            .pipe(cleanCSS())
            .pipe(gulp.dest(paths.dist.dir));
    }
    // 删除dist中没有压缩合并的modules
    function cleanModules() {
        return del([paths.dist.cleanmodules]);
    }
    //删除无用的静态资源
    function cleanStatics() {
        return del(paths.dist.statics);
    }
    //添加版本号
    function addVersion() {
        return gulp.src(paths.dist.html, {
                base: paths.dist.dir
            })
            .pipe(replace(/@@version/g, version))
            .pipe(gulp.dest(paths.dist.dir));
    }
    // 支持IE
    function createGif() {
        return gulp.src(paths.src.sprite)
            .pipe(replace(/.png/g, '.gif'))
            .pipe(rename('web/statics/sass/_sprite_gif.scss'))
            .pipe(gulp.dest(paths.dist.dir));
    }
    //删除
    function cleanGif() {
        return del(paths.dist.gif);
    }

    function compileSass() {
        return gulp.src(paths.dist.sass)
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest(paths.dist.styles));
    }
    gulp.task('build_web', gulp.series(
        cleanDist,
        gulp.parallel('icons'),
        copySource,
        replaceTpl,
        gulp.parallel('grunt-imagemagick-convert'),
        gulp.parallel('grunt-transport:dist'),
        gulp.parallel('grunt-concat'),
        copyBase,
        cleanModules,
        cleanGif,
        createGif,
        compileSass,
        uglifyJS,
        uglifyOthers,
        uglifyCss,
        cleanStatics,
        addVersion
    ));
    gulp.task('build', gulp.series(
        gulp.parallel('build_web'),
        gulp.parallel('copyWap', 'copyMobile')
    ));
}
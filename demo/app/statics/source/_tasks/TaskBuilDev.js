const gulp = require('gulp');
const spritesmith = require('gulp.spritesmith');
const sass = require('gulp-sass');
const moment = require('moment');
const del = require('del');
const merge = require('merge-stream');
const paths = {
    src: {
        dir: './',
        images: ['./web/statics/images/icons/*.png', './web/statics/images/large/*.png', './web/statics/images/login/*.png', './web/statics/images/saas_console/icons/*.png'],
        sass: ['./web/statics/sass/**/*.scss'],
        source: './web/**/*'
    },
    dev: {
        dir: './',
        images: './web/statics/images/',
        sass: './web/statics/sass',
        css: './web/statics/styles',
        sprite: './web/statics/images/icons-*',
    }
};
const imageName=formatName('icons.png');
//格式化名称 版本号
function formatName(name) {
    var version = moment().format('MMDDHHmm');
    var tmp = name.split('.');
    return tmp[0] + '-' + version + '.' + tmp[1];
}
module.exports=function(gulp){
    // 删除老版本雪碧图
    function delSprite() {
        return del(paths.dev.sprite);
    }
    // 编译saas
    function compileSass() {
        return gulp.src(paths.src.sass)
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest(paths.dev.css));
    }
    // 生成雪碧图
    function sprite() {
        var spriteData = gulp.src(paths.src.images)
            .pipe(spritesmith({
                imgName:imageName,
                cssName: '_sprite.scss',
                cssSpritesheetName: 'icon',
                padding: 5,
                imgPath:'../images/'+imageName
            }));
        var imgStream = spriteData.img.pipe(gulp.dest(paths.dev.images));
        var cssStream = spriteData.css.pipe(gulp.dest(paths.dev.sass));
        return merge(imgStream, cssStream);
    }
    // 重新生成雪碧图
    gulp.task('icons', gulp.series(
        delSprite,
        sprite
    ));
    // 编译sass
    gulp.task('sass',gulp.series(compileSass));
    // 生成雪碧图 并生成 saas
    gulp.task('build_dev',gulp.series(
        delSprite,
        sprite,
        compileSass
    ));
    // 监听sass
    gulp.task('dev', () => {
        gulp.watch(paths.src.sass, gulp.series(compileSass));
    });
}
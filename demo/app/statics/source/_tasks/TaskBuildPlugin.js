const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const paths={
    src:{
        dir:'./web/plugins'
    },
    dist:{
        dir:'./dist/web/plugins'
    }
};
function readSyncByfs(tips) {
    var response;
    tips = tips || '> ';
    process.stdout.write(tips);
    response = fs.readSync(process.stdin.fd, 1000, 0, 'utf8');
    process.stdin.pause();
    return response[0].trim();
};
module.exports =(gulp)=>{
    gulp.task('plugin',()=>{
        console.log('web插件列表');
        console.log('_________________');
        var lists=fs.readdirSync(paths.src.dir);
        lists.forEach(function(item){
            console.log(item);
        });
        console.log('_________________');
        var answer=readSyncByfs('请输入你要上传的插件名称：');
        return gulp.src(paths.src.dir+'/'+answer+'/**/*')
            .pipe(gulp.dest(paths.dist.dir+'/'+answer));
    })
}
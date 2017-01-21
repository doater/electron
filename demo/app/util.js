var process = require('child_process');
var electron = require('electron');
var ipcMain = electron.ipcMain;
var fs=require('fs');
var path=require('path');
var Q=require('q');
// 删除文件(支持删除非空文件)
var rmdirSync = (function(){
    function iterator(url,dirs){
        var stat = fs.statSync(url);
        if(stat.isDirectory()){
            dirs.unshift(url);//收集目录
            inner(url,dirs);
        }else if(stat.isFile()){
            fs.unlinkSync(url);//直接删除文件
        }
    }
    function inner(path,dirs){
        var arr = fs.readdirSync(path);
        for(var i = 0, el ; el = arr[i++];){
            iterator(path+"/"+el,dirs);
        }
    }
    return function(dir,cb){
        cb = cb || function(){};
        var dirs = [];
 
        try{
            iterator(dir,dirs);
            for(var i = 0, el ; el = dirs[i++];){
                fs.rmdirSync(el);//一次性删除所有收集到的目录
            }
            cb()
        }catch(e){//如果文件或目录本来就不存在，fs.statSync会报错，不过我们还是当成没有异常发生
            e.code === "ENOENT" ? cb() : cb(e);
        }
    }
})();
// 复制文件夹
function copyDir(src, dist, callback) {
  fs.access(dist, function(err){
    if(err){
      // 目录不存在时创建目录
      fs.mkdirSync(dist);
    }
    _copy(null, src, dist);
  });

  function _copy(err, src, dist) {
    if(err){
      callback(err);
    } else {
      fs.readdir(src, function(err, paths) {
        if(err){
          callback(err)
        } else {
          paths.forEach(function(path) {
            var _src = src + '/' +path;
            var _dist = dist + '/' +path;
            fs.stat(_src, function(err, stat) {
              if(err){
                callback(err);
              } else {
                // 判断是文件还是目录
                if(stat.isFile()) {
                  fs.writeFileSync(_dist, fs.readFileSync(_src));
                } else if(stat.isDirectory()) {
                  // 当是目录是，递归复制
                  copyDir(_src, _dist, callback)
                }
              }
            })
          })
        }
      })
    }
  }
}
function buildDist(event, arg) {
    process.exec('cd /d '+arg+'&gulp build',function(error,stdout,stderr){
        if(error!==null){
            event.sender.send('build_error',{
                content:error,
                path:arg,
                type:'Zip打包'
            });
        }else{
            event.sender.send('build_success',{
                content:stdout,
                path:arg,
                type:'Zip打包'
            });
        }
    })
}

function createSource(event,arg){
    var dtd=Q.defer();
    var _tasksPath=path.resolve(arg,'_tasks');
    if(!fs.existsSync(_tasksPath)){
        // 删除响应项目中的构建文件
        var map=['_tasks','Gulpfile.js','Gruntfile.js','package.json'];
        for(var i=0;i<map.length;i++){
            rmdirSync(path.resolve(arg,map[i]),function(error){
                if(error) dtd.reject(error);
            })
        }
        // 创建构建文件
        var sourcePath=path.resolve(__dirname,'./statics/source');
        copyDir(sourcePath,arg,function(error){
            if(error) dtd.reject(error);
        });
        // 安装项目依赖
        process.exec('cd /d '+arg+'&cnpm install',{encoding:'utf8'},function(error,stdout){
            if(error) dtd.reject(error);
            dtd.resolve();
        })
    }else{
        dtd.resolve();
    }
    return dtd.promise;
}
function buildDev(event,arg){
    process.exec('cd /d '+arg+'&gulp build_dev',function(error,stdout,stderr){
        if(error!==null){
            event.sender.send('build_error',{
                content:error,
                path:arg,
                type:'生产编译'
            });
        }else{
            event.sender.send('build_success',{
                content:stdout,
                path:arg,
                type:'生产编译'
            });
        }
    })
}
function watch(event,arg){
    process.exec('cd /d '+arg+'&gulp dev',function(error,stdout,stderr){
        if(error!==null){
            event.sender.send('build_error',{
                content:error,
                path:arg,
                type:'监听'
            });
        }else{
            event.sender.send('build_success',{
                content:stdout,
                path:arg,
                type:'监听'
            });
        }
    })
}
function stopWatch(event,arg){
    // process.exec('cd /d '+arg+'&.exit',function(error,stdout,stderr){
    //     if(error!==null){
    //         event.sender.send('build_error',{
    //             content:error,
    //             path:arg,
    //             type:'监听'
    //         });
    //     }else{
    //         event.sender.send('build_success',{
    //             content:stdout,
    //             path:arg,
    //             type:'监听'
    //         });
    //     }
    // })
    process.exit();
    event.sender.send('build_success',{
        content:'终端',
        path:arg,
        type:'监听'
    });

}
module.exports = {
    buildDist: buildDist,
    createSource:createSource,
    buildDev:buildDev,
    watch:watch,
    stopWatch,stopWatch
}
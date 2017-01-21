// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
// const buildBtn=document.querySelector('#build');

const {
    ipcRenderer
} = require('electron');
const moment = require('moment');
var listArray = [];
// 刷新列表
ipcRenderer.send('filelist', localStorage);
// zip打包
$('#build').on('click', () => {
    if (!$('#build').hasClass('active')) {
        let $target=$('.file-active');
        let path=$target.attr('path');
        let name=$target.attr('name');
        $('#build').text('Zip打包中...');
        $('#build').addClass('active');
        reloadStatus('资源配置中');
        let result=ipcRenderer.sendSync('create-source',path);
        if(result===null){
            ipcRenderer.send('build',path);
        }
    }
})
// 生产编译
$('#dev').on('click',()=>{
    if (!$('#dev').hasClass('active')) {
        let $target=$('.file-active');
        let path=$target.attr('path');
        let name=$target.attr('name');
        $('#dev').text('生产编译中...');
        $('#dev').addClass('active');
        reloadStatus('资源配置中');
        let result=ipcRenderer.sendSync('create-source',path);
        if(result===null){
            ipcRenderer.send('dev',path);
        }
    }
})
// 监听
$('#watch').on('click',()=>{
    let $target=$('.file-active');
    let path=$target.attr('path');
    let name=$target.attr('name');
    if (!$('#watch').hasClass('active')) {
        $('#watch').text('监听'+name+'中...');
        $('#watch').addClass('active');
        reloadStatus('资源配置中');
        let result=ipcRenderer.sendSync('create-source',path);
        if(result===null){
            ipcRenderer.send('watch',path);
        }
    }else{
        ipcRenderer.send('stopWatch',path);
    }
})
ipcRenderer.on('build_success', (event, arg) => {
    let obj = {
        time: moment().format('lll'),
        status: 'OK',
        content: arg.content,
        path:arg.path,
        type:arg.type
    }
    listArray.push(obj);
    setTimeout(function(){
        reloadStatus(obj);
    },300);
})
ipcRenderer.on('build_error', (event, arg) => {
    let obj = {
        time: moment().format('lll'),
        status: 'ERROR',
        content: arg.content,
        path:arg.path,
        type:arg.type
    }
    listArray.push(obj);
    setTimeout(function(){
        reloadStatus(obj);
    },300);
})
ipcRenderer.on('reloadlist',(event,arg)=>{
    var str=''
    let index=0;
    for(let key in arg){
        str+='<dt class="col" path="'+key+'" name="'+arg[key]+'" index="'+index+'"><div class="file-item"><i></i><span class="name">'+arg[key]+'</span><span class="path">'+key+'</span><div class="tip"></div></div></dt>';
        index++;
    }
    $('#filelist dl').html(str);
    $('.col[index="0"]').addClass('file-active');
    $('.col[index="0"]').append('<div class="border-active"></div>');
    reloadStatus('');
})
ipcRenderer.on('reload-status',(event,arg)=>{
    reloadStatus(arg);
})
// 打开List列表
$('.cmd-list').on('click', () => {
    ipcRenderer.send('open-list-window', listArray);
})
$('.open').on('change', '#webkitdirectory', function() {
    let $this = $(this);
    let rows = $('#webkitdirectory').prop('files');
    let path = rows[0].path;
    let name = rows[0].name;
    localStorage.setItem(path, name);
    ipcRenderer.send('filelist', localStorage);
});
$('#filelist').on('click','.col',(event)=>{
    event.preventDefault();
    let $target=$(event.target);
    $('#filelist .col').removeClass('file-active');
    $('.border-active').remove();
    if(!$target.hasClass('col')){
        if(!$target.parents('.col').hasClass('file-active')) $target.addClass('file-active');
        $target.parents('.col').append('<div class="border-active"></div>'); 
    }else{
       if(!$target.hasClass('file-active')) $target.addClass('file-active');
       $target.append('<div class="border-active"></div>'); 
    }
    return false;
})
// 更新状态
function reloadStatus(params){
    switch(params.type){
        case 'Zip打包':
            $('#build').text('Zip打包');
            $('#build').removeClass('active');
            break;
        case '生产编译':
            $('#dev').text('生产编译');
            $('#dev').removeClass('active');
            break;
        case '监听':
            $('#watch').text('监听');
            $('#watch').removeClass('active');
    }
    $('.status').text(params.status);
}

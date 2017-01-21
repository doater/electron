const {ipcRenderer}=require('electron');
ipcRenderer.send('get-cmd-list')
ipcRenderer.on('getlist',(event,arg)=>{
    list(arg);
})
function list(data){
    console.log(data);
    var str='';
    str+='<table><tr class="head"><td width="30">#</td><td width="50">类型</td><td width="100">时间</td><td width="50">状态</td><td width="100">路径</td></tr>'
    for(let i=0;i<data.length;i++){
        if(data[i].status=='ERROR') title=data[i].content.cmd;
        else title=data[i].content;
        str+='<tr><td>'+(i+1)+'</td><td>'+data[i].type+'</td><td>'+data[i].time+'</td><td>'+data[i].status+'</td><td>'+data[i].path+'<i class="tip" title="'+title+'"></i></td></tr>'
    }
    str+='</table>';
    $('.list_content table').html(str);
}
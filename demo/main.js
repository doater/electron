const electron = require('electron')
  // Module to control application life.
const app = electron.app
  // Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain
const path = require('path')
const url = require('url')
const {
  buildDist,
  buildDev,
  createSource,
  watch,
  stopWatch
} = require('./app/util')
  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let listWindow
let listArray

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 500,
    height: 570
      // resizable:false
      // frame:false
  })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'app/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
      createWindow()
    }
  })
  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.
ipcMain.on('build', (event, arg) => {
  buildDist(event, arg);
})
ipcMain.on('dev',(event,arg)=>{
  buildDev(event,arg);
})
ipcMain.on('watch',(event,arg)=>{
  watch(event,arg);
})
ipcMain.on('stopWatch',(event,arg)=>{
  stopWatch(event,arg);
})
ipcMain.on('open-list-window', (event, arg) => {
  if (listWindow) {
    return;
  }
  listWindow = new BrowserWindow({
    height: 500,
    width: 500,
    resizable: false
  })
  listWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'app/list.html'),
    protocol: 'file:',
    slashes: true
  }))
  listWindow.webContents.openDevTools();
  listWindow.on('closed', () => {
    listWindow = null;
  })
  listArray = arg
})
// 消息列表
ipcMain.on('get-cmd-list', (event, arg) => {
  listArray = listArray.reverse();
  event.sender.send('getlist', listArray);
})
//文件列表
ipcMain.on('filelist',(event,arg)=>{
  event.sender.send('reloadlist',arg);
})
// 在响应的项目中创建资源
ipcMain.on('create-source',(event,arg)=>{
  createSource(event,arg).then(function(error){
    event.returnValue=null;
    event.sender.send('reload-status','资源配置成功');
  },function(error){
    event.returnValue=error;
    event.sender.send('reload-status','资源配置失败');
  });
})

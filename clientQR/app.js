const {BrowserWindow,app,ipcRenderer,ipcMain}=require('electron');
const path=require('path');
const qrCode=require('qrcode');

let win=null;


///
ipcMain.on('QRstringToObjURL',(err,args)=>{
    var opts = {
        errorCorrectionLevel: 'H',
        type: 'png',
        rendererOpts: {
          quality: 1,
        },
        scale:15

      }
    qrCode.toDataURL(args.stringqr,opts,(err,res)=>{
        win.webContents.send('sendDataURL',{url:res});
    })
})
///



function makeWindow(){
   win=new BrowserWindow({
       height:720,
       width:1280
   })
   win.loadURL(path.join('file://',__dirname,'index.html'));
   win.on('close',()=>{
       win=null;
   })
}

app.on('ready',()=>{
    makeWindow();
})

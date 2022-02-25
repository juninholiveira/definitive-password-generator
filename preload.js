const { contextBridge, clipboard } = require('electron')
//const remote = require('electron').remote;

contextBridge.exposeInMainWorld('clipboard',{
        copyToClipboard(text){
            clipboard.writeText(text)
        }
})
// contextBridge.exposeInMainWorld('remote',{
//     getCurrentWindow(){
//         remote.getCurrentWindow()
//     }
// })

window.addEventListener('DOMContentLoaded', () => {
});

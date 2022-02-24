const { contextBridge, clipboard } = require('electron')

contextBridge.exposeInMainWorld('clipboard',{
        copyToClipboard(text){
            clipboard.writeText(text)
        }
})

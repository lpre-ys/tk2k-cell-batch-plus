const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('tk2k', {
  writeData: async (args) => {
    return await ipcRenderer.invoke('write-anime', args)
  },
  readInfo: async () => {
    return await ipcRenderer.invoke('read-info')
  }
})

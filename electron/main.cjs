const { app, BrowserWindow } = require('electron');

function createWindow() {
  const { width, height } = require('electron').screen.getPrimaryDisplay().workAreaSize;
  
  const win = new BrowserWindow({
    width,
    height,
    fullscreen: true,
    kiosk: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadURL('http://localhost:8080');
  win.webContents.setZoomFactor(1.4);

  win.webContents.on('dom-ready', () => {
    win.webContents.insertCSS(`
      * { cursor: none !important; }
      html, body, #root { 
        width: 100% !important; 
        height: 100% !important; 
        margin: 0 !important; 
        padding: 0 !important;
        overflow: hidden !important;
      }
    `);
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
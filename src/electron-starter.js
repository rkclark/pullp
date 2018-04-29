/* eslint-disable no-console */
const isDev = require('electron-is-dev');
const path = require('path');
const url = require('url');
const electron = require('electron');
const menuTemplate = require('./electronHelpers/menuTemplate');
const runAutoUpdater = require('./electronHelpers/autoUpdater');

const { app, shell, Menu } = electron;

// Set server port depending on electron environment
let serverPort = isDev ? '9821' : '9822';

// Override if running electron in dev mode against built production files
if (process.env.NODE_ENV === 'production') {
  serverPort = '9822';
}

require('../server')(serverPort);

require('electron-debug')({ enabled: true });

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createMainWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, '/preload.js'),
    },
    titleBarStyle: 'hidden',
  });

  // and load the index.html of the app.
  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, '../build/index.html'),
      protocol: 'file:',
      slashes: true,
    });
  mainWindow.loadURL(startUrl);

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  const handleRedirect = (e, navUrl) => {
    if (navUrl.includes('github.com')) {
      e.preventDefault();
      shell.openExternal(navUrl);
    }
  };

  mainWindow.webContents.on('will-navigate', handleRedirect);
  mainWindow.webContents.on('new-window', handleRedirect);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  if (isDev) {
    console.log('Running in development');
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
      REDUX_DEVTOOLS,
    } = require('electron-devtools-installer'); // eslint-disable-line global-require

    installExtension(REACT_DEVELOPER_TOOLS)
      .then(name => console.log(`Added Extension:  ${name}`))
      .catch(err => console.log('An error occurred: ', err));

    installExtension(REDUX_DEVTOOLS)
      .then(name => console.log(`Added Extension:  ${name}`))
      .catch(err => console.log('An error occurred: ', err));
  }

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  electron.protocol.interceptFileProtocol(
    'file',
    (request, callback) => {
      const strippedUrl = request.url.substr(7); /* all urls start with 'file://' */ // eslint-disable-line
      if (strippedUrl.includes('index.html')) {
        callback({ path: strippedUrl });
        return;
      }
      const newPath = strippedUrl.startsWith('/static')
        ? path.resolve(__dirname, `../build/${strippedUrl}`)
        : path.resolve(`/${strippedUrl}`);

      callback({ path: newPath });
    },
    err => {
      if (err) console.error('Failed to register protocol');
    } // eslint-disable-line
  );
  createMainWindow();
  runAutoUpdater(mainWindow);
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createMainWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

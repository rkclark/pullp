const { autoUpdater } = require('electron-updater');
const isDev = require('electron-is-dev');
const electron = require('electron');

const { shell, dialog } = electron;

autoUpdater.autoDownload = false;

module.exports = function runAutoUpdater(mainWindow) {
  if (isDev) {
    // eslint-disable-next-line global-require
    const logger = require('electron-log');
    autoUpdater.logger = logger;
    autoUpdater.logger.transports.file.level = 'info';
  }

  autoUpdater.checkForUpdates();

  const linkToUpdatePage = response => {
    if (response === 0) {
      shell.openExternal('https://github.com/rkclark/pullp/releases');
    }
  };

  autoUpdater.on('update-available', info => {
    dialog.showMessageBox(
      mainWindow,
      {
        type: 'info',
        title: 'Update Available',
        message: `Version ${info.version} of Pullp is now available!`,
        buttons: ['Get the update', 'Skip for now'],
      },
      linkToUpdatePage,
    );
  });
};

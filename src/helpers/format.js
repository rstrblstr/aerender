const path = require('path');
const fs = require('fs');
const os = require('os');
const shortid = require('shortid');
const autofind = require('./autofind.js');
const patch = require('./patch.js');
const chalk  = require('chalk');

const debugLog = (type, msg) => {
  if (!msg) {
    msg = type;
    type = 'common';
  }
  console.log(chalk.bgMagentaBright.bold(`[${type}]:`) + chalk.green(msg));
}

const formatOption = (options) => {
  const oriTem = options.template;
  const template = {
    src: oriTem.src,
    frameStart: oriTem.frameStart,
    frameEnd: oriTem.frameEnd,
    composition: oriTem.composition || 'Travel Opener Comp',
    outputModule: oriTem.outputModule || 'QuickTime DV PAL 48kHz',
    outputExt: oriTem.outputExt || (os.platform() === 'darwin' ? 'mov' : 'avi'),
    outputFileName: oriTem.outputFileName || 'result',
    incrementFrame: oriTem.incrementFrame || 0,
    continueOnMissing: oriTem.continueOnMissing || false,
  };
  const result = {
    uid: options.uid || shortid(), // id
    state: 'created', // 状态
    template: template,// 模板配置
    assets: options.assets, // 资源文件
    actions: options.actions ? options.actions : {
      prerender: [],
      postrender: [],
    },
    output: options.output || '', // 视频文件输出目录
    onChange: (job, state) => {
      console.log("=================>", state)
    }
  };
  return result;
}


const formatSettings = (settings) => {
  settings = Object.assign({}, settings);

  const binaryAuto = autofind(settings);
  const binaryUser = settings.binary && fs.existsSync(settings.binary) ? settings.binary : null;

  if (!binaryUser && !binaryAuto) {
    throw new Error('you should provide a proper path to After Effects\' \"aerender\" binary')
  }

  if (binaryAuto && !binaryUser) {
    console.log('using automatically determined directory of After Effects installation: -' + binaryAuto)
  }

  settings = Object.assign({
    workpath: path.join(os.tmpdir(), 'aerender'),
    forceCommandLinePatch: false,
    skipCleanup: false,
    skipRender: false,
    stopOnError: true,
    skipScript: true,
    debug: false,
    multiFrames: false,
    maxMemoryPercent: undefined,
    imageCachePercent: undefined,
    onInstanceSpawn: undefined,
    __initialized: true,
    reuse: false
  }, settings, {
    binary: binaryAuto//binaryUser || binaryAuto,
  })

  // make sure we will have absolute path
  if (!path.isAbsolute(settings.workpath)) {
    settings.workpath = path.join(process.cwd(), settings.workpath);
  }
  settings.loger = debugLog;
  patch(settings);
  return settings;
}

module.exports = {
  formatOption,
  formatSettings,
  debugLog,
};

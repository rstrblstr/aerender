const path = require('path');
const fs = require('fs');
const os = require('os');
const isWsl = require('is-wsl');
const shortid = require('shortid');
const autofind = require('./autofind.js');

const formatOption = (options) => {
  const oriTem = options.template;
  const template = {
    src: oriTem.src,
    frameStart: oriTem.frameStart,
    frameEnd: oriTem.frameEnd,
    composition: oriTem.composition || 'Travel Opener Comp',
    outputModule: oriTem.outputModule || 'QuickTime DV PAL 48kHz',
    outputExt: oriTem.outputExt || 'mp4',
    outputFileName: oriTem.outputFileName || 'result',
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
  };
  return result;
}


const formatSettings = (settings) => {
  settings = Object.assign({}, settings);
  // check for WSL
  settings.wsl = isWsl

  const binaryAuto = autofind(settings);
  const binaryUser = settings.binary && fs.existsSync(settings.binary) ? settings.binary : null;

  if (!binaryUser && !binaryAuto) {
    throw new Error('you should provide a proper path to After Effects\' \"aerender\" binary')
  }

  if (binaryAuto && !binaryUser) {
    console.log('using automatically determined directory of After Effects installation:')
    console.log(' - ' + binaryAuto)
  }

  settings = Object.assign({
    workpath: path.join(os.tmpdir(), 'aerender'),

    addLicense: false,
    forceCommandLinePatch: false,
    skipCleanup: false,
    skipRender: false,
    stopOnError: true,

    debug: false,
    multiFrames: false,
    maxMemoryPercent: undefined,
    imageCachePercent: undefined,
    wslMap: undefined,

    onInstanceSpawn: undefined,

    __initialized: true,
  }, settings, {
    binary: binaryAuto//binaryUser || binaryAuto,
  })

  // make sure we will have absolute path
  if (!path.isAbsolute(settings.workpath)) {
    settings.workpath = path.join(process.cwd(), settings.workpath);
  }

  // if WSL, ask user to define Mapping
  if (settings.wsl && !settings.wslMap)
    throw new Error('WSL detected: provide your WSL drive map; ie. "Z"')

  // attempt to patch the default
  // Scripts/commandLineRenderer.jsx
  // patch(settings);

  return settings;
}

module.exports = {
  formatOption,
  formatSettings,
};

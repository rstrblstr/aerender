#!/usr/bin/env node
const path = require('path');
const start = require('./src/index');

const workpath = path.resolve(__dirname, `./`);

const resolvePath = (dir) => {
  return 'file://' + path.resolve(__dirname + '/test/', '' + dir);
}

start({
  uid: '100000',
  template: {
    src: resolvePath('./files/template6.aepx'),
    frameStart: 1,
    frameEnd: 600,
    composition: 'Travel Opener Comp',
    outputModule: 'QuickTime DV PAL 48kHz',
    continueOnMissing: true,
    outputFileName: 'test-01',
    outputExt: 'mov'
  },
  assets: [
    {
      type: 'image',
      layerIndex: 15,
      name: "logo",
      src: 'https://tnfe.gtimg.com/image/color-mixkit-logo_1618923853686.png'
    },
    {
      type: 'video',
      layerIndex: 9,
      name: "2168.mp4",
      src: resolvePath('./files/mixkit-bright-orange-sunset-on-beach-2168.mp4')
    },
    {
      type: 'video',
      layerIndex: 10,
      name: "1056.mp4",
      src: resolvePath('./files/mixkit-couple-holding-hands-on-the-beach-1056.mp4')
    },
    {
      type: 'video',
      layerIndex: 11,
      name: "1954.mp4",
      src: resolvePath('./files/mixkit-sea-waves-in-a-little-bay-1954.mp4')
    },
    {
      type: 'video',
      layerIndex: 12,
      name: "4421.mp4",
      src: resolvePath('./files/mixkit-vintage-film-roll-effect-with-countdown-4421.mp4')
    },
    {
      type: 'video',
      layerIndex: 13,
      name: "1015.mp4",
      src: resolvePath('./files/mixkit-woman-running-happily-on-the-beach-1015.mp4')
    },
    {
      type: 'video',
      layerIndex: 14,
      name: "1111.mp4",
      src: resolvePath('./files/mixkit-woman-walking-on-the-beach-1111.mp4')
    },
  ],
  actions: [],
}, {
  workpath: workpath,
  stopOnError: false,
  multiFrames: true,
  skipCleanup: true,
}).then((res) => {
  console.log(res);
}).catch(err => {
  console.log(err);
})
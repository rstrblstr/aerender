const start = require('../src/index.js');
const path = require('path');

const resolvePath = (dir) => {
  return 'file://' + path.resolve(__dirname, dir)
}

describe('测试入口', () => {
  it('测试1+1=2', () => {
    expect(1 + 1).toBe(2)
  });
  test("test start", async() => {
    const workpath = path.resolve(__dirname, `../`);
    const res = await start({
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
          layerIndex: 7,
          name: "color-mixkit-logo.png",
          src: 'https://tnfe.gtimg.com/image/color-mixkit-logo_1618923853686.png'
        },
        {
          type: 'video',
          layerIndex: 1,
          name: "mixkit-bright-orange-sunset-on-beach-2168.mp4",
          src: resolvePath('./files/mixkit-bright-orange-sunset-on-beach-2168.mp4')
        },
        {
          type: 'video',
          layerIndex: 2,
          name: "mixkit-couple-holding-hands-on-the-beach-1056.mp4",
          src: resolvePath('./files/mixkit-couple-holding-hands-on-the-beach-1056.mp4')
        },
        {
          type: 'video',
          layerIndex: 3,
          name: "mixkit-sea-waves-in-a-little-bay-1954.mp4",
          src: resolvePath('./files/mixkit-sea-waves-in-a-little-bay-1954.mp4')
        },
        {
          type: 'video',
          layerIndex: 4,
          name: "mixkit-vintage-film-roll-effect-with-countdown-4421.mp4",
          src: resolvePath('./files/mixkit-vintage-film-roll-effect-with-countdown-4421.mp4')
        },
        {
          type: 'video',
          layerIndex: 5,
          name: "mixkit-woman-running-happily-on-the-beach-1015.mp4",
          src: resolvePath('./files/mixkit-woman-running-happily-on-the-beach-1015.mp4')
        },
        {
          type: 'video',
          layerIndex: 6,
          name: "mixkit-woman-walking-on-the-beach-1111.mp4",
          src: resolvePath('./files/mixkit-woman-walking-on-the-beach-1111.mp4')
        },
      ],
      actions: [],
    }, {
      workpath: workpath,
      stopOnError: false,
      multiFrames: true,
      skipCleanup: true,
    });
    const output = path.resolve(workpath, './output/test-01.mov');
    console.log(res);
    expect(res.output === output).toBeTruthy();
  });
});
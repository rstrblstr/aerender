const assert = require('assert');
const validate = (options) => {
  assert(options.template, 'aerender job must have template object option');
  assert(options.template.src, 'aerender job must have template.src option');
  assert(options.template.composition, 'aerender job must have template.composition option');
  assert(options.template.frameStart, 'aerender job must have template.frameStart option');
  assert(options.template.frameEnd, 'aerender job must have template.frameEnd option');
  assert(options.template.outputModule, 'aerender job must have template.outputModule option');

  options.assets.map(asset => {
    assert(asset, 'aerender job asset should not be empty');
    assert(asset.type, 'aerender job asset must have type defined');
    switch (asset.type) {
      case 'image':
      case 'video':
      case 'audio':
        assert(asset.src, `aerender job asset[${asset.type}] must have src defined`);
        assert(asset.layerName || asset.layerIndex, `aerender job asset[${asset.type}/video] must have either layerName or layerIndex defined`);
        break;
      case 'data':
        assert(asset.layerName || asset.layerIndex, `aerender job asset[${asset.type}] must have either layerName or layerIndex defined`);
        assert(asset.value !== undefined || asset.expression, `aerender job asset[${asset.type}] must have value and/or expression defined`);
        assert(asset.property, `aerender job asset[${asset.type}] must have property defined`);
        break;

      case 'script':
      case 'static':
        assert(asset.src, `aerender job asset[${asset.type}] must have src defined`);
        break;

      default:
        assert(false, `unknown aerender job asset type: ${asset.type}`)
    }
  });
  assert(options.actions);
  [].concat(
    options.actions.prerender || [],
    options.actions.postrender || []
  ).map(action => {
    assert(action, `aerender job action must be defined`);
    assert(action.module, `aerender job action must have module defined`);
  });
  return true;
}

module.exports = validate;
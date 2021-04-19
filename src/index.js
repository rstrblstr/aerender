// const { render } = require('@nexrender/core');
const { formatSettings } = require('./helpers/format');

const state      = require('./helpers/state')
const setup      = require('./tasks/setup');
const download   = require('./tasks/download');
const preRender  = require('./tasks/actions')('prerender');
const script     = require('./tasks/script');
const render   = require('./tasks/render');
const postRender = require('./tasks/actions')('postrender');
const cleanup    = require('./tasks/cleanup');

/**
 *
 * @param options
 * @return {Promise<{}>}
 */
const init = async function(job = {}, settings = {}) {
  // const check = validate(options);
  // options = formatOption(options);
  // settings = formatSettings(settings);
  // if(!check) {
  //   throw new Error('options check failed');
  // }
  // const result = await render(options, settings);
  // return result;

  settings = formatSettings(settings);

  return Promise.resolve(job)
    .then(job => state(job, settings, setup, 'setup'))
    .then(job => state(job, settings, download, 'download'))
    .then(job => state(job, settings, preRender, 'prerender'))
    .then(job => state(job, settings, script, 'script'))
    .then(job => state(job, settings, render, 'dorender'))
    .then(job => state(job, settings, postRender, 'postrender'))
    .then(job => state(job, settings, cleanup, 'cleanup'))
}

module.exports = init;
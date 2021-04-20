const os      = require('os')
const path    = require('path')
const mkdirp  = require('mkdirp')
const assert  = require('assert')

const validate = require('../helpers/validate');
const { formatOption } = require('../helpers/format');

/**
 * This task creates working directory for current job
 */
module.exports = (job, settings) => {
    /* fill default job fields */
    settings.loger(`${job.uid}::setup`, `setting up job...`);

    try {
        assert(validate(job) == true)
    } catch (err) {
        return Promise.reject('Error validate job: ' + err)
    }

    job = formatOption(job);
    job.resultname = job.template.outputFileName + '.' + job.template.outputExt;

    const output = job.output || path.join(settings.workpath, 'output');
    // setup paths
    job.workpath = path.join(output, job.uid);
    job.output   = path.join(output, job.resultname);
    mkdirp.sync(job.workpath);
    mkdirp.sync(output);

    settings.loger(`${job.uid}::setup`, `working directory is: ${job.workpath}`);
    settings.loger(`${job.uid}::setup`, `working output is: ${job.output}`);

    return Promise.resolve(job)
};

const rimraf = require('rimraf')

/**
 * Clean up all workpath files and remove folder
 */
module.exports = function(job, settings) {
    if (settings.skipCleanup) {
        settings.loger(`${job.uid}::cleanup`, `skipping the clean up...`);
        return Promise.resolve(job)
    }

    return new Promise((resolve, reject) => {
        settings.loger(`${job.uid}::cleanup`, `cleaning up...`);

        rimraf(job.workpath, {glob: false}, (err) => {
            if (!err) {
                settings.loger(`${job.uid}::cleanup`, `Temporary AfterEffects project deleted`);
            } else {
                settings.loger(`${job.uid}::cleanup`, `Temporary AfterEffects could not be deleted`);
            }

            resolve(job)
        })
    })
};


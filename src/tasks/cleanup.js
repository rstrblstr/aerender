const rimraf = require('rimraf')

/**
 * Clean up all workpath files and remove folder
 */
module.exports = function(job, settings) {
    if (settings.skipCleanup) {
        console.log(`[${job.uid}] skipping the clean up...`);
        return Promise.resolve(job)
    }

    return new Promise((resolve, reject) => {
        console.log(`[${job.uid}] cleaning up...`);

        rimraf(job.workpath, {glob: false}, (err) => {
            if (!err) {
                console.log(`[${job.uid}] Temporary AfterEffects project deleted. If you want to inspect it for debugging, use "--skip-cleanup"`)
            } else {
                console.log(`[${job.uid}] Temporary AfterEffects could not be deleted. (Error: ${err.code}). Please delete the folder manually: ${job.workpath}`)
            }

            resolve(job)
        })
    })
};


const fs      = require('fs')
const path    = require('path')
const mkdirp  = require('mkdirp')
const patched = require('../assets/commandLineRenderer.jsx')

const writeTo = (data, dst) => fs.writeFileSync(dst, data)
const copyTo = (src, dst) => fs.writeFileSync(dst, fs.readFileSync(src))

/**
 * Attempt to patch the After Effect's command line renderer
 * @type {Object}
 */
module.exports = (settings) => {
    const targetScript  = 'commandLineRenderer.jsx';

    const afterEffects = path.dirname(settings.binary)
    const originalFile = path.join(afterEffects, 'Scripts', 'Startup', targetScript)
    const backupFile   = path.join(afterEffects, 'Backup.Scripts', 'Startup', targetScript)

    const data = fs.readFileSync(originalFile, 'utf8')
    settings.loger('checking After Effects command line renderer patch...')

    /* check if file has been patched already */
    /* by looking for 'nexrender' in the text anywhere */
    if (data.indexOf('nexrender-patch') !== -1) {
        settings.loger('command line patch already is in place')

        const patchedMatch = patched.match(/nexrender-patch-v([0-9\.]+)/)
        const existingMatch = data.match(/nexrender-patch-v([0-9\.]+)/)

        if (patchedMatch[1] !== existingMatch[1]) {
            try {
                settings.loger('out-of-date version of the commandLineRenderer.jsx patch is detected, attepmting to update')
                writeTo(patched, originalFile)
            } catch (err) {
                if (err.code == 'EPERM') {
                    settings.loger('\n\n              -- E R R O R --\n');
                    settings.loger('you need to run application with admin priviledges once');
                    settings.loger('to install Adobe After Effects commandLineRenderer.jsx patch\n');

                    if (process.platform == 'win32') {
                        settings.loger('reading/writing inside Program Files folder on windows is blocked')
                        settings.loger('please run nexrender with Administrator Privilidges only ONE TIME, to update the patch\n\n')
                    } else {
                        settings.loger('you might need to try to run nexrender with "sudo" only ONE TIME to update the patch\n\n')
                    }

                    process.exit(2);
                } else {
                    throw err
                }
            }
        }

        if (settings.forceCommandLinePatch) {
            settings.loger('forced rewrite of command line patch')
            writeTo(patched, originalFile)
        }
    } else {
        settings.logger('backing up original command line script to:')
        settings.logger(' - ' + backupFile)

        try {
            mkdirp.sync(path.join(afterEffects, 'Backup.Scripts', 'Startup'))
            copyTo(originalFile, backupFile)

            settings.loger('patching the command line script')
            fs.chmodSync(originalFile, '755');
            writeTo(patched, originalFile)
        } catch (err) {
            if (err.code == 'EPERM') {
                settings.loger('\n\n              -- E R R O R --\n');
                settings.loger('you need to run application with admin priviledges once');
                settings.loger('to install Adobe After Effects commandLineRenderer.jsx patch\n');

                if (process.platform == 'win32') {
                    settings.loger('reading/writing inside Program Files folder on windows is blocked')
                    settings.loger('please run nexrender with Administrator Privilidges only ONE TIME, to install the patch\n\n')
                } else {
                    settings.loger('you might need to try to run nexrender with "sudo" only ONE TIME to install the patch\n\n')
                }

                process.exit(2);
            } else {
                throw err
            }
        }
    }
}

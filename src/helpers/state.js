module.exports = (job, settings, fn, fnName) => {
    job.state = `render:${fnName}`;

    if (job.onChange) {
        job.onChange(job, fnName);
    }

    return fn(job, settings);
}

let fs = require('fs');
let conventionalChangelog = require('conventional-changelog');

/**
 * Escape string to be used as bash argument
 * assumes strong quoting (using single qotes)
 * @param  {string} str
 */
const escapeForBash = (str) => {
  return JSON.stringify(str)
    .replace(/^"|"$/g, '') //remove JSON-string double quotes
    .replace(/'/g, '\'"\'"\''); //escape single quotes the ugly bash way
};

/**
 * Writes a log to a file
 * @param  {string} path  filename/path to write to
 * @param  {string} newLog  new Changelog entry to add
 * @param  {number} headerLineCount  Number of lines the header occupies
 */
function appendLogToFileStream(path, newLog, headerLineCount) {
  let wStr = fs.createWriteStream(path)

  fs.readFile(path, (err, data) => {
    if (err) {
      wStr.emit('error', err);
      return;
    }
    /** existing changelog */
    let oldChangelog = data.toString().split('\n');
    /** lines used by the default header */
    let logHeader = oldChangelog.slice(0, headerLineCount);
    /** previous changelog entries */
    let prevLogs = oldChangelog.slice(headerLineCount);

    var s = new Readable;
    s.pipe(wStr);
    s.push(logHeader.join('\n') + '\n');    // the string you want
    s.push(newLog);
    s.push(prevLogs.join('\n'));
    // s.push('c aaa bbbb cccc')    // the string you want
    s.push(null);      // indicates end-of-file basically - the end of the stream)
  });

  return wStr;
};


/**
 * @param  {IGrunt} grunt - Grunt instance
 */
module.exports = function (grunt) {
  let PassThroughStream = require('stream').PassThrough;

  grunt.registerTask('changelog-custom', 'Custom version of changelog', function () {
    const done = this.async();
    const options = this.options();
    let readDataStream = new PassThroughStream();
    let tmpBuffer = "";

    // extract data
    readDataStream
      .on('data', (chunk) => tmpBuffer += chunk)
      .on('end', () => {
        const lines = tmpBuffer.split('\n');
        lines.shift(); //remove the html-ancor tag in the first line
        grunt.config.data.changelog = escapeForBash(lines.join('\n'));

        appendLogToFileStream(options.file, lines.join('\n'), 5)
          .on('error', grunt.log.error)
          .on('close', () => {
            grunt.log.ok(`${options.file} updated with latest changelog for ${options.version}`);
            done();
          });
      });

    // get changelog
    conventionalChangelog({
      config: {
        warn: grunt.warn,
        pkg: grunt.package
      }
    }, {
        version: options.version
      }).pipe(readDataStream); // or any writable stream
  });
};

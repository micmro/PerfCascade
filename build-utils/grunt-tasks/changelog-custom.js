const fs = require('fs');
const path = require('path');
const conventionalChangelog = require('conventional-changelog');
const PassThroughStream = require('stream').PassThrough;
const Readable = require('stream').Readable;

/**
 * @param  {IGrunt} grunt - Grunt instance
 */
module.exports = function (grunt) {

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
   * @param  {string} fileName  filename/path to write to
   * @param  {string} newLog  new Changelog entry to add
   * @param  {number} headerLineCount  Number of lines the header occupies
   */
  function appendLogToFileStream(fileName, newLog, headerLineCount) {
    const filePath = path.join(__dirname, '../../', fileName)
    const oldChangelog = grunt.file.read(filePath)
      .toString()
      .split('\n');

    let wStr = fs.createWriteStream(filePath)
    /** lines used by the default header */
    let logHeader = oldChangelog.slice(0, headerLineCount);
    /** previous changelog entries */
    let prevLogs = oldChangelog.slice(headerLineCount);
    var s = new Readable;
    s.pipe(wStr);
    s.push(logHeader.join('\n') + '\n');
    s.push(newLog);
    s.push(prevLogs.join('\n'));
    s.push(null); // indicates end-of-file basically - the end of the stream)
    return wStr;
  };

  grunt.registerTask('changelog-custom', 'Custom version of changelog', function () {
    /** grunt async callback */
    const done = this.async();
    /** grunt task options */
    const options = this.options();
    const readDataStream = new PassThroughStream();
    /** buffer chunks of the new log enty */
    let tmpBuffer = "";

    // called once new log entry has been created
    let onLogRead = () => {
      const lines = tmpBuffer.split('\n');
      lines.shift(); //remove the html-ancor tag in the first line
      grunt.config.data.changelog = escapeForBash(lines.join('\n'));

      appendLogToFileStream(options.file, tmpBuffer, options.headerLines)
        .on('close', () => {
          grunt.log.ok(`${options.file} updated with latest changelog for ${options.version}`);
          done();
        });
    }

    // extract data
    readDataStream
      .on('data', (chunk) => tmpBuffer += chunk)
      .on('error', grunt.log.error)
      .on('end', onLogRead);

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

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
        let lines = tmpBuffer.split("\n");
        lines.shift(); //remove the html-ancor tag in the first line
        grunt.config.data.changelog = escapeForBash(lines.join('\n'));
        readDataStream.end();
      });

    // changlog file writer
    let appenFileStream = fs.createWriteStream(options.file, { 'flags': 'a' })
      .on('error', grunt.log.error)
      .on('close', () => {
        grunt.log.ok(`${options.file} updated with latest changelog for ${options.version}`);
        done();
      });

    // get changelog
    conventionalChangelog({
      config: {
        warn: grunt.warn,
        pkg: grunt.package
      }
    }, {
        version: options.version
      }).pipe(readDataStream).pipe(appenFileStream); // or any writable stream
  });
};

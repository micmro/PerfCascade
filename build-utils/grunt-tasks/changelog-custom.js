let fs = require('fs')
let conventionalChangelog = require('conventional-changelog');

/**
 * @param  {IGrunt} grunt - Grunt instance
 */
module.exports = function(grunt){
  let PassThroughStream = require('stream').PassThrough;

  grunt.registerTask('changelog-custom', 'Custom version of changelog', function() {
    const done = this.async();
    const options = this.options()
    let readDataStream = new PassThroughStream();
    let tmpBuffer = "";

    // extract data
    readDataStream
      .on('data', (chunk) => tmpBuffer += chunk)
      .on('end', () => {
        grunt.config.data.changelog = tmpBuffer
        readDataStream.end()
      })

    // changlog file writer
    let appenFileStream = fs.createWriteStream(options.file, {'flags': 'a'})
      .on('error', grunt.log.error)
      .on('close', () => {
        grunt.log.ok(`${options.file} updated with latest changelog for ${options.version}`)
        done();
      })

    // get changelog
    conventionalChangelog({
      config: {
        warn : grunt.warn,
        pkg: grunt.package
      }
    }, {
      version: options.version
    }).pipe(readDataStream).pipe(appenFileStream) // or any writable stream
  });

}
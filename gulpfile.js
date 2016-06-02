'use strict'

const gulp = require('gulp')
const Stylus = require('gulp-stylus')
const Sourcemaps = require('gulp-sourcemaps')
const Join = require('path').join

/**
 * ## readConfigFile
 * require given file or the default-config-file and read in the stylus-conf
 * @param  {[string]} file path to the config-file to use
 * @return {[Object]}      stylus config-object
 */
let readConfigFile = function (file) {
  let module
  try {
    module = require(file)
  } catch (e) {
    module = require(Join(__dirname, 'default.conf.json'))
  }
  return module.stylus
}

/**
 * ## buildPathes
 * @param  {[Array]} pathes Elements are file-glob-arrays
 * @return {[Array]}        paths/file-globs as strings with prefixed cwd
 */
let buildPathes = function (pathes) {
  pathes = pathes.map(path => {
    return Join(process.cwd(), ...path)
  })
  return pathes
}

/**
 * ## setStylusLibs
 * @param {[Object]} cfg     new config-object
 * @return {[Object]}        config-object with proper Lib-setup on stylus
 *                           use-option
*/
let setStylusLibs = function (cfg) {
  let conf = cfg
  conf.conf.use = cfg.conf.use.map(lib => {
    return require(lib)()
  })
  return conf
}

/**
 * ## setupStylusConf
 * use cfg-object to setup a proper stylus-config
 * @param  {[Object]} cfg
 *   An Object with following keys:
 *   	 - main: array of glob-arrays, use by gulp.src
 *   	 - includes: array of glob-arrays, additional used for stylus-import
 *     - dest: array with an path-array-element for gulp.dest
 *     - conf: the config passed to stylus
 * @return {[Object]}     object with proper stylus-config
 */
let setupStylusConf = function (cfg, devMode) {
  devMode = devMode || true
  let conf = setStylusLibs(cfg)
  conf.conf.compress = devMode ? false : true
  let components = buildPathes(conf.includes)
  let modules = conf.conf.import

  conf.conf.import = [...modules, ...components]
  return {
    stylusConf: conf.conf,
    src: buildPathes(conf.main),
    dest: buildPathes(conf.dest)[0]
  }
}

/**
 * ## build
 * use cfg-object to setup a proper gulp-pipeline and return it on
 * gulp.dest-pipe
 * @param  {[Object]} cfg     Object with a stylus-key, used for setupStylusConf()
 * @param  {[Bool]} devMode   false when build is for production
 * @return {gulp-pipeline}  returns the .pipe(gulp.dest())-call of the pipeline
 */
let build = function (cfg, devMode) {
  devMode = devMode || true

  let conf = setupStylusConf(cfg)
  let runner = gulp.src(conf.src)
  runner = devMode ? runner.pipe(Sourcemaps.init()) : runner
  runner = runner.pipe(Stylus(conf.stylusConf))
  runner = devMode ? runner.pipe(Sourcemaps.write('.')) : runner

  return runner.pipe(gulp.dest(conf.dest))
}

let cfg = readConfigFile(Join(process.cwd(), 'config', 'build.conf.json'))
gulp.task('stylus', function () {
  build(cfg)
})

module.exports = gulp.tasks

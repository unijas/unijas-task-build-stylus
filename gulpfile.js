'use strict'

const gulp = require('gulp')
const Stylus = require('gulp-stylus')
const Sourcemaps = require('gulp-sourcemaps')
const Join = require('path').join
const Minify = require('gulp-clean-css')
const Helper = require('unijas-task-helper')

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
  if (typeof devMode === 'undefined') {
    devMode = true
  }
  console.log(devMode)
  let conf = setStylusLibs(cfg)
  conf.conf.compress = devMode ? false : true
  let components = Helper.buildPathes(conf.includes)
  let modules = conf.conf.import

  conf.conf.import = [...modules, ...components]
  return {
    stylusConf: conf.conf,
    src: Helper.buildPathes(conf.main),
    dest: Helper.buildPathes(conf.dest)[0]
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
  if (typeof devMode === 'undefined') {
    devMode = true
  }
  let conf = setupStylusConf(cfg)
  let runner = gulp.src(conf.src)
  runner = devMode ? runner.pipe(Sourcemaps.init()) : runner
  runner = runner.pipe(Stylus(conf.stylusConf))
  runner = devMode ? runner : runner.pipe(Minify())
  runner = devMode ? runner.pipe(Sourcemaps.write('.')) : runner

  return runner.pipe(gulp.dest(conf.dest))
}

let configFile = Join(process.cwd(), 'config', 'build.conf.json')
let cfg = Helper.readConfigFile(__dirname, configFile).stylus

gulp.task('stylus', function () {
  let devMode = process.env.NODE_ENV === 'production' ? false : true
  build(cfg, devMode)
})

module.exports = gulp.tasks

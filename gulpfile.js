'use strict'

const gulp = require('gulp')
const Stylus = require('gulp-stylus')
const Sourcemaps = require('gulp-sourcemaps')
const Join = require('path').join

let readConfigFile = function (file) {
  let module
  try {
    module = require(file)
  } catch (e) {
    module = require(Join(__dirname, 'default.conf.json'))
  }
  return module.stylus
}

let buildPathes = function (pathes) {
  pathes = pathes.map(path => {
    return Join(process.cwd(), ...path)
  })
  return pathes
}

let setLibs = function (cfg) {
  let conf = cfg
  console.log(conf)
  conf.conf.use = cfg.conf.use.map(lib => {
    return require(lib)()
  })
  return conf
}

let setup = function (cfg) {
  let conf = setLibs(cfg)
  let components = buildPathes(conf.includes)
  let modules = conf.conf.import

  conf.conf.import = [...modules, ...components]
  return {
    stylusConf: conf.conf,
    src: buildPathes(conf.main),
    dest: buildPathes(conf.dest)[0]
  }
}

let build = function (cfg, dev) {
  dev = dev || true

  let conf = setup(cfg)
  let runner = gulp.src(conf.src)

  if (dev) {
    runner = runner.pipe(Sourcemaps.init())
    conf.stylusConf.compress = false
  }

  runner = runner.pipe(Stylus(conf.stylusConf))
  runner = dev ? runner.pipe(Sourcemaps.write('.')) : runner

  return runner.pipe(gulp.dest(conf.dest))
}

let cfg = readConfigFile(Join(process.cwd(), 'config', 'build.conf.json'))

gulp.task('stylus', function () {
  build(cfg)
})

module.exports = gulp.tasks

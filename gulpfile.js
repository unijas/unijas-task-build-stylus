'use strict'

const gulp = require('gulp')
const Stylus = require('gulp-stylus')
const Sourcemaps = require('gulp-sourcemaps')
const Join = require('path').join
const Nib = require('nib')
const Jeet = require('jeet')
const Rupture = require('rupture')

let stylusSheets = Join(process.cwd(), 'src', 'stylesheets', '**/*.styl')
let components = Join(process.cwd(), 'src', 'components', '**/*.styl')
let destination = Join(process.cwd(), 'dist', 'public', 'css')

gulp.task('stylus', function () {
  gulp.src([stylusSheets])
    .pipe(Sourcemaps.init())
    .pipe(Stylus({
      use: [Nib(), Rupture(), Jeet()],
      import: ['nib', 'jeet', components]
    }))
    .pipe(Sourcemaps.write('.'))
    .pipe(gulp.dest(destination))
})

module.exports = gulp.tasks

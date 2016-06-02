# unijas-task-build-stylus
Exports gulptask to build the stylus-files.

## Usage
It exports the gulp.tasks-object, because its meant to be used with the [require-gulp-tasks](https://github.com/chaosprinz/require-gulp-tasks)-module to
load in the task to your gulp-file.

## Configuration
It exports one task, called 'stylus'. This tasks makes use of a config-file,
namely 'build.conf.json', looking for it in the 'config'-directory placed in
cwd.
The file looks somethink like this:
```json
{
  "stylus": {
    "main": [
      ["src", "stylesheets", "**/*.styl"]
    ],
    "includes": [
      ["src", "components", "*", "styles", "*.styl"]
    ],
    "dest": [
      ["dist", "public", "css"]
    ],
    "conf": {
      "compress": true,
      "use": ["nib", "rupture", "jeet"],
      "import": ["nib", "jeet"]
    }
  }
}
```
The configuration for the stylus task is placed in the 'stylus'-object, hence
the name. There are four options.

Three of them are path-related. These three, namely main, includes and dest,
use an array of 'file-glob-arrays'.
This means every entry is one part of the path. All file-globs gulp understands
are permitted. These pathes will be joined to the cwd, so
```['src', 'styles', '**/.styl']``` will end up in
'/srv/mysuperapp/src/styles**.styl', if you run it from '/srv/mysuperapp'.

Here are all four options in detail
- main: File-glob-arrays. These Pathes will be feeded directly into
```gulp.src()```, so this are main-entry-points, which will end up in a
css-file.
- includes: Also file-glob-arrays. These will be added to the import-config,
passed to stylus. For libraries, which are not installed as node-modules or
files you want to be concated.
- dest: Also a file-glob-array. This will change eventually in the future, cause
it needs/can have only one element, describing the destination-path.
- conf: The configuration-object passed to stylus. The compress-function is not
neccessary. It will be set dynamically based on environment, more on this in a
moment.
For import you just give strings with names of libraries, installed as
node-modules, pathes to locals go to the includes-array.

By default, the css-output is not minimized and sourcemaps are generated. If
NODE_ENV-enriroment-variable is set to 'production', there wont be any
sourcemaps and the css gets minified by [clean-css](https://github.com/jakubpawlowicz/clean-css).

## License
[MIT-License](http://http://isojas.github.io/mit-license/)

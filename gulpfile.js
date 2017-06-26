require('dotenv').config()

const config         = require('./manifest')
const autoprefixer   = require('gulp-autoprefixer')
const babel          = require('gulp-babel')
const browserify     = require('gulp-browserify')
const browsersync    = require('browser-sync').create()
const gulp           = require('gulp')
const gutil          = require('gulp-util')
const plumber        = require('gulp-plumber')
const sass           = require('gulp-sass')
const sourcemaps     = require('gulp-sourcemaps')
const rename         = require('gulp-rename')

const logger = (msg, color) => {
  gutil.log(gutil.colors[color](msg))
}

const errorLogger = function(err, cb){
  logger(err.messageFormatted, 'red')
  if(typeof this.emit === 'function') this.emit('end')
}

gulp.task('css', () => {
  return gulp.src('./assets/scss/main.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
        .on('end', () => logger('CSS source map init', 'white'))
      .pipe(sass())
        .on('end', () => logger('SCSS compiled', 'white'))
        .on('error', errorLogger)
      .pipe(autoprefixer({ browsers: 'last 2 versions' }))
        .on('end', () => logger('Autoprefixer complete', 'white'))
      .pipe(rename({ exname: '.min.css' }))
    .pipe(sourcemaps.write('../maps'))
      .on('end', () => logger('CSS source map complete', 'white'))
    .pipe(gulp.dest('./dist/css'))
      .on('end', () => logger('CSS task complete', 'green'))
    .pipe(browsersync.stream())
})

gulp.task('js', () => {
  return gulp.src('./assets/js/index.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
        .on('end', () => logger('JS source map init', 'white'))
      .pipe(browserify({
        insertGlobals: true,
      }))
        .on('end', () => 'JS bundled')
      .pipe(babel({
        presets: ['es2015']
      }))
        .on('end', () => 'JS babelified')
    .pipe(sourcemaps.write('../maps'))
      .on('end', () => logger('JS source map complete', 'white'))
    .pipe(gulp.dest('./dist/js'))
      .on('end', () => logger('JS task complete', 'green'))
    .pipe(browsersync.stream())
})

gulp.task('build', ['css', 'js'])

gulp.task('watch', ['build'], () => {
  gulp.watch(['./layouts/*/*.scss', './partials/*/*.scss', './assets/scss/*.scss'], ['css'])
  gulp.watch(['./layouts/*/*.js', './partials/*/*.js', './assets/js/*.js'], ['js'])

  browsersync.init({
    files: ['{partials}/**/*.php', '*.php'],
    proxy: process.env.DEV_URL,
    snippetOptions: {
      whitelist: ['/wp-admin/admin-ajax.php'],
      blacklist: ['wp-admin/**']
    }
  })
})

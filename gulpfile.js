// plugins

const { src, dest, watch, parallel, series } = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');
const svgSprite = require('gulp-svg-sprite');
const sourcemaps = require('gulp-sourcemaps');
const include = require('gulp-include');
const uglifycss = require('gulp-uglifycss');

//styles

function styles() {
  return src('app/scss/style.scss')
    .pipe(sourcemaps.init())
    .pipe(scss({ outputStyle: 'expanded' }))
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 version'] }))
    .pipe(concat('style.css'))
    .pipe(dest('app/css'))
    .pipe(uglifycss())
    .pipe(concat('style.min.css'))
    .pipe(sourcemaps.write())
    .pipe(dest('app/css'))
    .pipe(browserSync.stream());
}

// js
function scripts() {
  return src([
    'node_modules/swiper/swiper-bundle.js',
    'app/js/main.js',
  ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream());
}

// images

function images() {
  return src(['app/images/src/**/*.*', '!app/images/src/**/*.svg'])
    .pipe(newer('app/images.dist'))
    .pipe(webp())
    .pipe(src(['app/images/src/**/*.*', '!app/images/src/**/*.svg']))
    .pipe(newer('app/images'))
    .pipe(imagemin())
    .pipe(dest('app/images'));
}

// sprite

function sprite() {
  return src('app/images/*.svg')
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: '../sprite.svg',
            example: true,
          },
        },
      })
    )
    .pipe(dest('app/images'));
}

// fonts

function fonts() {
  return src('app/fonts/src/*.*')
    .pipe(
      fonter({
        formats: ['woff', 'ttf'],
      })
    )
    .pipe(src('app/fonts/*.ttf'))
    .pipe(ttf2woff2())
    .pipe(dest('app/fonts'));
}

// include

function pages() {
  return src('app/pages/*.html')
    .pipe(
      include({
        includePaths: 'app/components',
      })
    )
    .pipe(dest('app'))
    .pipe(browserSync.stream());
}

// watch

function watching() {
  browserSync.init({
    server: {
      baseDir: 'app/',
    },
  });
  watch(['app/scss/**/*.scss'], styles);
  watch(['app/images/src/**/*.*'], images);
  watch(['app/js/main.js'], scripts);
  watch(['app/components/*.html', 'app/pages/*.html'], pages);
  watch(['app/*.html']).on('change', browserSync.reload);
}

function cleanDist() {
  return src('dist').pipe(clean());
}

function building() {
  return src(
    [
      'app/css/style.min.css',
      '!app/images/**/*.html',
      'app/images/*.*',
      '!app/images/*.svg',
      'app/images/sprite.svg',
      'app/fonts/*.*',
      'app/js/main.min.js',
      'app/**/*.html',
    ],
    { base: 'app' }
  ).pipe(dest('dist'));
}

exports.styles = styles;
exports.images = images;
exports.fonts = fonts;
exports.pages = pages;
exports.sprite = sprite;
exports.scripts = scripts;
exports.watching = watching;
exports.building = building;

exports.build = series(cleanDist, building);
exports.default = parallel(styles, images, scripts, pages, watching);

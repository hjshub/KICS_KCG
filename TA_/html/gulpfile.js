// gulp 모듈 호출
const { series, parallel, src, dest, lastRun, watch } = require('gulp');

// gulp 플러그인 호출
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const runSequence = require('gulp4-run-sequence');
const del = require('del');
const fileinclude = require('gulp-file-include');
const minifyCss = require('gulp-clean-css');
const browserSync = require('browser-sync').create();
const prettyHtml = require('gulp-pretty-html');
const spriteSmith = require('gulp.spritesmith');
const merge = require('merge-stream');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');

const path = {
  // 작업경로
  temp: './src/template/',
  assets: {
    scss: './src/assets/scss/',
    css: './src/assets/css/',
    js: './src/assets/js/',
    images: './src/assets/images/',
    icon: './src/assets/icon/',
    font: './src/assets/font/',
  },
};

const destPath = {
  // 배포경로
  _: './dist/',
  assets: {
    css: './dist/assets/css/',
    js: './dist/assets/js/',
    images: './dist/assets/images/',
    font: './dist/assets/font/',
  },
};

/**
 * ==============================+
 * HTML Config(환경설정)
 * ==============================+
 */
const Template = () => {
  // html 템플릿
  return src([`${path.temp}**/*.html`, `!${path.temp}include/*.html`])
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: '@file',
      })
    )
    .pipe(
      prettyHtml({
        indent_size: 2,
        indent_char: ' ',
        unformatted: [], // 'code', 'pre', 'em', 'strong', 'span', 'i', 'b', 'br'
      })
    )
    .pipe(dest(destPath._))
    .pipe(browserSync.reload({ stream: true }));
};

/**
 * ==============================+
 * webpack(환경설정)
 * ==============================+
 */
const webpackBuild = () => {
  return (
    src(`${path.assets.js}common.js`)
      .pipe(webpackStream(webpackConfig), webpack)
      //.pipe(uglify())
      .pipe(dest(destPath.assets.js))
      .pipe(browserSync.reload({ stream: true }))
  );
};

/**
 * ==============================+
 * IMAGE, WEBFONT Config(환경설정)
 * ==============================+
 */
const Images = () => {
  // 이미지 경량화
  return src(`${path.assets.images}**/*`, { since: lastRun(Images) })
    .pipe(imagemin())
    .pipe(dest(destPath.assets.images))
    .pipe(browserSync.reload({ stream: true }));
};

const Webfont = () => {
  // 웹 폰트 배포 경로로 복사
  return src(`${path.assets.font}**/*`)
    .pipe(dest(destPath.assets.font))
    .pipe(browserSync.reload({ stream: true }));
};

const Watch = () => {
  watch(`${path.assets.js}*.js`, webpackBuild);
  watch(`${path.assets.icon}**/*`, Sprite);
  watch(`${path.assets.images}**/*`, Images);
  watch(`${path.assets.scss}*.scss`, Sass_compile);
  watch(`${path.assets.css}*.css`, Css);
  watch(`${path.temp}**/*.html`, Template);
};

const Clean = () => {
  // 컴파일 시 배포폴더 내 파일 제거
  return del(['dist/**/*', '!dist'], { force: true });
};

const browserSyncInit = () => {
  // browser-sync (reload)
  return browserSync.init({
    port: 5500,
    server: {
      baseDir: destPath._,
    },
  });
};

/**
 * ==============================+
 * CSS Config(환경설정)
 * ==============================+
 */
const Css = () => {
  // css 배포 경로로 복사
  return src(`${path.assets.css}**/*`)
    .pipe(dest(destPath.assets.css))
    .pipe(browserSync.reload({ stream: true }));
};

/**
 * ==============================+
 * SCSS Config(환경설정)
 * ==============================+
 */
const Scss_options = {
  outputStyle: 'expanded',
  indentType: 'tab',
  indentWidth: 1,
  precision: 6,
  sourceComments: true,
};

const Sass_compile = () => {
  return src(`${path.assets.scss}**/*.scss`, { sourcemaps: true })
    .pipe(scss(Scss_options).on('error', scss.logError))
    .pipe(minifyCss())
    .pipe(dest(destPath.assets.css), { sourcemaps: true })
    .pipe(browserSync.reload({ stream: true }));
};

const Sprite = () => {
  const spriteData = src(`${path.assets.icon}**/*.png`).pipe(
    spriteSmith({
      imgName: 'img-sprite.png',
      padding: 5,
      cssName: '_icon.scss',
      cssTemplate: './src/assets/handlebarsInheritance.scss.handlebars',
    })
  );
  const imgStream = spriteData.img.pipe(dest(path.assets.images));
  const cssStream = spriteData.css.pipe(dest(path.assets.scss));

  return merge(imgStream, cssStream);
};

exports.prod = series(Clean, webpackBuild, Sprite, Sass_compile, Css, Images, Webfont, Template);
exports.watch = parallel(Watch, browserSyncInit);

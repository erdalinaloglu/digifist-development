const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const gulpif = require('gulp-if');
//const sass = require('gulp-sass');
const sass = require('gulp-sass')(require('sass'));
const clean = require('gulp-clean');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const notifier = require('node-notifier');
const plumber = require('gulp-plumber');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const babelify = require('babelify');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');

const jsPaths = 'dev/assets/js/';
//const jsLibPaths = 'dev/assets/js/lib/';
const scssPath = 'dev/assets/scss/';
const cssPath = 'dev/assets/css/';
const htmlPath = 'dev/**/*.html';
const mapsPath = 'dev/assets/**/*/*.map';

const paths = {
  scriptsLib: [//common scripts
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/swiper/swiper-bundle.min.js',
  ],
  cssLib: [
    'node_modules/bootstrap/dist/css/bootstrap-grid.css',
    'node_modules/swiper/swiper-bundle.min.css'
  ],
  scripts: [
    `${jsPaths}core.js`,
  ],
  scss: [
    `${scssPath}core.scss`,
  ],
};

const env = process.env.NODE_ENV || 'dev';

const onError = (err) => {
  notifier.notify({
    title: 'There is error, Sir!',
    message: `${err.messageOriginal} \n ${err.relativePath}`,
    sound: true,
    wait: false,
    icon: 'Terminal Icon',
    timeout: 10,
  });
};


gulp.task('clean-map', () => gulp.src(mapsPath, { read: false }).pipe(clean()));


gulp.task('scriptsLib', () => gulp.src(paths.scriptsLib)
  .pipe(plumber({
    errorHandler: onError,
  }))
  .pipe(gulpif(env === 'dev', sourcemaps.init({
    largeFile: true,
  })))
  .pipe(gulpif(env === 'prod', uglify()))
  .pipe(concat('lib.min.js'))
  .pipe(gulpif(env === 'dev', sourcemaps.write('/')))
  .pipe(gulp.dest(jsPaths))
  .pipe(browserSync.stream()));

gulp.task('cssLib', () => gulp.src(paths.cssLib)
  .pipe(plumber({
    errorHandler: onError,
  }))
  .pipe(gulpif(env === 'dev', sourcemaps.init({
    largeFile: true,
  })))
  .pipe(gulpif(env === 'prod', uglify()))
  .pipe(concat('lib.min.css'))
  .pipe(gulpif(env === 'dev', sourcemaps.write('/')))
  .pipe(gulp.dest(cssPath))
  .pipe(browserSync.stream()));

gulp.task('scripts', () => browserify(paths.scripts)
  .transform(babelify, {
    presets: ['@babel/env'],
    sourceType: 'module'
  })
  .bundle()
  .pipe(source('core.min.js'))
  .pipe(buffer())
  .pipe(gulpif(env === 'dev', sourcemaps.init({
    largeFile: true,
  })))
  .pipe(gulpif(env === 'prod', uglify()))
  .pipe(concat('core.min.js'))
  .pipe(gulpif(env === 'dev', sourcemaps.write('/')))
  .pipe(gulp.dest(jsPaths))
  .pipe(browserSync.stream()));

gulp.task('scss', () => gulp.src(paths.scss)
  .pipe(plumber({
    errorHandler: onError,
  }))
  .pipe(gulpif(env === 'dev', sourcemaps.init({
    largeFile: true,
  })))
  .pipe(gulpif(env === 'prod', sass({
    outputStyle: 'compressed',
  }).on('error', sass.logError)))
  .pipe(gulpif(env === 'dev', sass().on('error', sass.logError)))
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false,
  }))
  .pipe(gulpif(env === 'dev', sourcemaps.write('/')))
  .pipe(cleanCSS({ compatibility: 'ie8' }))
  .pipe(gulp.dest(cssPath))
  .pipe(browserSync.stream()));

  // gulp.task('minifyHTML', () => {
  //   return gulp.src('dev/*.html')
  //     .pipe(htmlmin({ collapseWhitespace: true }))
  //     .pipe(gulp.dest('dev/dist'));
  // });
  gulp.task('minifyBotHTML', () => {
    return gulp.src('dev/kampanyalar/*.html')
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest('dev/dist/kampanyalar'));
  });

/*gulp.task('copy-js', () => gulp.src(['!dev/assets/js/app', '!dev/assets/js/app/**', 'dev/assets/js/**'])
  .pipe(gulp.dest('./deploy/imgs')));*/

// gulp.task('copy-data', function() {
//   return gulp.src('./src/data/*.json')
//     .pipe(gulp.dest('./deploy/data'));
// });

// gulp.task('copyResources', ['copy-js']);

gulp.task('serve', gulp.series('scriptsLib', 'cssLib', 'scripts', 'scss', () => {
  browserSync.init({
    server: 'dev',
    notify: false,
    // proxy: {
    //  target: "",
    //  ws: true
    // }
  });
  gulp.watch(paths.scriptsLib, gulp.series('scriptsLib'));
  gulp.watch(paths.cssLib, gulp.series('cssLib'));
  gulp.watch(paths.scripts, gulp.series('scripts'));
  //gulp.watch(`${jsPaths}app/*.js`, gulp.series('scripts'));
  gulp.watch(`${scssPath}**/*.scss`, gulp.series('scss'));
  gulp.watch(htmlPath).on('change', browserSync.reload);
}));

gulp.task('default', gulp.series('serve'));
gulp.task('prod', gulp.series('scriptsLib', 'cssLib', 'scripts', 'scss', /*'minifyHTML',*/ 'minifyBotHTML'));

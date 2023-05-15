/* global require process Buffer */
var gulp = require('gulp');
var gutil = require('gulp-util');
var pkg = require('./package.json');
var zip = require('gulp-zip');
var del = require('del');
var webpackConfig = require('./webpack.config');
var webpack = require('webpack');

var DIST = "./dist",
  NAME = "qlik-variable-input",
  VERSION = process.env.VERSION || "local-dev";

gulp.task('qext', function () {
  var qext = {
    name: 'Variable input',
    type: 'visualization',
    description: pkg.description + '\nVersion: ' + VERSION,
    version: VERSION,
    icon: 'control',
    preview: 'preview.png',
    keywords: 'qlik-sense, visualization',
    author: pkg.author,
    homepage: pkg.homepage,
    license: pkg.license,
    repository: '',
    dependencies: {
      'qlik-sense': '>=5.5.x'
    }
  };
  if (pkg.contributors) {
    qext.contributors = pkg.contributors;
  }
  var src = require('stream').Readable({
    objectMode: true
  });
  src._read = function () {
    this.push(new gutil.File({
      cwd: '',
      base: '',
      path: NAME + '.qext',
      contents: Buffer.from(JSON.stringify(qext, null, 4))
    }));
    this.push(null);
  };
  return src.pipe(gulp.dest(DIST));
});

gulp.task('clean', function () {
  return del([DIST], { force: true });
});

gulp.task('zip-build', function () {
  return gulp.src(DIST + '/**/*')
    .pipe(zip(`${NAME}_${VERSION}.zip`))
    .pipe(gulp.dest(DIST));
});

gulp.task('add-assets', function () {
  return gulp.src('./assets/**/*').pipe(gulp.dest(DIST));
});

gulp.task('webpack-build', done => {
  webpack(webpackConfig, (error, statistics) => {
    const compilationErrors = statistics && statistics.compilation.errors;
    const hasCompilationErrors = !statistics || (compilationErrors && compilationErrors.length > 0);

    console.log(statistics && statistics.toString({ chunks: false, colors: true })); // eslint-disable-line no-console

    if (error || hasCompilationErrors) {
      console.log('Build has errors or eslint errors, fail it'); // eslint-disable-line no-console
      process.exit(1);
    }

    done();
  });
});

gulp.task('build',
  gulp.series('clean', 'webpack-build', 'qext', 'add-assets')
);

gulp.task('zip',
  gulp.series('build', 'zip-build')
);

gulp.task('default',
  gulp.series('build')
);

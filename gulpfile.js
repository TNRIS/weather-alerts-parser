'use strict';

var gulp = require('gulp');
var rimraf = require('gulp-rimraf');
var runSequence = require('run-sequence');
var sass = require('gulp-ruby-sass');

var dirs = {
  client: 'client',
  dist: '.dist',
  sassCache: '.sassCache',
  server: 'server'
};

dirs.scss = dirs.client + '/scss';

var paths = {
  client: dirs.client + '/**/*',
  server: dirs.server + '/**/*',
  scss: dirs.scss + '/**/*.scss'
};

gulp.task('default', ['dist']);

gulp.task('dev', ['dist', 'watch']);

gulp.task('watch', function () {
  gulp.watch(paths.client, ['dist-client']);
  gulp.watch(paths.server, ['dist-server']);

  console.log('Watches are active for continuously disting dev files.');
  console.log('  To start dev server: `npm run start` in a separate shell');
  console.log('  In debug mode: `npm run debug` and `node-inspector` in two separate shells');
});

gulp.task('dist', ['dist-server', 'dist-client', 'dist-packaging']);
gulp.task('dist-client', ['dist-scss']);

gulp.task('dist-scss', function () {
  return gulp.src(paths.scss)
    .pipe(sass())
    .pipe(gulp.dest(dirs.dist + '/' + dirs.client + '/css'));
});

gulp.task('dist-packaging', function () {
  return gulp.src('package.json')
    .pipe(gulp.dest(dirs.dist));
});

gulp.task('dist-server', function () {
  return gulp.src(paths.server)
    .pipe(gulp.dest(dirs.dist + '/' + dirs.server));
});


gulp.task('clean', ['clean-dist', 'clean-sass-cache']);

gulp.task('clean-dist', function() {
  return gulp.src(dirs.dist)
    .pipe(rimraf());
});

gulp.task('clean-sass-cache', function() {
  return gulp.src(dirs.sassCache)
    .pipe(rimraf());
});


gulp.task('fresh-dist', function (callback) {
  runSequence(
    'clean',
    'dist',
    callback);
});

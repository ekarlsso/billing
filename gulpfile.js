var browserify = require('browserify'),
    gulp       = require('gulp'),
    gutil      = require('gulp-util'),
    jshint     = require('gulp-jshint'),
    source     = require("vinyl-source-stream"),
    watchify   = require('watchify'),
    connect    = require('gulp-connect');

var livereloadport = 35729,
    serverport     = 5000;

var production = process.env.NODE_ENV === 'production';

gulp.task('webserver', function() {
  connect.server({
    livereload: true,
    root: 'dist'
  });
});

gulp.task('lint', function() {
  gulp.src('./app/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('scripts', function() {
  return browserifyScript(false);
});

gulp.task('watchScripts', function() {
  return browserifyScript(true);
});

var browserifyScript = function(watch) {
  var bundler = browserify({
    cache: {},
    packageCachce: {},
    fullPaths: watch,
    debug: !production
  });

  bundler.add('./app/js/main.js');

  if (watch) {
    bundler = watchify(bundler);
  }

  var rebundle = function() {
    var stream = bundler.bundle();
    stream.on('error', gutil.log);
    return stream
      .pipe(source('main.js'))
      .pipe(gulp.dest('./dist/js'));
  };

  bundler.on('update', rebundle);

  return rebundle();
};

gulp.task('views', function() {
  gulp.src('app/index.html')
    .pipe(gulp.dest('dist/'))
    .pipe(connect.reload());
  gulp.src('./app/views/**/*')
    .pipe(gulp.dest('dist/views/'))
    .pipe(connect.reload());
});

gulp.task('watch', function() {
    gulp.watch(['app/js/*.js', 'app/js/**/*.js'], ['lint', 'watchScripts']);
    gulp.watch(['app/index.html', 'app/views/**/*.html'], ['views']);
});

gulp.task('default', ['webserver', 'watch']);

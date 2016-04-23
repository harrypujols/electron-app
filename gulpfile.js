var gulp = require('gulp');
var exec = require('gulp-exec');

gulp.task('exec', function() {
  var options = {
    continueOnError: false,
    pipeStdout: false
  };
  var reportOptions = {
  	err: true,
  	stderr: true,
  	stdout: true
  }
  gulp.src('./**/**')
    .pipe(exec('electron-packager ./src --platform=darwin --arch=x64', options))
    .pipe(exec.reporter(reportOptions));
});

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var del = require('del');

gulp.task('clean-scripts', function(){
  return del(['dist/js/']);
});

gulp.task('clean-styles', function(){
  return del(['dist/css']);
});


gulp.task('scripts', ['clean-scripts'], function(){
  return gulp.src(['lib/angular/angular.js', 'js/*', 'lib/timbre.js/timbre.dev.js'])
    .pipe(uglify())
    .pipe(concat('all.min.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('styles', ['clean-styles'], function(){
  return gulp.src(['lib/skeleton/css/normalize.css', 
    'lib/skeleton/css/skeleton.css', 'css/style.css', 'css/font-face.css', 'lib/components-font-awesome/css/font-awesome.css', 
    'css/fonts/font-face.css'])
    .pipe(minifyCss())
    .pipe(concat('all.min.css'))
    .pipe(gulp.dest('dist/css'));
})
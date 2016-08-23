// gulpfile.js
var gulp = require('gulp');
var sass = require('gulp-sass');
//如果需要可以生成sourcemap
var sourcemaps = require('gulp-sourcemaps');
//css压缩
var minifycss = require('gulp-minify-css');    
//重命名
var rename = require('gulp-rename');
//gulp监视器
var watch = require('gulp-watch');
//js检测
var jshint = require('gulp-jshint'); 
//util
var gutil = require('gulp-util');
//浏览器同步
var browserSync = require('browser-sync').create();
//简化reload
var reload = browserSync.reload;
// es6->es5
var babel = require("gulp-babel");
var fileinclude = require('gulp-file-include');
var rev = require('gulp-rev-append');

gulp.task('default',['script']);
gulp.task('script', function() {
    return gulp.src("src/main.js")
    	.pipe(gulp.dest("dest"))
		.pipe(rename({ suffix: 'es5.min' }))
		.pipe(babel({
			presets: ['es2015']
		}))
		.on('error', function(err) {
            gutil.log('js Error!', err.message)
            this.emit('end')
        })
        .pipe(jshint({"esnext" : true}))//{"esnext" : true}))
        .pipe(jshint.reporter('default'))
        .pipe(gulp.dest("dest/js"))
});
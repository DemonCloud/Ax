var gulp = require("gulp");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");

var path_js = "./src/*.js";
var path_dis = "./dest/";
var path_disjs = "./dest/*.js";

gulp.task('concat',function(){
	return gulp.src(['./src/_.js','./src/n.js','./src/aix.js'])
				 .pipe(concat('aix.c.js'))
				 .pipe(gulp.dest(path_dis));
});

gulp.task('uglify',function(){
	return gulp.src(path_disjs)
				 .pipe(uglify())
				 .pipe(gulp.dest(path_dis));
});

gulp.task('watch',function(){
	gulp.watch(path_js,['default']);
});

gulp.task('make',['concat'],function(){
	gulp.start('uglify');
});

gulp.task('default',['concat'],function(){
	gulp.start('uglify');
});


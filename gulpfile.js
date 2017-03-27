const gulp = require("gulp");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const optimizejs = require('gulp-optimize-js');

const path_js = "./src/*.js";
const path_dis = "./dest/";
const path_doc = "./docs/js/";
const path_disjs = "./dest/*.js";


gulp.task('concat',function(){
	return gulp.src(['./src/struct.js','./src/aix.js'])
				 .pipe(concat('aix.c.js'))
				 .pipe(gulp.dest(path_dis));
});

gulp.task('uglify',function(){
	return gulp.src(path_disjs)
				 .pipe(uglify())
				 .pipe(optimizejs())
				 .pipe(gulp.dest(path_dis))
				 .pipe(gulp.dest(path_doc));
});

gulp.task('watch',function(){
	gulp.watch(path_js,['default']);
});

gulp.task('default',['concat'],function(){
	gulp.start('uglify');
});



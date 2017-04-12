const gulp = require("gulp");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const optimizejs = require('gulp-optimize-js');

const path_js = "./src/*.js";
const path_dis = "./dest/";
const path_disjs = "./dest/*.js";
const path_doc = "./docs/app/scripts/libs/";


gulp.task('concat',()=>{
	return gulp.src(['./src/struct.js','./src/aix.js'])
				 .pipe(concat('aix.c.js'))
				 .pipe(gulp.dest(path_doc));
});

gulp.task('minix',()=>{
	return gulp.src(path_doc+"aix.c.js")
				 .pipe(uglify())
				 .pipe(optimizejs())
				 .pipe(gulp.dest(path_doc));
});

gulp.task('make',()=>{
	return gulp.src(['./src/aix.js'])
				 .pipe(concat('aix.min.js'))
				 .pipe(uglify())
				 .pipe(optimizejs())
				 .pipe(gulp.dest(path_dis))
				 .pipe(gulp.dest(path_doc))
				 .pipe(gulp.dest("./"));
});

gulp.task('watch',()=>{
	return gulp.watch(path_js,['default']);
});

gulp.task('default',['concat'],()=>{ 
	return gulp.start(['minix','make']);
});



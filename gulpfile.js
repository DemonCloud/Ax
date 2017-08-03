'use strict'
/* this is v3 building gulp task */
/* just use to create a dist*/
/* do not run it again */
/* because it useful package v3 documents */

const gulp = require('gulp');
const eslint = require("gulp-eslint");
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const filter = require("gulp-filter");
const uglify = require('gulp-uglify');
const optimizejs = require('gulp-optimize-js');
// const ro = require("gulp-requirejs-optimize");

// back the js
function taskjs(){
	gulp.src("./src/ax.js")
				.pipe(filter(["**"], { restore:true }))
				.pipe(rename('ax.min.js'))
				.pipe(uglify())
				.pipe(optimizejs())
				.pipe(gulp.dest('./dist'));

	return gulp.src("./src/struct.js")
				.pipe(filter(["**"], { restore:true }))
				.pipe(rename('struct.min.js'))
				.pipe(uglify())
				.pipe(optimizejs())
				.pipe(gulp.dest('./dist'));
}
// const tasktest = require('./gulp/task.test');
// const taskhtml = require('./gulp/task.html');
// const taskcss = require('./gulp/task.css');
// const taskjs = require('./gulp/task.js');
// const taskr = require('./gulp/task.r');

// gulp.task('build:test',tasktest);
// gulp.task('build:html',taskhtml);
// gulp.task('build:css',taskcss);
gulp.task('build:js',taskjs);
// gulp.task('package:r',taskr);

// // run task
// gulp.task('default',['build:html','build:css','build:js'],
// function(){ gulp.start(['package:r']); });

// // build test task
// gulp.task('test',['build:test'],
// function(){ console.log("Completed test success!"); });
gulp.task('default',['build:js']);

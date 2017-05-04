'use strict'

// config
const cfg = global.cfg = require('./gulp/config.js');

const gulp = require('gulp');
// const sequence = require('gulp-sequence');

const taskcss = require('./gulp/task.css');
const taskjs = require('./gulp/task.js');
const taskr = require('./gulp/task.r');

gulp.task('build:css',taskcss);
gulp.task('build:js',taskjs);
gulp.task('package:r',taskr);

// task
gulp.task('default',['build:css','build:js'],function(){
	gulp.start(['package:r']);
});


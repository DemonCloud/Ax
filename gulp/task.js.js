'use strict';

const cfg = global.cfg;

const gulp = require("gulp");
const eslint = require("gulp-eslint")
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const filter = require("gulp-filter");
const uglify = require('gulp-uglify');
const optimizejs = require('gulp-optimize-js');
// const ro = require("gulp-requirejs-optimize");

// Node moudle
const rjs = require('requirejs');
const colors = require('colors');

// back the js
function taskjs(){
	gulp.src(cfg.path.base+"src/ax.js")
				.pipe(filter(["**"], { restore:true }))
				.pipe(eslint(cfg.eslintConfig))
				.pipe(eslint.result(cfg.result))
				.pipe(rename('ax.min.js'))
				.pipe(uglify())
				.pipe(optimizejs())
				.pipe(gulp.dest(cfg.path.jsl));

	return gulp.src(cfg.path.base+"src/struct.js")
				.pipe(filter(["**"], { restore:true }))
				.pipe(eslint(cfg.eslintConfig))
				.pipe(eslint.result(cfg.result))
				.pipe(rename('struct.min.js'))
				.pipe(uglify())
				.pipe(optimizejs())
				.pipe(gulp.dest(cfg.path.jsl));
}

module.exports = taskjs;

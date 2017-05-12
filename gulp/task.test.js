'use strict';

const cfg = global.cfg;

const gulp = require("gulp");
const filter = require("gulp-filter");
const eslint = require("gulp-eslint");
const uglify = require('gulp-uglify');
// const ro = require("gulp-requirejs-optimize");

// Node moudle
const colors = require('colors');

// back the js
function taskjs(){
	gulp.src(cfg.path.base+"src/ax.js")
				.pipe(filter(["**"], { restore:true }))
				.pipe(eslint(cfg.eslintConfig))
				.pipe(eslint.result(cfg.result))
				.pipe(uglify());

	return gulp.src(cfg.path.base+"src/struct.js")
				.pipe(filter(["**"], { restore:true }))
				.pipe(eslint(cfg.eslintConfig))
				.pipe(eslint.result(cfg.result))
				.pipe(uglify());
}

module.exports = taskjs;

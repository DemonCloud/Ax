'use strict';

const cfg = global.cfg;

const gulp = require("gulp");
const concat = require("gulp-concat");
const ccss = require("gulp-clean-css");
// const rebase = require("gulp-css-url-rebase");
const autoprefix = require("gulp-autoprefixer");

function taskcss(){
	return gulp.src(cfg.path.css+"*.css")
		.pipe(autoprefix())
		.pipe(concat("pub.min.css"))
		.pipe(ccss({level:2}))
		.pipe(gulp.dest(cfg.path.dest));
}

module.exports = taskcss;

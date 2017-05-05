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

function taskReuqireJS(){
	gulp.src([
		cfg.path.jsl+"struct.min.js",
		cfg.path.jsl+"ax.min.js"
	])
	.pipe(filter(["**"], { restore:true }))
	.pipe(concat("axs.min.js"))
	.pipe(gulp.dest(cfg.path.pub))
	.pipe(gulp.dest(cfg.path.dest));

	return rjs.optimize(cfg.rjs,function(){ 
		return gulp.src([
					cfg.path.dest+'app.js',
					cfg.path.tmp+'route.js'
				])
				.pipe(filter(["**"], { restore:true }))
				.pipe(concat('pub.min.js'))
				.pipe(uglify())
				.pipe(optimizejs())
				.pipe(gulp.dest(cfg.path.dest));
	});
	
	// return gulp.src(
	// 						cfg.path.js+"**/*.js",
	// 						{cwd:cfg.path.base, base:cfg.path.base}
	// 					).pipe(filter(cfg.filter.r, { restore: true }))
	// 					 .pipe(ro(function(file){
	// 							return {
	// 								name : file.path,
	// 								baseUrl : cfg.path.js,
	// 								paths : cfg.rjs.paths,
	// 								optimize : 'none'
	// 							};
	// 					 }))
	// 					 .pipe(concat('pub.min.js'))
	// 					 .pipe(uglify())
	// 					 .pipe(optimizejs())
	// 					 .pipe(gulp.dest(cfg.path.dest));
}

module.exports = taskReuqireJS;

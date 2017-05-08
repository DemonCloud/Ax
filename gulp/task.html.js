'use strict';

const cfg = global.cfg;

const fs = require("fs");
const gulp = require("gulp");
const filter = require("gulp-filter");
const replace = require("gulp-replace");
const htmlmin = require("gulp-htmlmin");
const rename = require("gulp-rename");

const head = fs.readFileSync(cfg.path.html+"head.html");
const body = fs.readFileSync(cfg.path.html+"body.html");
const script = fs.readFileSync(cfg.path.html+"script.html");

function mintpl(){
	return gulp.src(cfg.path.html+"bone.html")
						 .pipe(filter(["**"],{ restore: true }))
						 .pipe(replace("{{*header}}",head))
						 .pipe(replace("{{*body}}",body))
						 .pipe(replace("{{*script}}",script))
						 .pipe(replace(/<!--[\s\S]*?-->/gim,''))
						 .pipe(htmlmin({
						 	 collapseWhitespace:true,
						 }))
						 .pipe(rename("index.html"))
						 .pipe(gulp.dest(cfg.path.dest));
}

module.exports = mintpl;

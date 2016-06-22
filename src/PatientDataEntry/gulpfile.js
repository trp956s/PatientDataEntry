/// <binding BeforeBuild='clean:js, clean:css, clean, min:css, min, min:js, copy:lib_and_app, clean:lib' Clean='clean, clean:css, clean:js, clean:dependencies, clean:lib' />
"use strict";

var gulp = require("gulp"),
    del = require("del"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    webroot = "./wwwroot/";

var itemsToCopy = {
    './bower_components/angular/*.js': webroot + 'lib/angular',
    './bower_components/angular-ngMask/dist/*.js': webroot + 'lib/angular-ngMask/dist',
    './bower_components/jquery/dist/*.js': webroot + 'lib/jquery/dist',
    './node_modules/ng-mask-npm/dist/*.js': webroot + 'lib/ng-mask-npm/dist',
    './app/**/*': webroot + 'app',
};

var paths = {
    js: webroot + "js/**/*.js",
    minJs: webroot + "js/**/*.min.js",
    css: webroot + "css/**/*.css",
    minCss: webroot + "css/**/*.min.css",
    concatJsDest: webroot + "js/site.min.js",
    concatCssDest: webroot + "css/site.min.css",
    concatLibDest: webroot + "lib/*",
    concatAppDest: webroot + "app/*",
    concatBowerDest: "bower_components",
    concatNpmDest: "node_modules"
};

gulp.task("clean:js", function (cb) {
    del(paths.concatJsDest, cb);
});

gulp.task("clean:css", function (cb) {
    del(paths.concatCssDest, cb);
});

gulp.task("clean:lib", function (cb) {
    del(paths.concatLibDest, cb);
});

gulp.task("clean:app", function (cb) {
    del(paths.concatAppDest, cb);
});

gulp.task("clean:dependencies", function (cb) {
    del([paths.concatBowerDest, paths.concatNpmDest], cb);
});

gulp.task("clean", ["clean:js", "clean:css", "clean:lib", "clean:app"]);

gulp.task("min:js", function () {
    return gulp.src([paths.js, "!" + paths.minJs], { base: "." })
        .pipe(concat(paths.concatJsDest))
        .pipe(uglify())
        .pipe(gulp.dest("."));
});

gulp.task("min:css", function () {
    return gulp.src([paths.css, "!" + paths.minCss])
        .pipe(concat(paths.concatCssDest))
        .pipe(cssmin())
        .pipe(gulp.dest("."));
});

gulp.task("min", ["min:js", "min:css"]);

gulp.task('copy:lib_and_app', function (callback) {
    for (var src in itemsToCopy) {
        if (!itemsToCopy.hasOwnProperty(src)) continue;
        gulp.src(src)
        .pipe(gulp.dest(itemsToCopy[src]));
    }
});

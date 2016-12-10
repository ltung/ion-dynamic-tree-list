'use strict';

var gulp = require('gulp'),
    release = require('gulp-release-tasks')(gulp),
    $ = require('gulp-load-plugins')(),
    Server = require('karma').Server,
    path = require('path');

gulp.task('test', function (done) {
    new Server({
        configFile: path.join(__dirname, 'tests/karma.conf.js'),
        singleRun: true
    }, done).start()
});

gulp.task('less', function () {
    return gulp.src('./*.less')
        .pipe($.less())
        .pipe($.minifyCss())
        .pipe(gulp.dest('.'));
});

gulp.task('updateNpmDependencies', function(){
    return gulp.src('package.json')
        .pipe($.david({ update: true }))
        .pipe(gulp.dest('.'))
});

gulp.task('copy', function() {
    return gulp.src(['ion-dynamic-tree-list.js', 'ion-dynamic-tree-list.css', 'ion-dynamic-tree-list-tmpl.html'])
        .pipe(gulp.dest('gh-pages/ion-dynamic-tree-list/lib/ion-dynamic-tree-list/'));
});

gulp.task('watch', function(){
    gulp.watch('./*.less', ['less']);
    gulp.watch('**/*.js', ['copy']);
});

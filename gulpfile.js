var gulp = require('gulp'),
    connect = require('gulp-connect');//使用connect启动一个Web服务器

gulp.task('connect', function() {
    connect.server({
        host: '192.168.2.101', //地址，可不写，不写的话，默认localhost
        port: 3000, //端口号，可不写，默认8000
        root: './', //当前项目主目录
        livereload: true //自动刷新
    });
});
gulp.task('html', function() {
    gulp.src('./modules/*/*.html')
        .pipe(connect.reload());
});

gulp.task('watch', function() {
    gulp.watch('./modules/*/*.css', ['html']); //监控css文件
    gulp.watch('./modules/*/*.js', ['html']); //监控js文件
    gulp.watch(['./modules/*/*.html'], ['html']); //监控html文件
}); //执行gulp server开启服务器

gulp.task('server', ['connect', 'watch']);
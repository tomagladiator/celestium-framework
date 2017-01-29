const pngquant   = require('imagemin-pngquant');
const imagemin   = require('gulp-imagemin');
var bulkSass     = require('gulp-sass-bulk-import');
var inlinesource = require('gulp-inline-source');
var fileinclude  = require('gulp-file-include');
var autoprefixer = require('gulp-autoprefixer');
var ts           = require('gulp-typescript');
var sourcemaps   = require('gulp-sourcemaps');
var prettify     = require('gulp-prettify');
var favicons     = require("gulp-favicons");
var htmlmin      = require('gulp-htmlmin');
var browserSync  = require('browser-sync');
var cssmin       = require('gulp-cssnano');
var replace      = require('gulp-replace');
var concat       = require('gulp-concat');
var rename       = require("gulp-rename");
var uglify       = require('gulp-uglify');
var tslint       = require('gulp-tslint');
var watch        = require('gulp-watch');
var gutil        = require('gulp-util');
var sass         = require('gulp-sass');
var file         = require('gulp-file');
var gulp         = require('gulp');
var reload       = browserSync.reload;
var jsToMove     = [
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/vue/dist/vue.min.js'
];
var scssToMove   = [
    'node_modules/sanitize.css/dist/sanitize.css'
];


/* TODO */
// [ ] vue.js
// [ ] webpack ?
// [ ] js debug God


/* *************************
    CONFIG
************************* */
var minify_css  = false;
var minify_js   = false;
var minify_html = false;


/* *************************
    FUNCTIONS
************************* */
function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}




/* *************************
    COMMANDS
************************* */
//  gulp doThisJustOnce                        : when you start the project.
//  gulp img                                   : otpimize all images.
//  gulp fonts                                 : move fonts.
//  gulp component --options name-of-component : create a new component.
//  gulp structure --options name-of-structure : create a new structure.
//  gulp layout --options name-of-layout       : create a new layout.
//  gulp page --options name-of-page           : create a new page.
//  gulp favicon                               : convert a square logo to all favicons.




/* *************************
    A - FIRST TIME
************************* */
    gulp.task('doThisJustOnce', [
            'move', 'fonts'
        ] , function() {
    });

    gulp.task('move', function(){
        gulp.src(jsToMove)
        .pipe(gulp.dest('src/5-else/ts/libs/'));

        gulp.src(scssToMove)
        .pipe(rename(function (path) {
            path.extname = ".scss"
        }))
        .pipe(gulp.dest('src/5-else/scss/libs/'));
    });



/* *************************
    B - CURRENT
************************* */
    gulp.task('default', [
            'scss-watch',
            'html',
            'jsHead',
            'jsFoot',
            'img',
            'browser-sync'
        ] , function() {
    });


    /* 1 - SERVER */
    gulp.task('browser-sync', function() {
        browserSync.init(['css/*.css', 'js/*.js', '*.html'], {
            port: 8080,
            reloadDelay: 500,
            server: {
                baseDir: "./dist"
            },
            ui: {
                port: 666
            }
        });
    });


    /* 2 - COMPILE scss */
    gulp.task('scss', function () {
        if(minify_css){
            var css_refactoring = cssmin();
        } else {
            var css_refactoring = gutil.noop();
        }

        return gulp.src('src/**/*.scss')
            .pipe(sourcemaps.init())
            .pipe(bulkSass())
            .pipe(sass().on('error', sass.logError))
            .pipe(autoprefixer({
                browsers: ['last 2 versions']
            }))
            .pipe(css_refactoring)
            .pipe(sourcemaps.write('.'))
            .pipe(rename({dirname: ''}))
            .pipe(gulp.dest('dist/css/'))
            .pipe(browserSync.stream());
    });

    gulp.task('scss-watch', ['scss'], browserSync.reload);

    gulp.task('reload-browser', function () {
        browserSync.reload
    });

    /* 3 - COMPILE html */
    gulp.task('html', function () {
        if(minify_html){
            var html_refactoring = htmlmin({collapseWhitespace: true, removeComments: true});
        } else {
            var html_refactoring = prettify({
                indent_size: 4,
                unformatted: ['pre', 'code'],
                indent_inner_html: true
            });
        }

        return gulp.src(['./src/4-pages/**/*.html', '!src/4-pages/_name-of-page/_name-of-page.html'])
            .pipe(fileinclude().on('error', handleError))
            .pipe(html_refactoring)
            .pipe(inlinesource({
                compress: true,
                rootpath: './dist/'
            }).on('error', handleError))
            .pipe(rename({dirname: ''}))
            .pipe(gulp.dest('./dist/'))
            .pipe(browserSync.stream());
    });


    /* 4 - SCRIPT HEAD */
    gulp.task('jsHead', function () {
        if(minify_js){
            var js_refactoring = uglify();
        } else {
            var js_refactoring = gutil.noop();
        }

        return gulp.src('src/5-else/ts/libs/**/*.js')
            .pipe(sourcemaps.init())
			.pipe(concat('script-head.js'))
            .pipe(js_refactoring)
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('dist/js'));
    });


    /* 5 - COMPILE ts */
    gulp.task('jsFoot', function () {
        return gulp.src(['src/**/*.ts', '!src/**/*.d.ts', '!src/5-else/ts/libs/**/*.js'])
			.pipe(tslint({
				formatter: "verbose"
			}))
			.pipe(tslint.report({
            	emitError: false
        	}))
            .pipe(sourcemaps.init())
            .pipe(ts({
                noImplicitAny: true,
                out: 'script-foot.js'
            }))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('dist/js'));
    });


    /* 6 - COMPRESS img */
    gulp.task('img', () => {
        return gulp.src(['src/**/*.jpg', 'src/**/*.png', 'src/**/*.gif', 'src/**/*.jpeg'])
            .pipe(imagemin({
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                use: [pngquant()]
            }))
            .pipe(gulp.dest('dist/img'))
            .pipe(browserSync.stream());
    });


    /* 7 - WATCH */
    watch('./src/**/*.html', function() {
        gulp.start('html');
    });

    watch('./src/5-else/scss/inline.scss', function() {
        gulp.start(['scss-watch']);
    });

    watch('./src/**/*.ts', function() {
        gulp.start('jsFoot');
    });

    watch(['./src/**/*.scss'], function() {
        gulp.start(['scss-watch', 'html']);
    });

    watch('./dist/css/*.css', function() {
        gulp.start('reload-browser');
    });

    watch('./dist/js/script-foot.js').on("change", reload);





/* *************************
    C - CREATE COMPONENT
************************* */
// gulp component --options name-of-component

    var componentFirstLetter = '';
    var componentName = '';
    var shortname = '';
    var parts = '';

    gulp.task('component', [
            'create-component-get-name',
            'create-component-html',
            'create-component-scss',
            'create-component-ts'
        ] , function() {
    });

    gulp.task('create-component-get-name', function(){
        componentName = process.argv[4];
        parts = componentName.split('-');

        for (var i = 0; i < parts.length; i += 1) {
            shortname += parts[i].charAt(0);
        }
    });

    gulp.task('create-component-html', ['create-component-get-name'], function() {
        return gulp.src('src/1-components/_name-of-component/_name-of-component.html')
            .pipe(rename("src/1-components/"+componentName+"/_"+componentName+".html"))
            .pipe(replace("lorem", ""+componentName+""))
            .pipe(replace("xxx", ""+shortname+""))
            .pipe(gulp.dest('./'));
    });

    gulp.task('create-component-scss', ['create-component-get-name'], function() {
        return gulp.src('src/1-components/_name-of-component/_name-of-component.scss')
            .pipe(rename("src/1-components/"+componentName+"/_"+componentName+".scss"))
            .pipe(replace("lorem", ""+componentName+""))
            .pipe(replace("xxx", ""+shortname+""))
            .pipe(gulp.dest('./'));
    });

    gulp.task('create-component-ts', ['create-component-get-name'], function() {
        return gulp.src('src/1-components/_name-of-component/_name-of-component.ts')
            .pipe(rename("src/1-components/"+componentName+"/"+componentName+".ts"))
            .pipe(replace("lorem", ""+componentName+""))
            .pipe(gulp.dest('./'));
    });





/* *************************
    D - CREATE STRUCTURE
************************* */
// gulp structure --options name-of-structure

    var structureName = '';

    gulp.task('structure', [
            'create-structure-get-name',
            'create-structure-html',
            'create-structure-scss'
        ] , function() {
    });

    gulp.task('create-structure-get-name', function(){
        structureName = process.argv[4];
    });

    gulp.task('create-structure-html', ['create-structure-get-name'], function() {
        return gulp.src('src/2-structures/_name-of-structure/_name-of-structure.html')
            .pipe(rename("src/2-structures/"+structureName+"/_"+structureName+".html"))
            .pipe(replace("lorem", ""+structureName+""))
            .pipe(gulp.dest('./'));
    });

    gulp.task('create-structure-scss', ['create-structure-get-name'], function() {
        return gulp.src('src/2-structures/_name-of-structure/_name-of-structure.scss')
            .pipe(rename("src/2-structures/"+structureName+"/_"+structureName+".scss"))
            .pipe(replace("lorem", ""+structureName+""))
            .pipe(gulp.dest('./'));
    });





/* *************************
    E - CREATE LAYOUT
************************* */
// gulp layout --options name-of-layout

    var layoutName = '';

    gulp.task('layout', [
            'create-layout-get-name',
            'create-layout-scss'
        ] , function() {
    });

    gulp.task('create-layout-get-name', function(){
        layoutName = process.argv[4];
    });

    gulp.task('create-layout-scss', ['create-layout-get-name'], function() {
        return gulp.src('src/3-layouts/_name-of-layout.scss')
            .pipe(rename("src/3-layouts/_"+layoutName+".scss"))
            .pipe(replace("lorem", ""+layoutName+""))
            .pipe(gulp.dest('./'));
    });





/* *************************
    F - CREATE PAGE
************************* */
// gulp page --options name-of-page

    var pageName = '';

    gulp.task('page', [
            'create-page-get-name',
            'create-page-html',
            'create-page-scss',
            'create-page-ts'
        ] , function() {
    });

    gulp.task('create-page-get-name', function(){
        pageName = process.argv[4];
    });

    gulp.task('create-page-html', ['create-page-get-name'], function() {
        return gulp.src('src/4-pages/_name-of-page/_name-of-page.html')
            .pipe(rename("src/4-pages/"+pageName+"/_"+pageName+".html"))
            .pipe(replace("lorem", ""+pageName+""))
            .pipe(gulp.dest('./'));
    });

    gulp.task('create-page-scss', ['create-page-get-name'], function() {
        return gulp.src('src/4-pages/_name-of-page/_name-of-page.scss')
            .pipe(rename("src/4-pages/"+pageName+"/_"+pageName+".scss"))
            .pipe(replace("lorem", ""+pageName+""))
            .pipe(gulp.dest('./'));
    });

    gulp.task('create-page-ts', ['create-page-get-name'], function() {
        return gulp.src('src/4-pages/_name-of-page/_name-of-page.ts')
            .pipe(rename("src/4-pages/"+pageName+"/"+pageName+".ts"))
            .pipe(replace("lorem", ""+pageName+""))
            .pipe(gulp.dest('./'));
    });





/* *************************
    G - Move fonts
************************* */
// gulp fonts
    gulp.task('fonts', () => {
        return gulp.src('src/5-else/fonts/**/*')
            .pipe(rename({dirname: ''}))
            .pipe(gulp.dest('dist/fonts'));
    });





/* *************************
    H - GENERATE favicons
************************* */
// gulp favicon
    gulp.task("favicon", function () {
        return gulp.src("src/5-else/img/favicon.png").pipe(favicons({
            "appName": null,
            "appDescription": null,
            "developerName": null,
            "developerURL": null,
            "background": "#fff",
            "path": "/",
            "url": "/",
            "display": "standalone",
            "orientation": "portrait",
            "version": "1.0",
            "logging": false,
            "online": false,
            "pipeHTML": false,
            "icons": {
                "android": true,
                "appleIcon": true,
                "appleStartup": true,
                "coast": true,
                "favicons": true,
                "firefox": true,
                "opengraph": true,
                "twitter": true,
                "windows": true,
                "yandex": true
            }
        }))
        .on("error", gutil.log)
        .pipe(gulp.dest("dist/img/favicons/"));
});

import gulp from "gulp";
import imgMinify from "gulp-imagemin";
import uglify from "gulp-uglify";
import gulpSass from "gulp-sass";
import sassComp from "sass";
import concat from "gulp-concat";
import autoprefixer from "autoprefixer";
import sourcemaps from "gulp-sourcemaps";
import postcss from "gulp-postcss";
import cleancss from "gulp-clean-css";

const sass = gulpSass(sassComp);

//Copy HTML Files to dist Task
gulp.task("copyHTML", async function () {
  gulp.src("src/*.html").pipe(gulp.dest("dist/"));
});

//Copy FONT Files to dist Task
gulp.task("copyFont", async function () {
  gulp
    .src("src/assets/fonts/*.{woff,woff2,eot}")
    .pipe(gulp.dest("dist/assets/fonts/"));
});

//Minify Images Task
gulp.task("imgMinify", async function () {
  gulp
    .src("src/assets/img/*")
    .pipe(imgMinify())
    .pipe(gulp.dest("dist/assets/img"));
});

//Minify and concat JS files Task
gulp.task("minifyJS", async function () {
  gulp
    .src("src/assets/js/*.js")
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .on("error", catchErr)
    .pipe(gulp.dest("dist/assets/js"));
});

//Sass compiler
gulp.task("sass-compile", async function () {
  gulp
    .src("src/assets/sass/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass({ errLogToConsole: true }))
    .on("error", catchErr)
    .pipe(postcss([autoprefixer()]))
    .pipe(cleancss())
    .pipe(concat("style.min.css"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/assets/css"));
});

function catchErr(e) {
  console.log(e);
  this.emit("end");
}

//gulp watch
gulp.task("watch", async function () {
  gulp.watch("src/*.html", gulp.series("copyHTML"));
  gulp.watch("src/assets/fonts/*.{woff,woff2,eot}", gulp.series("copyFont"));
  gulp.watch("src/assets/img/*", gulp.series("imgMinify"));
  gulp.watch("src/assets/js/*.js", gulp.series("minifyJS"));
  gulp.watch(
    ["src/assets/sass/*.scss", "src/assets/sass/**/*.scss"],
    gulp.series("sass-compile")
  );
});

//default task
gulp.task(
  "default",
  gulp.parallel(
    "copyHTML",
    "copyFont",
    "imgMinify",
    "minifyJS",
    "sass-compile",
    "watch"
  )
);

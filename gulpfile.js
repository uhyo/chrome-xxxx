'use strict';
const path = require('path');
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
// TypeScript
const gulpTS = require('gulp-typescript');
const gulpTSlint = require('gulp-tslint');
const typescript = require('typescript');
// Rollup
const rollup = require('rollup');
const rollupNode = require('rollup-plugin-node-resolve');
const { terser } = require('rollup-plugin-terser');
const del = require('del');

const LIB_DIR = "lib/";
const TS_DIST_LIB = "dist-es2015/";
const DIST_DECLARATION = "";
const DIST_LIB = "dist/";
const BUNDLE_MODULE_NAME = "ChromeXxxx";
const BUNDLE_NAME = "bundle.js";
const PRODUCTION = process.env.NODE_ENV === 'production';

{
  const tsProj = gulpTS.createProject('tsconfig.json', {
    typescript,
  });
  gulp.task('tsc', ()=>{
    const rs = gulp.src(path.join(LIB_DIR, '**', '*.ts{,x}'))
    .pipe(sourcemaps.init())
    .pipe(tsProj());

    if (DIST_DECLARATION){
      return merge2(
        rs.js.pipe(sourcemaps.write()).pipe(gulp.dest(TS_DIST_LIB)),
        rs.dts.pipe(gulp.dest(DIST_DECLARATION))
      );
    }else{
      return rs.js.pipe(sourcemaps.write()).pipe(gulp.dest(TS_DIST_LIB));
    }
  });
  gulp.task('watch-tsc', gulp.series('tsc', ()=>{
    gulp.watch(path.join(LIB_DIR, '**', '*.ts{,x}'), gulp.task('tsc'));
  }));
  gulp.task('tslint', ()=>{
    return gulp.src(path.join(LIB_DIR, '**', '*.ts{,x}'))
    .pipe(gulpTSlint({
      formatter: 'stylish',
    }))
    .pipe(gulpTSlint.report({
      emitError: false,
    }));
  });
  gulp.task('watch-tslint', gulp.series('tslint', ()=>{
    gulp.watch(path.join(LIB_DIR, '**', '*.ts{,x}'), gulp.task('tslint'));
  }));
}
{
  let rollupCache;
  async function runRollup(){
    const bundle = await rollup.rollup({
      // inputOptions
      input: path.join(TS_DIST_LIB, 'index.js'),
      cache: rollupCache,
      plugins: [
        rollupNode(),
        PRODUCTION && terser()
      ],
    });
    await bundle.write({
      file: path.join(DIST_LIB, BUNDLE_NAME),
      format: 'umd',
      name: BUNDLE_MODULE_NAME,
      sourcemap: 'inline',
    });
  }
  gulp.task('bundle-main', ()=>{
    return runRollup();
  });
  gulp.task('bundle', gulp.series('tsc', ()=>{
    return runRollup();
  }));
  gulp.task('watch-bundle', gulp.series('bundle-main', ()=>{
    gulp.watch(path.join(TS_DIST_LIB, '**', '*.js'), gulp.task('bundle-main'));
  }));
}
{
  gulp.task('clean', ()=>{
    const del_target = [DIST_LIB, TS_DIST_LIB];
    if (DIST_DECLARATION){
      del_target.push(DIST_DECLARATION);
    }
    return del(del_target);
  });
}
gulp.task('default', gulp.series('tsc', 'tslint', 'bundle'));
gulp.task('watch', gulp.parallel('watch-tsc', 'watch-tslint', 'watch-bundle'));

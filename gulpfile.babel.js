import chug from 'gulp-chug';
import gulp from 'gulp';
import yargs from 'yargs';
import concat from 'gulp-concat';
const { series } = require('gulp');

const { argv } = yargs
  .options({
    rootPath: {
      description: '<path> path to web assets directory',
      type: 'string',
      requiresArg: true,
      required: false,
    },
    nodeModulesPath: {
      description: '<path> path to node_modules directory',
      type: 'string',
      requiresArg: true,
      required: false,
    },
  });

const config = [
  '--rootPath',
  argv.rootPath || '../../../../../../../public/assets',
  '--nodeModulesPath',
  argv.nodeModulesPath || '../../../../../../../node_modules',
];

const configCustom = [
  '--rootPath',
  argv.rootPath || '',
  '--nodeModulesPath',
  argv.nodeModulesPath || 'node_modules',
];

export const buildAdmin = function buildAdmin() {
  return gulp.src('vendor/sylius/sylius/src/Sylius/Bundle/AdminBundle/gulpfile.babel.js', { read: false })
    .pipe(chug({ args: config, tasks: 'build' }));
};
buildAdmin.description = 'Build admin assets.';

export const watchAdmin = function watchAdmin() {
  return gulp.src('vendor/sylius/sylius/src/Sylius/Bundle/AdminBundle/gulpfile.babel.js', { read: false })
    .pipe(chug({ args: config, tasks: 'watch' }));
};
watchAdmin.description = 'Watch admin asset sources and rebuild on changes.';

export const buildShop = function buildShop() {
  return gulp.src('vendor/sylius/sylius/src/Sylius/Bundle/ShopBundle/gulpfile.babel.js', { read: false })
    .pipe(chug({ args: config, tasks: 'build' }));
};
buildShop.description = 'Build shop assets.';

export const buildCustom = function buildCustom() {
  return gulp.src('public/assets/shop/js/*.js')
    .pipe(concat('app.js'))
    .pipe(gulp.dest('public/assets/shop/js'));
};
buildCustom.description = 'Build Custom assets.';

export const watchShop = function watchShop() {
  return gulp.src('vendor/sylius/sylius/src/Sylius/Bundle/ShopBundle/gulpfile.babel.js', { read: false })
    .pipe(chug({ args: config, tasks: 'watch' }));
};
watchShop.description = 'Watch shop asset sources and rebuild on changes.';

export const build = series(gulp.parallel(buildAdmin, buildShop), buildCustom);
build.description = 'Build assets.';

export const watch = gulp.parallel(watchAdmin, watchShop);
watch.description = 'Watch asset sources and rebuild on changes.';

gulp.task('admin', buildAdmin);
gulp.task('admin-watch', watchAdmin);
gulp.task('shop', buildShop);
gulp.task('custom', buildCustom);
gulp.task('shop-watch', watchShop);

export default build;

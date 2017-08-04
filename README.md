# gulp-concat-split

### Install

    $ npm install --save-dev gulp-concat-split

### Usage

```js
const gulp = require('gulp');
const concat = require('gulp-concat');
const concat = require('gulp-concat-split').concat;
const split = require('gulp-concat-split').split;

gulp.task('default', function() {
  return gulp.src('./css/**')
    .pipe(concat())
    // do something
    .pipe(split())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('css', function() {
  return gulp.src('./css/**')
    .pipe(concat({
      splitStr: '/*****_css_*****/',
      name: 'css-tmp'
    }))
    // do something
    .pipe(split({
      splitStr: '/*****_css_*****/'
    }))
    .pipe(gulp.dest('./dist/'));
});
```

### Options

###### splitStr

> Differentiate string. Files concat together with differentiate string. Files split by differentiate string. Concat option and split option must be as same.

- Default: /*****_gulp-concat-split_*****/
- Type: string
- Required: `false`

###### name

> Files concat name.

- Default: gulp-concat-split-tmp
- Type: string
- Required: `false`



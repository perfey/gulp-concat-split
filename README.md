# gulp-concat-split

[Chinese readme](./Chinese.md)

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

- Default: `/\*\*\*\*\*\_gulp-concat-split\_\*\*\*\*\*/`
- Type: `string`
- Required: `false`

###### name

> Files concat name.

- Default: `gulp-concat-split-tmp`
- Type: `string`
- Required: `false`

### Why

Use under css

```css
// a.css
.box1 {
  background: url(./sprite/icon1.png);
}
.box2 {
  background: url(./sprite/icon2.png)
}
.box3 {
  background: url(./sprite/icon3.png)
}

// b.css
.box2 {
  background: url(./sprite/icon2.png)
}
.box3 {
  background: url(./sprite/icon3.png);
}
.box4 {
  background: url(./sprite/icon4.png)
}
```

Use under gulp

```js
gulp.task('dist', function (done) {
  var opts = {
    stylesheetPath: './dist',
    spritePath: './img',
    spritesmith: {padding: 4},
    retina:  2,
    hooks: false,
    groupBy: function (image) {
      var groupName = 'x';
      image.retina = true;
      image.ratio = 2;
      return Promise.resolve(groupName);
    }
  };

  var stream = gulp.src('./css/*.css')
    .pipe(postcss([sprites(opts)]))
    .pipe(gulp.dest('./dist'));
  return stream;
});
```

The sprite img would only have icon2, icon3, icon4. We want to have icon1, icon2, icon3, icon4.  

this problem will be resolved by `gulp-concat-split`.

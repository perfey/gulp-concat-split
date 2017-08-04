# gulp-concat-split

### 安装

    $ npm install --save-dev gulp-concat-split

### 使用

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

### 参数说明

###### splitStr

> 连接合并文件内容的字符串，也是区分文件的字符串，合并和区分的值必须一致，已有默认值，建议不要修改

- Default: `/\*\*\*\*\*\_gulp-concat-split\_\*\*\*\*\*/`
- Type: `string`
- Required: `false`

###### name

> 合并后的文件名

- Default: `gulp-concat-split-tmp`
- Type: `string`
- Required: `false`

### 插件的使用场景

如下css

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

使用postcss-sprites合并雪碧图时

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

雪碧图包含图片 icon2, icon3, icon4. 预期是包含 icon1, icon2, icon3, icon4. 这是由于gulp会一个文件一个文件的丢给postcss-sprites实现合并雪碧图，后合并的会把先前的图片覆盖掉。  

`gulp-concat-split`的提供就是为了解决这个问题。

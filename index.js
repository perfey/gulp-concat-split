'use strict';

var through = require('through2');
var gutil = require('gulp-util');
var Vinyl = require('vinyl');
var path = require('path');
var PluginError = gutil.PluginError;

const PLUGIN_NAME = 'gulp-concat-split';

var concatSplit = {
  fileList: [],
  concat: function(opt) {
    opt = opt || {};
    if (!opt.splitStr) {
      opt.splitStr = '/*****_gulp-concat-split_*****/';
    }
    if (!opt.name) {
      opt.name = 'gulp-concat-split-tmp';
    }

    var splitText = new Buffer(opt.splitStr);

    var allFile = new Vinyl({
      path: opt.name,
      contents: new Buffer('')
    });
    var fileBase, fileCwd, filePath;

    function addStr(file, enc, cb) {
      fileBase = file.base;
      fileCwd = file.cwd;
      filePath = file.path;

      if (file.isStream()) {
        this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
        return cb();
      }

      if (file.isBuffer()) {
        file.contents = Buffer.concat([file.contents, splitText]);
        concatSplit.fileList.push(file.path);
        allFile.contents = Buffer.concat([allFile.contents, file.contents])
      }

      cb();
    }

    function concatAll(cb) {
      allFile.base = fileBase;
      allFile.cwd = fileCwd;
      allFile.path = path.join(path.dirname(filePath), (opt.name + path.extname(filePath)));
      this.push(allFile);
      cb();
    }

    var stream = through.obj(addStr, concatAll);

    return stream;
  },
  split: function(opt) {
    opt = opt || {};
    if (!opt.splitStr) {
      opt.splitStr = '/*****_gulp-concat-split_*****/';
    }

    function splitFile(file, enc, cb) {
      if (file.isStream()) {
        this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
        return cb();
      }

      if (file.isBuffer()) {
        var str = file.contents.toString();
        var arr = str.split(opt.splitStr)
        for (var i in concatSplit.fileList) {
          var newFile = new Vinyl({
            cwd: file.cwd,
            base: file.base,
            path: concatSplit.fileList[i],
            contents: new Buffer(arr[i])
          });
          this.push(newFile);
        }
        concatSplit.fileList = [];
      }

      cb();
    }

    var stream = through.obj(splitFile);
    return stream;
  }
}

module.exports = concatSplit;

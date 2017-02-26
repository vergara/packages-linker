var processDirsRecursively = require('./process-dirs-recursively2');
var fs = require('fs');

function filterJsFiles(fullPath) {
  var splits = fullPath.split('/');
  var file = splits[splits.length - 1];
  var extensionSplits = file.split('.');
  var extension = extensionSplits[extensionSplits.length - 1];

  if (extensionSplits.length > 1 && extension === 'js') {
    return !fs.statSync(fullPath).isDirectory();
  } else {
    return false;
  }
}

module.exports = function findJsFiles(dir) {
  return processDirsRecursively([dir], filterJsFiles);
}

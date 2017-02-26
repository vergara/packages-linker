var processDirsRecursively = require('./process-dirs-recursively2');

function findPackageJson(fullPath) {
  var splits = fullPath.split('/');
  var file = splits[splits.length - 1];
  if (file === 'package.json') {
   return true;
  }
}

module.exports = function(rootDir) {
  return processDirsRecursively([rootDir], findPackageJson)
  .then((files) => {
    return files.map((fullPath) => {
      var splits = fullPath.split('/');
      splits.length--;
      var dir = splits.join('/');

      return {fullPath, dir};
    });
  });
}

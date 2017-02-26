var fs = require('fs');
var denodeify = require('promise-denodeify');
var readdir = denodeify(fs.readdir, Promise, false);
var stat = denodeify(fs.stat, Promise, false);

module.exports = function processDirsRecursively(dirs, filter, skip) {
  if (!dirs.length) {
    return Promise.resolve([]);
  }

  var aDir = dirs.pop();

  return stat(aDir)
  .then((anInputDirStat) => {
    if (!anInputDirStat || !anInputDirStat.isDirectory()) {
      return Promise.reject("Found file that is not a directory in input: %s", aDir);
    }

    return aDir;
  })
  .then((aDir) => {
    return readdir(aDir)
    .then((files) => {
      files = files.filter((file) => {
        return file !== '.' && file !== '..' && file !== 'node_modules';
      });

      return files;
    });
  })
  .then((files) => {
    var newDirs = [];
    var collected = [];

    var promises = files.map((file) => {
      var fullPath = aDir + '/' + file;

      return stat(fullPath)
      .then((fileStat) => {
        if (fileStat && fileStat.isDirectory()) {
          newDirs.push(fullPath);
        } else if (filter(fullPath)) {
          collected.push(fullPath);
        }
      });

    });

    return Promise.all(promises)
    .then(() => {
      return {newDirs, collected};
    });
  })
  .then((newDirsAndCollectedFiles) => {
    var collected = newDirsAndCollectedFiles.collected;
    var newDirs = newDirsAndCollectedFiles.newDirs;

    return processDirsRecursively(dirs.concat(newDirs), filter, skip)
    .then((moreFiles) => {
      return collected.concat(moreFiles);
    });
  });
};

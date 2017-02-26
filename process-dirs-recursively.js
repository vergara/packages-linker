var fs = require('fs');
var denodeify = require('promise-denodeify');
var readdir = denodeify(fs.readdir, Promise, false);
var stat = denodeify(fs.stat, Promise, false);

module.exports = function processDirsRecursively(dirs, filter, skip) {
  if (!dirs.length) {
    return Promise.resolve([]);
  }

  var collect = [];

  var aDir = dirs.pop();
  //console.log('Processing: %s', aDir);
  return readdir(aDir)
  .then((files) => {
    var statPromises = [];
    files.filter((file) => {
      file !== '.' && file !== '..';
    });

    files.forEach((file) => {
      var fullPath = aDir + '/' + file;
      if (skip && skip(fullPath)) {
        return;
      }
      statPromises.push(
        stat(fullPath)
        .then((stat) => {
          if (stat && stat.isDirectory()) {
            if (file === 'node_modules') {
              return null;
            }

            return fullPath;
          } else {
            return null;
          }
        })
        .catch((err) => {
          console.log('Ignoring: %s', fullPath);
        })
      );

      if (filter(fullPath)) {
        collect.push(fullPath);
      }
    });

    return Promise.all(statPromises)
    .then((promises) => {
      promises = promises.filter((promise) => {
        return promise !== null;
      });
      return processDirsRecursively(dirs.concat(promises), filter, skip);
    })
    .catch((err) => {
      console.log("Error: " + err);
    });
  })
  .then((result) => {
    return collect.concat(result);
  });
};

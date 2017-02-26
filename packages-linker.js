var findFoldersWithPackageJson = require('./find-folders-with-package-json');
var findJsFiles = require('./find-js-files');
var findScopesInFile = require('./find-scopes-in-file');
var PkgDirsByPkgName = require('./pkg-dirs-by-pkg-name');
var createLinks = require('./create-links.js');
var _ = require('lodash');

var rootDir = process.argv[2];
var scope = process.argv[3];

findFoldersWithPackageJson(rootDir)
.then((packageJsonDirs) => {
  //console.log('packageJsonDirs: %s', JSON.stringify(packageJsonDirs, null, 2));
  pkgJsonDirsWithJSFiles = packageJsonDirs.map((pkg) => {
    return findJsFiles(pkg.dir)
    .then((jsFiles) => {
      pkg.jsFiles = jsFiles;

      return pkg;
    });
  });

  //logResults(pkgJsonDirsWithJSFiles);

  pkgJsonDirsWithUsedPackages = pkgJsonDirsWithJSFiles.map((pkgPromise) => {
    return pkgPromise.then((pkg) => {
      var jsFilesPromises = pkg.jsFiles.map((jsFile) => {
        return findScopesInFile(jsFile, scope);
      });

      return Promise.all(jsFilesPromises)
      .then((jsFiles) => {
        pkg.jsFiles = jsFiles;

        return pkg;
      });
    });
  });

  //logResults(pkgJsonDirsWithUsedPackages);

  var pkgJsonDirsWithUsedPackagesDirs = pkgJsonDirsWithUsedPackages.map((pkgPromise) => {
    return pkgPromise.then((pkg) => {
      var jsFilesPromises = pkg.jsFiles.map((jsFile) => {
        const pkgDirsByPkgName = new PkgDirsByPkgName(packageJsonDirs);
        var usedPackagesPromises = jsFile.usedPackages.map((usedPkg) => {
          //return Promise.resolve(usedPkg + 'A');
          return pkgDirsByPkgName.findDirForPkg(usedPkg);
        });

        return Promise.all(usedPackagesPromises)
        .then((usedPkgs) => {
          jsFile.usedPackages = usedPkgs;

          return jsFile;
        });
      });

      return Promise.all(jsFilesPromises)
      .then((jsFiles) => {
        pkg.jsFiles = jsFiles;

        return pkg;
      });
    });
  });

  //logResults(pkgJsonDirsWithUsedPackagesDirs);

  pkgJsonDirsWithUsedPackagesDirs.forEach((pkgPromise) => {
    pkgPromise.then((pkg) => {
      var packagesToLink = [];
      pkg.jsFiles.forEach((jsFile) => {
        jsFile.usedPackages.forEach((usedPkg) => {
          packagesToLink.push(usedPkg);
        });
      });

      packagesToLink = _.uniqBy(packagesToLink, 'pkgName');
      packagesToLink.forEach((usedPkg) => {
        createLinks(usedPkg, pkg.dir);
      });
    });
  });
});

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise: ', p, 'reason: ', reason);
  process.exit(1);
});

function logResults(results) {
  results.forEach((pkgPromise) => {
    pkgPromise.then((pkg) => {
      console.log("pkg: %s", JSON.stringify(pkg, null, 2));
    });
  });
}

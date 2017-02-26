var fs = require('fs');
var denodeify = require('promise-denodeify');
var readFile = denodeify(fs.readFile, Promise, false);

function PkgDirsByPkgName(packageJsonDirs) {
  this.packageJsonDirsByPkgNames = packageJsonDirs.map((pkgJsonDir) => {
    return readFile(pkgJsonDir.fullPath, 'utf8')
    .then((data) => {
      try {
        var parsedPkg = JSON.parse(data);
        //console.log('parsedPkg.name.trim(): ', parsedPkg.name.trim());
        return {pkgName: parsedPkg.name.trim(), dir: pkgJsonDir.dir}
      } catch (err) {
        return Promise.reject(new Error('Error while parsing file: "%s"', dir.fullPath));
      }
    });
  });
}

PkgDirsByPkgName.prototype.findDirForPkg = function(pkgName) {
  return Promise.all(this.packageJsonDirsByPkgNames)
  .then((packageJsonDirsByPkgNames) => {
    //console.log('packageJsonDirsByPkgNames: ', packageJsonDirsByPkgNames);
    pkgDir = packageJsonDirsByPkgNames.filter((pkg) => {
      return pkg.pkgName === pkgName;
    });

    //console.log('pkgDir: ', JSON.stringify(pkgDir));

    return {pkgName, dir: pkgDir[0].dir};
  });
}

module.exports = PkgDirsByPkgName;

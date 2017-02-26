const exec = require('child_process').exec;

module.exports = function createLinks(usedPkg, srcPkgDir) {
  // console.log('Linking %s to %s (%s)', srcPkgDir, usedPkg.dir, usedPkg.pkgName);
  exec('npm link', {cwd: usedPkg.dir}, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);

    exec('npm link ' + usedPkg.pkgName, {cwd: srcPkgDir}, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    });
  });
};

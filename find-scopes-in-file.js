var fs = require('fs');
var denodeify = require('promise-denodeify');
var readFile = denodeify(fs.readFile, Promise, false);

function findScopesInFile(jsFile, scope) {
  var scopeRegex = new RegExp('(.+require[^"\']+)(\'|")('+scope+'[^"\']+)("|\'.+)');

  return readFile(jsFile, 'utf8')
  .then((data) => {
    var lines = data.split("\n");
    lines = lines.filter((line) => {
      var match = line.match(scopeRegex);
      if (match) {
        //console.log("\n\nFound: %s\n\n", match);
        return true;
      } else {
        return false;
      }
    });
    usedPackages = lines.map((line) => {
      var match = line.match(scopeRegex);
      return match[3];
    });

    return {jsFile, usedPackages};
  });
}

module.exports = findScopesInFile;

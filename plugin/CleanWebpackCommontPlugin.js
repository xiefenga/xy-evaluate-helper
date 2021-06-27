const { join } = require('path');
const { readFile, writeFile } = require('fs/promises');

class CleanWebpackCommontPlugin {
  apply(compiler) {
    compiler.hooks.done.tap("AddUserScriptPlugin", async stats => {
      const { path, filename } = stats.compilation.options.output;
      const filePath = join(path, filename);
      const content = await readFile(filePath, 'utf-8');
      await writeFile(filePath, content.replace(/\/\*.*\*\//g, ''));
      console.log("去除");
    });
  }
}

module.exports = CleanWebpackCommontPlugin
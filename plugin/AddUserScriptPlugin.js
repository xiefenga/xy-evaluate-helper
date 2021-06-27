const { join } = require('path');
const { readFile, writeFile } = require('fs/promises');

class AddUserScriptPlugin {

  // UserScript 模板的地址
  constructor({ template, version } = options) {
    this.filename = template;
    this.version = version;
  }

  apply(compiler) {
    compiler.hooks.done.tap("CleanWebpackCommontPlugin", async stats => {
      const { path, filename } = stats.compilation.options.output;
      const filePath = join(path, filename);
      const template = await readFile(this.filename, 'utf-8');
      const content = await readFile(filePath, 'utf-8');
      await writeFile(
        filePath,
        template.replace(/{{version}}/, this.version)
      );
      await writeFile(filePath, content, { flag: 'a+' });
    });
  }
}

module.exports = AddUserScriptPlugin


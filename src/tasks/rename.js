const fs = require('fs');
const xml2jsparser = require('xml2js-parser');

/**
 * 读取aepx配置xml，并将配置转为对象
 * @param template aepx配置文件路径地址
 * @return {Promise<object>}
 */
const reader = (template) => {
  return new Promise(((resolve, reject) => {
    fs.readFile(template, (err, data) => {
      if (err) {
        reject(err);
      }
      xml2jsparser.parseString(data, {
        attrkey: '@',
        explicitChildren: true,
        preserveChildrenOrder: true,
        charsAsChildren: true,
      }, (error, target) => {
        if (error) {
          reject(error);
        }
        resolve(target.AfterEffectsProject);
      });
    });
  }));
}

const resolve = (xmlObj, assets) => {
  const child = '$$';
  const tag = '#name';
  const attr = '@';
  // 唯一的fold节点进行查找和替换操作。
  const fold = xmlObj[child].find(item => item[tag] === 'Fold');
  const map = new Map();
  assets.forEach((asset) => {
    map.set(asset.layerIndex, asset);
  });
  let flagIndex = 0;
  fold[child].forEach((item) => {
    // 是可以进行设置的aepx元素，只有Item才可以进行设置。
    if (['Item'].indexOf(item[tag]) !== -1) {
      // 对所对应的元素进行了设置
      if (map.has(flagIndex)) {
        const asset = map.get(flagIndex);
        switch (item[tag]) {
          case 'Item':
            const Pin = item[child].find(it => it[tag] === 'Pin');
            if (!Pin) break;
            const Als2 = Pin[child].find(it => it[tag] === 'Als2');
            if (!Als2) break;
            const file = Als2[child].find(it => it[tag] === 'fileReference');
            if (!file || !file[attr] || !file[attr]['fullpath']) break;
            file[attr]['fullpath'] = asset.dest;
            break;
          default:
            break;
        }
      }
      flagIndex += 1;
    }

    if (item[tag] === 'Item') {


    }
  });
  return xmlObj;
}

/**
 * 将xml2jsparser.parseString转成的xml对象转为xml
 * @param obj xml2jsparser.parseString返回的对象
 * @return {string} xml字符串
 */
const transform = (obj) => {
  let result = `<?xml version="1.0" encoding="UTF-8"?> \n`;
  const tag = '#name';
  const attr = '@';
  const child = '$$';
  const text = '__text__';
  const textKey = '_';

  const start = (obj) => {
    const hasChild = obj[child] && obj[child].length > 0;
    const attrs = obj[attr] || {};
    let attrStr = '';
    for (const key in attrs) {
      attrStr += ` ${key}="${attrs[key]}"`
    }
    if (obj[tag] === text) {
      result += `${obj[textKey]}`;
    } else {
      result += `<${obj[tag]}${attrStr ? attrStr : ''}>`;
      if (hasChild) {
        for (let i = 0; i < obj[child].length; i++) {
          start(obj[child][i]);
        }
      }
      result += `</${obj[tag]}> \n`;
    }
  }
  start(obj);
  return result;
}

/**
 * rename
 */
module.exports = async function(job, settings) {
  const obj = await reader(job.template.dest);
  const resolved = resolve(obj, job.assets);
  const result = transform(resolved);
  await fs.writeFileSync(job.template.dest, result);
  return Promise.resolve(job);
};


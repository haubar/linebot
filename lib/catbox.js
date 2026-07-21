'use strict';

const rp = require('request-promise');

const CATBOX_API = 'https://catbox.moe/user/api.php';

// 唯一負責跟 catbox.moe 溝通的地方。之後不用 catbox 了，只要刪掉這個檔案、
// 並修改 lib/storage.js 的 getPublicUrl 改叫別的函式即可，其他地方都不用動。
const uploadToCatbox = async (buffer, filename) => {
    const url = await rp({
        method: 'POST',
        uri: CATBOX_API,
        formData: {
            reqtype: 'fileupload',
            fileToUpload: {
                value: buffer,
                options: { filename }
            }
        }
    });
    return url.trim();
};

module.exports = { uploadToCatbox };

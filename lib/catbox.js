'use strict';

const rp = require('request-promise');

const CATBOX_API = 'https://catbox.moe/user/api.php';

// 唯一負責跟 catbox.moe 溝通的地方。介面統一為 (buffer, filename) => Promise<url>，
// 跟 storageTo.js、r2.js 一致，由 lib/storage.js 依 STORAGE_BACKEND 切換呼叫。
const upload = async (buffer, filename) => {
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

module.exports = { upload };

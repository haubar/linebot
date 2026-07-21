'use strict';

const fs = require('fs');
const path = require('path');
const catbox = require('./catbox');

const MEDIA_DIR = path.join(__dirname, '..', 'tmp');

const MIME_TYPES = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain',
    '.zip': 'application/zip',
    '.mp4': 'video/mp4',
    '.m4a': 'audio/mp4'
};

// 只留下安全字元，避免路徑穿越或非法檔名
const sanitizeFilename = (filename) => {
    const base = path.basename(filename);
    return base.replace(/[^a-zA-Z0-9._-]/g, '_');
};

const getMimeType = (filename) => {
    return MIME_TYPES[path.extname(filename).toLowerCase()] || 'application/octet-stream';
};

// 把 buffer 存到本機，回傳實際存檔用的檔名（已消毒過）
const saveMedia = (buffer, filename) => {
    const safeName = sanitizeFilename(filename);
    if (!fs.existsSync(MEDIA_DIR)) {
        fs.mkdirSync(MEDIA_DIR, { recursive: true });
    }
    fs.writeFileSync(path.join(MEDIA_DIR, safeName), buffer);
    return safeName;
};

const getMediaUrl = (filename) => {
    return `${process.env.PUBLIC_BASE_URL}/media/${filename}`;
};

const readMedia = (filename) => {
    const safeName = sanitizeFilename(filename);
    const filePath = path.join(MEDIA_DIR, safeName);
    if (!fs.existsSync(filePath)) {
        return null;
    }
    return fs.readFileSync(filePath);
};

// 對外提供「公開網址」的唯一入口。目前暫用 catbox.moe，
// 之後有自己的網域時，把這裡換成 `return getMediaUrl(filename)` 即可，
// 呼叫端 (feature.js) 完全不用改。
const getPublicUrl = async (buffer, filename) => {
    return catbox.uploadToCatbox(buffer, filename);
};

module.exports = {
    MEDIA_DIR,
    saveMedia,
    getMediaUrl,
    getPublicUrl,
    readMedia,
    getMimeType,
    sanitizeFilename
};

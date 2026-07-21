'use strict';

const fs = require('fs');
const path = require('path');

const { getMimeType } = require('./mime');
const catbox = require('./catbox');
const storageTo = require('./storageTo');
const r2 = require('./r2');

const MEDIA_DIR = path.join(__dirname, '..', 'tmp');
const DEFAULT_PUBLIC_BASE_URL = 'https://data.kerker.in';
const DEFAULT_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 天
const DEFAULT_BACKEND = 'storage-to';

// 各家第三方儲存服務的上傳介面統一為 (buffer, filename) => Promise<url>，
// 要換服務商只要改 STORAGE_BACKEND 環境變數，呼叫端 (feature.js) 完全不用動
const BACKENDS = {
    catbox: catbox.upload,
    'storage-to': storageTo.uploadSimple,
    'storage-to-multipart': storageTo.uploadMultipart,
    r2: r2.upload
};

// 只留下安全字元，避免路徑穿越或非法檔名
const sanitizeFilename = (filename) => {
    const base = path.basename(filename);
    return base.replace(/[^a-zA-Z0-9._-]/g, '_');
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
    const baseUrl = process.env.PUBLIC_BASE_URL || DEFAULT_PUBLIC_BASE_URL;
    return `${baseUrl}/media/${filename}`;
};

const readMedia = (filename) => {
    const safeName = sanitizeFilename(filename);
    const filePath = path.join(MEDIA_DIR, safeName);
    if (!fs.existsSync(filePath)) {
        return null;
    }
    return fs.readFileSync(filePath);
};

// 清掉超過 maxAge 沒異動的媒體檔案，避免 tmp/ 一直累積佔滿磁碟
const cleanupOldMedia = (maxAge = DEFAULT_MAX_AGE_MS) => {
    if (!fs.existsSync(MEDIA_DIR)) {
        return 0;
    }
    const now = Date.now();
    let deletedCount = 0;
    for (const filename of fs.readdirSync(MEDIA_DIR)) {
        const filePath = path.join(MEDIA_DIR, filename);
        const stat = fs.statSync(filePath);
        if (now - stat.mtimeMs > maxAge) {
            fs.unlinkSync(filePath);
            deletedCount++;
        }
    }
    return deletedCount;
};

// 對外提供「公開網址」的唯一入口。STORAGE_BACKEND 沒設定時預設走 storage-to；
// 設 'local' 才走自架 /media 靜態路由，其他值呼叫對應第三方服務的 upload(buffer, filename)。
const getPublicUrl = async (buffer, filename) => {
    const backendName = process.env.STORAGE_BACKEND || DEFAULT_BACKEND;
    if (backendName === 'local') {
        return getMediaUrl(filename);
    }
    const backend = BACKENDS[backendName];
    if (!backend) {
        throw new Error(`storage.getPublicUrl: 未知的 STORAGE_BACKEND "${backendName}"`);
    }
    return backend(buffer, filename);
};

module.exports = {
    MEDIA_DIR,
    saveMedia,
    getMediaUrl,
    getPublicUrl,
    readMedia,
    getMimeType,
    sanitizeFilename,
    cleanupOldMedia
};

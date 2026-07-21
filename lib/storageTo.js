'use strict';

const rp = require('request-promise');
const { getMimeType } = require('./mime');

const API_BASE = 'https://storage.to/api';

// storage.to 大部分端點不需要認證；有設定才帶 token 上去
const buildAuthHeaders = () => {
    if (process.env.STORAGE_TO_TOKEN) {
        return { Authorization: `Bearer ${process.env.STORAGE_TO_TOKEN}` };
    }
    if (process.env.STORAGE_TO_VISITOR_TOKEN) {
        return { 'X-Visitor-Token': process.env.STORAGE_TO_VISITOR_TOKEN };
    }
    return {};
};

// init 回傳的 headers 每個值是陣列（例如 { Host: ["..."] }），PUT 時要攤平成字串
const flattenHeaders = (headers = {}) => {
    const flat = {};
    for (const [key, value] of Object.entries(headers)) {
        flat[key] = Array.isArray(value) ? value[0] : value;
    }
    return flat;
};

// 方式 A：POST /sharex/upload 單步驟上傳。介面最簡單，但限 25MB/檔、20 次/天，
// 適合低頻的手動分享場景，量大會撞 rate limit。
const uploadSimple = async (buffer, filename) => {
    const res = await rp({
        method: 'POST',
        uri: `${API_BASE}/sharex/upload`,
        headers: buildAuthHeaders(),
        formData: {
            file: {
                value: buffer,
                options: { filename }
            }
        },
        json: true
    });
    return res.url;
};

// 方式 B：init -> PUT(R2 presigned URL) -> confirm 三段式。rate limit 較高（60/分鐘），
// 適合正式流量。>50MB 的檔案 storage.to 會走 multipart，這裡不支援，直接丟錯。
const uploadMultipart = async (buffer, filename) => {
    const contentType = getMimeType(filename);
    const size = buffer.length;
    const authHeaders = buildAuthHeaders();

    const init = await rp({
        method: 'POST',
        uri: `${API_BASE}/upload/init`,
        headers: authHeaders,
        body: { filename, content_type: contentType, size },
        json: true
    });

    if (init.type !== 'single') {
        throw new Error(`storageTo.uploadMultipart: 檔案 ${filename} (${size} bytes) 超過單段上傳上限，需要 multipart，此函式尚未支援`);
    }

    await rp({
        method: 'PUT',
        uri: init.upload_url,
        headers: flattenHeaders(init.headers),
        body: buffer
    });

    const confirm = await rp({
        method: 'POST',
        uri: `${API_BASE}/upload/confirm`,
        headers: authHeaders,
        body: { filename, size, content_type: contentType, r2_key: init.r2_key },
        json: true
    });

    return confirm.file.url;
};

module.exports = { uploadSimple, uploadMultipart };

'use strict';

const path = require('path');

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

const getMimeType = (filename) => {
    return MIME_TYPES[path.extname(filename).toLowerCase()] || 'application/octet-stream';
};

module.exports = { MIME_TYPES, getMimeType };

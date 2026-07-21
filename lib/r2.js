'use strict';

const { getMimeType } = require('./mime');

// @aws-sdk/client-s3 延遲到真的呼叫 upload() 才 require。這個模組會被
// lib/storage.js 無條件載入，如果 top-level require 這個套件，只要
// 部署環境沒裝上它（例如還沒跑過 npm install 同步新增的 dependency），
// 整支 bot 連 webhook 都還沒 listen 就會直接崩潰——即使根本沒用到 r2 backend。
let client = null;
const getClient = () => {
    if (!client) {
        const { S3Client } = require('@aws-sdk/client-s3');
        client = new S3Client({
            region: 'auto',
            endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID,
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
            }
        });
    }
    return client;
};

// 直接上傳到自家 Cloudflare R2 bucket，不經過 storage.to 這類第三方服務。
// bucket 要另外設定 public access 或自訂網域，R2_PUBLIC_BASE_URL 才會是真的可存取網址。
const upload = async (buffer, filename) => {
    const { PutObjectCommand } = require('@aws-sdk/client-s3');
    await getClient().send(new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: filename,
        Body: buffer,
        ContentType: getMimeType(filename)
    }));
    return `${process.env.R2_PUBLIC_BASE_URL}/${filename}`;
};

module.exports = { upload };

'use strict';

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getMimeType } = require('./mime');

// R2 是 S3 相容 API，region 固定填 'auto'。client 延遲建立，
// 避免沒設定 R2 環境變數的環境（沒用到這個 backend）在載入時就噴錯。
let client = null;
const getClient = () => {
    if (!client) {
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
    await getClient().send(new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: filename,
        Body: buffer,
        ContentType: getMimeType(filename)
    }));
    return `${process.env.R2_PUBLIC_BASE_URL}/${filename}`;
};

module.exports = { upload };

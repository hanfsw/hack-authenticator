/**
 * 二维码识别工具
 * 使用 qr-scanner 库解析二维码图片
 */

import QrScanner from 'qr-scanner';

/**
 * 从图片文件中读取二维码
 * @param {File} file - 图片文件
 * @returns {Promise<Object|null>} 解析结果 {issuer, label, secret} 或 null
 */
export async function readQRCode(file) {
    console.log('[QR Debug] 开始处理文件:', file.name, file.type, file.size);
    try {
        // 将 File 转换为 Image 元素
        const imageUrl = URL.createObjectURL(file);
        const img = new Image();

        console.log('[QR Debug] 创建 Image 对象, URL:', imageUrl);

        // 等待图片加载
        await new Promise((resolve, reject) => {
            img.onload = () => {
                console.log('[QR Debug] 图片加载成功:', img.width, 'x', img.height);
                resolve();
            };
            img.onerror = (e) => {
                console.error('[QR Debug] 图片加载失败:', e);
                reject(new Error('图片加载失败'));
            };
            img.src = imageUrl;
        });

        console.log('[QR Debug] 开始调用 QrScanner.scanImage...');
        // 使用新的 API 扫描图片元素,使用详细结果格式
        const result = await QrScanner.scanImage(img, { returnDetailedScanResult: true });
        console.log('[QR Debug] 扫描结果:', result);

        // 释放对象 URL
        URL.revokeObjectURL(imageUrl);

        // 解析 OTPAuth URL (详细结果中 data 包含实际的二维码文本)
        if (result && result.data) {
            console.log('[QR Debug] 成功识别二维码数据:', result.data);
            const parsed = parseOtpAuthUrl(result.data);
            console.log('[QR Debug] 解析 OTP URL 结果:', parsed);
            return parsed;
        }

        console.warn('[QR Debug] 未识别到二维码数据');
        return null;
    } catch (error) {
        console.error('[QR Debug] 二维码识别过程出错:', error);
        // 打印更详细的错误信息
        if (error instanceof Error) {
            console.error('[QR Debug] 错误详情:', error.name, error.message, error.stack);
        }
        return null;
    }
}

/**
 * 解析otpauth URL
 * 格式:otpauth://totp/Issuer:user@example.com?secret=XXX&issuer=Issuer
 * @param {string} url - otpauth URL
 * @returns {Object|null} 解析结果 {issuer, label, secret}
 */
export function parseOtpAuthUrl(url) {
    try {
        if (!url.startsWith('otpauth://')) {
            return null;
        }

        const urlObj = new URL(url);

        // 验证类型 (host 应该是 totp 或 hotp)
        if (urlObj.host !== 'totp' && urlObj.host !== 'hotp') {
            console.warn('[QR Debug]未知的OTP类型:', urlObj.host);
            // 虽然类型不匹配，但如果参数完整，或许仍可尝试解析？暂且严格一点
            // return null; 
        }

        // 获取标签 (pathname 通常是 /Label)
        let label = '';
        const pathname = urlObj.pathname;
        if (pathname && pathname.length > 1) {
            // 去掉开头的 /
            label = decodeURIComponent(pathname.substring(1));
        }

        // 解析issuer和account
        let issuer = '';
        let account = label;

        if (label.includes(':')) {
            const parts = label.split(':');
            issuer = parts[0].trim();
            account = parts.slice(1).join(':').trim();
        }

        // 从查询参数获取secret和issuer
        const params = new URLSearchParams(urlObj.search);
        const secret = params.get('secret');
        const issuerParam = params.get('issuer');

        if (!secret) {
            console.warn('[QR Debug] URL中缺少secret参数');
            return null;
        }

        // 优先使用查询参数中的issuer
        if (issuerParam) {
            issuer = issuerParam;
        }

        return {
            issuer: issuer || '',
            label: account || '',
            secret: secret.toUpperCase(),
        };
    } catch (error) {
        console.error('解析otpauth URL失败:', error);
        return null;
    }
}

/**
 * 验证图片文件类型
 * @param {File} file - 文件对象
 * @returns {boolean} 是否为图片
 */
export function isImageFile(file) {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    return validTypes.includes(file.type);
}

/**
 * 限制图片文件大小
 * @param {File} file - 文件对象
 * @param {number} maxSizeMB - 最大文件大小(MB)
 * @returns {boolean} 是否在大小限制内
 */
export function checkImageSize(file, maxSizeMB = 5) {
    const maxBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxBytes;
}

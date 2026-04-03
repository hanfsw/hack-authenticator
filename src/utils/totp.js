/**
 * TOTP (Time-based One-Time Password) 工具函数
 * 使用otpauth库生成动态验证码
 */

import { TOTP, Secret } from 'otpauth';

/**
 * 创建TOTP实例
 * @param {string} secret - Base32编码的密钥
 * @param {string} issuer - 发行者（如：GitHub）
 * @param {string} label - 账号标签（如：user@example.com）
 * @returns {TOTP} TOTP实例
 */
export function createTOTP(secret, issuer = '', label = '') {
    return new TOTP({
        issuer,
        label,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: Secret.fromBase32(secret),
    });
}

/**
 * 生成当前时间的验证码
 * @param {string} secret - Base32编码的密钥
 * @returns {string} 6位验证码
 */
export function generateCode(secret) {
    try {
        const totp = createTOTP(secret);
        return totp.generate();
    } catch (error) {
        console.error('生成验证码失败:', error);
        return '------';
    }
}

/**
 * 验证密钥是否有效
 * @param {string} secret - 待验证的密钥
 * @returns {boolean} 是否有效
 */
export function validateSecret(secret) {
    if (!secret || typeof secret !== 'string') {
        return false;
    }

    // 移除空格和连字符
    const cleanSecret = secret.replace(/[\s-]/g, '').toUpperCase();

    // Base32字符集：A-Z和2-7
    const base32Regex = /^[A-Z2-7]+=*$/;

    if (!base32Regex.test(cleanSecret)) {
        return false;
    }

    // 尝试生成验证码来验证密钥
    try {
        const totp = createTOTP(cleanSecret);
        totp.generate();
        return true;
    } catch {
        return false;
    }
}

/**
 * 获取当前周期的剩余时间（秒）
 * @returns {number} 剩余秒数
 */
export function getRemainingSeconds() {
    const now = Math.floor(Date.now() / 1000);
    return 30 - (now % 30);
}

/**
 * 获取当前周期的进度（0-100）
 * @returns {number} 进度百分比
 */
export function getProgress() {
    const remaining = getRemainingSeconds();
    return ((30 - remaining) / 30) * 100;
}

/**
 * 格式化密钥（添加空格分隔）
 * @param {string} secret - 原始密钥
 * @returns {string} 格式化后的密钥
 */
export function formatSecret(secret) {
    if (!secret) return '';
    const clean = secret.replace(/[\s-]/g, '').toUpperCase();
    return clean.match(/.{1,4}/g)?.join(' ') || clean;
}

/**
 * 清理密钥（移除空格和连字符）
 * @param {string} secret - 原始密钥
 * @returns {string} 清理后的密钥
 */
export function cleanSecret(secret) {
    if (!secret) return '';
    return secret.replace(/[\s-]/g, '').toUpperCase();
}

/**
 * i18n国际化工具
 * 支持中英文切换
 */

import { zh } from './zh';
import { en } from './en';

const translations = {
    zh,
    en,
};

// 获取当前语言
export function getCurrentLanguage() {
    // 从chrome.storage获取，默认中文
    return new Promise((resolve) => {
        chrome.storage.local.get(['language'], (result) => {
            resolve(result.language || 'zh');
        });
    });
}

// 设置语言
export function setLanguage(lang) {
    return new Promise((resolve) => {
        chrome.storage.local.set({ language: lang }, () => {
            resolve(true);
        });
    });
}

// 获取翻译文本
export function t(key, lang = 'zh', params = {}) {
    const translation = translations[lang] || translations.zh;
    let text = translation[key] || key;

    // 替换参数占位符
    Object.keys(params).forEach(param => {
        text = text.replace(`{${param}}`, params[param]);
    });

    return text;
}

// 获取所有翻译（用于React组件）
export function getTranslations(lang = 'zh') {
    return translations[lang] || translations.zh;
}

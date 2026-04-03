/**
 * 语言切换组件
 * 支持中英文切换
 */

import { useState, useEffect } from 'react';
import { getCurrentLanguage, setLanguage } from '../i18n';
import './LanguageToggle.css';

export default function LanguageToggle({ onLanguageChange }) {
    const [lang, setLang] = useState('zh');

    useEffect(() => {
        loadLanguage();
    }, []);

    const loadLanguage = async () => {
        const savedLang = await getCurrentLanguage();
        setLang(savedLang);
        onLanguageChange?.(savedLang);
    };

    const toggleLanguage = async () => {
        const newLang = lang === 'zh' ? 'en' : 'zh';
        setLang(newLang);
        await setLanguage(newLang);
        onLanguageChange?.(newLang);
    };

    return (
        <button
            className="lang-toggle"
            onClick={toggleLanguage}
            title={lang === 'zh' ? 'Switch to English' : '切换到中文'}
            aria-label="Toggle language"
        >
            {lang === 'zh' ? 'EN' : '中'}
        </button>
    );
}

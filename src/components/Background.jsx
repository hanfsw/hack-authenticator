/**
 * 赛博朋克背景效果组件
 * 包含扫描线效果（深色模式显示）
 */

import { useEffect, useState } from 'react';
import './Background.css';

export default function Background() {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        // 监听主题变化
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    const currentTheme = document.documentElement.getAttribute('data-theme');
                    setTheme(currentTheme);
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme'],
        });

        // 初始主题
        setTheme(document.documentElement.getAttribute('data-theme') || 'dark');

        return () => observer.disconnect();
    }, []);

    return (
        <div className="background-container">
            {/* 扫描线效果（仅深色模式） */}
            {theme === 'dark' && <div className="scanline" />}

            {/* 网格背景 */}
            <div className="grid-background" />
        </div>
    );
}

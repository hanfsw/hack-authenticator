/**
 * 主题切换组件
 * 支持明暗主题切换，并保存用户偏好
 */

import { useState, useEffect } from 'react';
import { getTheme, saveTheme } from '../utils/storage';
import './ThemeToggle.css';

export default function ThemeToggle() {
    const [theme, setTheme] = useState('dark');
    const [isAnimating, setIsAnimating] = useState(false);

    // 初始化：加载保存的主题
    useEffect(() => {
        loadTheme();
    }, []);

    // 应用主题到document
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const loadTheme = async () => {
        const savedTheme = await getTheme();
        setTheme(savedTheme);
    };

    const toggleTheme = async () => {
        setIsAnimating(true);
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        await saveTheme(newTheme);

        // 动画完成后重置状态
        setTimeout(() => {
            setIsAnimating(false);
        }, 400);
    };

    return (
        <button
            className={`theme-toggle ${isAnimating ? 'animating' : ''}`}
            onClick={toggleTheme}
            title={`切换到${theme === 'dark' ? '浅色' : '深色'}模式`}
            aria-label="切换主题"
        >
            <div className="theme-toggle-track">
                <div className="theme-toggle-thumb">
                    {theme === 'dark' ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="12" r="5" />
                            <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                        </svg>
                    )}
                </div>
            </div>
        </button>
    );
}

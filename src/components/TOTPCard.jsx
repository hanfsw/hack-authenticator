/**
 * TOTP验证码卡片组件
 * 显示单个账号的验证码、倒计时和操作按钮
 */

import { useState, useEffect } from 'react';
import { generateCode, getRemainingSeconds, getProgress } from '../utils/totp';
import { getTranslations } from '../i18n';
import './TOTPCard.css';

export default function TOTPCard({ account, onEdit, onDelete, onViewQR, lang = 'zh' }) {
    const t = getTranslations(lang);
    const [code, setCode] = useState('------');
    const [remaining, setRemaining] = useState(30);
    const [progress, setProgress] = useState(0);
    const [copied, setCopied] = useState(false);

    // 更新验证码和倒计时
    useEffect(() => {
        updateCode();
        const interval = setInterval(updateCode, 1000);
        return () => clearInterval(interval);
    }, [account.secret]);

    const updateCode = () => {
        setCode(generateCode(account.secret));
        setRemaining(getRemainingSeconds());
        setProgress(getProgress());
    };

    const copyCode = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('复制失败:', error);
        }
    };

    const formatCode = (code) => {
        return code.slice(0, 3) + ' ' + code.slice(3);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).replace(/\//g, '-');
    };

    return (
        <div className="totp-card card">
            <div className="totp-card-header">
                <div className="totp-card-info">
                    {account.issuer && (
                        <div className="totp-card-issuer text-title">{account.issuer}</div>
                    )}
                    {(account.label || account.name) && (
                        <div className="totp-card-label text-muted">{account.label || account.name}</div>
                    )}
                    {account.notes && (
                        <div className="totp-card-notes">{account.notes}</div>
                    )}
                    {account.createdAt && (
                        <div className="totp-card-date">{formatDate(account.createdAt)}</div>
                    )}
                </div>
                <div className="totp-card-actions">
                    <button
                        className="btn-icon btn-secondary"
                        onClick={() => onViewQR?.()}
                        title="查看二维码"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                    </button>
                    <button
                        className="btn-icon btn-secondary"
                        onClick={onEdit}
                        title="编辑"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button
                        className="btn-icon btn-danger"
                        onClick={onDelete}
                        title="删除"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="totp-code-container">
                <div className="totp-code text-mono" onClick={copyCode} title="点击复制">
                    {formatCode(code)}
                </div>
                <button className="btn-copy" onClick={copyCode} title="复制验证码">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </button>
                {copied && (
                    <div className="copy-toast fade-in">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        已复制
                    </div>
                )}
            </div>

            <div className="totp-card-footer">
                <div className="progress">
                    <div
                        className="progress-bar"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="totp-timer text-muted">
                    {remaining}秒
                </div>
            </div>
        </div>
    );
}

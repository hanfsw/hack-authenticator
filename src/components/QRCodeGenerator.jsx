/**
 * 二维码生成器组件
 * 根据账号信息生成OTPAuth格式的二维码
 */

import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import './QRCodeGenerator.css';

export default function QRCodeGenerator({ account, onClose, lang = 'zh' }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (canvasRef.current && account) {
            generateQRCode();
        }
    }, [account]);

    const generateQRCode = async () => {
        // 构造OTPAuth URL
        const otpauthUrl = `otpauth://totp/${encodeURIComponent(account.issuer || 'Unknown')}:${encodeURIComponent(account.name)}?secret=${account.secret}&issuer=${encodeURIComponent(account.issuer || 'Unknown')}`;

        try {
            await QRCode.toCanvas(canvasRef.current, otpauthUrl, {
                width: 280,
                margin: 2,
                color: {
                    dark: '#00ff00',  // 绿色
                    light: '#0d1117'  // 深色背景
                }
            });
        } catch (error) {
            console.error('生成二维码失败:', error);
        }
    };

    return (
        <div className="qr-generator-overlay" onClick={onClose}>
            <div className="qr-generator-content card" onClick={(e) => e.stopPropagation()}>
                <div className="qr-generator-header">
                    <h3 className="text-title">{lang === 'zh' ? '绑定二维码' : 'Binding QR Code'}</h3>
                    <button className="btn-icon" onClick={onClose} title={lang === 'zh' ? '关闭' : 'Close'}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="qr-generator-body">
                    <div className="qr-info">
                        <div className="qr-info-item">
                            <span className="qr-info-label">{lang === 'zh' ? '发行者' : 'Issuer'}:</span>
                            <span className="qr-info-value">{account.issuer || (lang === 'zh' ? '未知' : 'Unknown')}</span>
                        </div>
                        <div className="qr-info-item">
                            <span className="qr-info-label">{lang === 'zh' ? '账号' : 'Account'}:</span>
                            <span className="qr-info-value">{account.name}</span>
                        </div>
                        {account.notes && (
                            <div className="qr-info-item">
                                <span className="qr-info-label">{lang === 'zh' ? '备注' : 'Notes'}:</span>
                                <span className="qr-info-value">{account.notes}</span>
                            </div>
                        )}
                    </div>

                    <div className="qr-code-wrapper">
                        <canvas ref={canvasRef} />
                    </div>

                    <p className="qr-hint text-muted">
                        {lang === 'zh'
                            ? '使用其他设备的身份验证器扫描此二维码即可绑定'
                            : 'Scan this QR code with another device\'s authenticator to bind'}
                    </p>
                </div>

                <div className="qr-generator-footer">
                    <button className="btn btn-secondary" onClick={onClose}>
                        {lang === 'zh' ? '关闭' : 'Close'}
                    </button>
                </div>
            </div>
        </div>
    );
}

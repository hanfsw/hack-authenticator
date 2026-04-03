/**
 * 二维码读取组件
 * 支持拖放上传和粘贴上传二维码图片
 */

import { useState, useRef, useEffect } from 'react';
import { readQRCode, isImageFile, checkImageSize } from '../utils/qrcode';
import { t } from '../i18n';
import './QRCodeReader.css';

export default function QRCodeReader({ onSuccess, onError, lang = 'zh' }) {
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleFile = async (file) => {
        if (!isImageFile(file)) {
            onError?.(t('errorQRFormat', lang));
            return;
        }

        if (!checkImageSize(file, 5)) {
            onError?.(t('errorQRSize', lang));
            return;
        }

        setIsProcessing(true);

        // 显示预览
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(file);

        // 读取二维码
        const result = await readQRCode(file);
        setIsProcessing(false);

        if (result) {
            onSuccess?.(result);
        } else {
            onError?.(t('errorQRRead', lang));
            setPreview(null);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFile(file);
        }
    };

    // 全局粘贴事件监听
    useEffect(() => {
        const onPaste = (e) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            for (const item of items) {
                if (item.type.indexOf('image') !== -1) {
                    const file = item.getAsFile();
                    if (file) {
                        e.preventDefault(); // 阻止默认粘贴行为
                        handleFile(file);
                        break;
                    }
                }
            }
        };

        document.addEventListener('paste', onPaste);
        return () => {
            document.removeEventListener('paste', onPaste);
        };
    }, []); // 仅在挂载时绑定

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    const clearPreview = () => {
        setPreview(null);
    };

    return (
        <div className="qr-reader-container">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />

            <div
                className={`qr-drop-zone ${isDragging ? 'dragging' : ''} ${isProcessing ? 'processing' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileSelect}
                tabIndex={0}
            >
                {preview ? (
                    <div className="qr-preview">
                        <img src={preview} alt="二维码预览" />
                        <button
                            className="qr-preview-close btn-icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                clearPreview();
                            }}
                        >
                            ×
                        </button>
                    </div>
                ) : (
                    <div className="qr-drop-content">
                        {isProcessing ? (
                            <>
                                <div className="spinner" />
                                <p>{t('qrProcessing', lang)}</p>
                            </>
                        ) : (
                            <>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-primary">{t('qrUploadHint', lang)}</p>
                                <p className="text-muted" style={{ fontSize: '12px' }}>{t('qrPasteHint', lang)}</p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * 添加账号组件 - 支持i18n和备注字段
 */

import { useState, useEffect } from 'react';
import QRCodeReader from './QRCodeReader';
import { validateSecret, formatSecret, cleanSecret } from '../utils/totp';
import { getTranslations } from '../i18n';
import './AddAccount.css';

export default function AddAccount({ onAdd, onCancel, initialData, lang = 'zh' }) {
    const t = getTranslations(lang);
    const [mode, setMode] = useState('manual');
    const [formData, setFormData] = useState({
        name: '',
        issuer: '',
        secret: '',
        notes: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                issuer: initialData.issuer || '',
                secret: formatSecret(initialData.secret || ''),
                notes: initialData.notes || '',
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSecretChange = (e) => {
        setFormData(prev => ({ ...prev, secret: e.target.value }));
        if (errors.secret) {
            setErrors(prev => ({ ...prev, secret: '' }));
        }
    };

    const handleSecretBlur = () => {
        if (formData.secret) {
            setFormData(prev => ({ ...prev, secret: formatSecret(prev.secret) }));
        }
    };

    const handleQRSuccess = (result) => {
        setFormData({
            name: result.label,
            issuer: result.issuer,
            secret: formatSecret(result.secret),
            notes: '',
        });
        setMode('manual');
    };

    const handleQRError = (message) => {
        setErrors({ qrcode: message });
        setTimeout(() => setErrors({}), 3000);
    };

    const validate = () => {
        const newErrors = {};
        // 账号名称改为可选，不再验证
        const cleanedSecret = cleanSecret(formData.secret);
        if (!cleanedSecret) {
            newErrors.secret = t.errorSecret;
        } else if (!validateSecret(cleanedSecret)) {
            newErrors.secret = t.errorSecretFormat;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);

        // 如果没有账号名称，尝试使用发行者或备注，否则留空
        let accountName = formData.name.trim();
        if (!accountName) {
            if (formData.issuer.trim()) {
                // 如果有发行者但没有名称，暂时保持空，或者你可以决定是否要用发行者填充
                // 这里我们按照用户要求：如果没有填，就不显示
            } else if (formData.notes.trim()) {
                accountName = formData.notes.trim().slice(0, 20);
            }
        }

        const account = {
            name: accountName,
            issuer: formData.issuer.trim(),
            label: accountName,
            secret: cleanSecret(formData.secret),
            notes: formData.notes.trim(),
        };

        const success = await onAdd(account);
        setIsSubmitting(false);

        if (success) {
            setFormData({ name: '', issuer: '', secret: '', notes: '' });
        }
    };

    return (
        <div className="add-account-container">
            <div className="add-account-header">
                <h2 className="text-title">{initialData ? t.editAccount : t.addAccount}</h2>
                <button className="btn-icon" onClick={onCancel} title={t.close}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="mode-toggle">
                <button className={`btn ${mode === 'manual' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setMode('manual')}>
                    {t.manualInput}
                </button>
                <button className={`btn ${mode === 'qrcode' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setMode('qrcode')}>
                    {t.scanQRCode}
                </button>
            </div>

            {mode === 'qrcode' ? (
                <div className="qrcode-mode">
                    <QRCodeReader onSuccess={handleQRSuccess} onError={handleQRError} lang={lang} />
                    {errors.qrcode && <div className="error-message fade-in">{errors.qrcode}</div>}
                </div>
            ) : (
                <form className="add-account-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="secret">{t.secretRequired}</label>
                        <input id="secret" name="secret" type="text" value={formData.secret} onChange={handleSecretChange} onBlur={handleSecretBlur} placeholder={t.secretPlaceholder} className={errors.secret ? 'error' : ''} />
                        {errors.secret && <div className="error-message">{errors.secret}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="issuer">{t.issuerLabel}</label>
                        <input id="issuer" name="issuer" type="text" value={formData.issuer} onChange={handleChange} placeholder={t.issuerPlaceholder} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="name">{t.accountNameLabel}</label>
                        <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} placeholder={t.accountNamePlaceholder} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="notes">{t.notesOptional}</label>
                        <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} placeholder={t.notesPlaceholder} rows="2" />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isSubmitting}>{t.cancel}</button>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? <><div className="spinner" />{t.adding}</> : initialData ? t.update : t.add}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

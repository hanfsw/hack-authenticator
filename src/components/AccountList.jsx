/**
 * 账号列表组件
 * 显示所有TOTP账号
 */

import { useState } from 'react';
import { Reorder } from 'framer-motion';
import TOTPCard from './TOTPCard';
import { t } from '../i18n';
import './AccountList.css';

export default function AccountList({ accounts, onEdit, onDelete, onViewQR, onReorder, lang = 'zh' }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredAccounts = accounts.filter(account => {
        const query = searchQuery.toLowerCase();
        return (
            account.name.toLowerCase().includes(query) ||
            account.issuer?.toLowerCase().includes(query) ||
            account.label?.toLowerCase().includes(query)
        );
    });

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    if (accounts.length === 0) {
        return (
            <div className="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <h3 className="text-title">{t('noAccounts', lang)}</h3>
                <p className="text-muted">{t('noAccountsHint', lang)}</p>
            </div>
        );
    }

    return (
        <div className="account-list-container">
            {accounts.length > 3 && (
                <div className="search-bar">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder={t('searchPlaceholder', lang)}
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>
            )}

            <div className="account-list">
                {filteredAccounts.length > 0 ? (
                    searchQuery ? (
                        // 搜索状态下不可排序
                        filteredAccounts.map(account => (
                            <TOTPCard
                                key={account.id}
                                account={account}
                                onEdit={() => onEdit(account)}
                                onDelete={() => onDelete(account)}
                                onViewQR={() => onViewQR?.(account)}
                                lang={lang}
                            />
                        ))
                    ) : (
                        // 正常状态下可排序
                        <Reorder.Group axis="y" values={accounts} onReorder={onReorder} className="reorder-group">
                            {accounts.map(account => (
                                <Reorder.Item key={account.id} value={account} style={{ listStyle: 'none' }}>
                                    <TOTPCard
                                        account={account}
                                        onEdit={() => onEdit(account)}
                                        onDelete={() => onDelete(account)}
                                        onViewQR={() => onViewQR?.(account)}
                                        lang={lang}
                                    />
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>
                    )
                ) : (
                    <div className="empty-search">
                        <p className="text-muted">{t('noSearchResults', lang)}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * 主应用组件
 * 整合所有功能模块
 */

import { useState, useEffect } from 'react';
import Background from './components/Background';
import ThemeToggle from './components/ThemeToggle';
import LanguageToggle from './components/LanguageToggle';
import AccountList from './components/AccountList';
import AddAccount from './components/AddAccount';
import QRCodeGenerator from './components/QRCodeGenerator';
import { getAccounts, addAccount, deleteAccount, updateAccount } from './utils/storage';
import { getTranslations } from './i18n';
import './App.css';

function App() {
  const [view, setView] = useState('list'); // 'list' 或 'add'
  const [accounts, setAccounts] = useState([]);
  const [editingAccount, setEditingAccount] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showQRCode, setShowQRCode] = useState(null);
  const [lang, setLang] = useState('zh');
  const t = getTranslations(lang);

  // 加载账号列表
  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    const data = await getAccounts();
    setAccounts(data);
  };

  const handleAddAccount = async (account) => {
    const success = await addAccount(account);
    if (success) {
      await loadAccounts();
      setView('list');
      return true;
    }
    return false;
  };

  const handleEditAccount = (account) => {
    setEditingAccount(account);
    setView('add');
  };

  const handleUpdateAccount = async (updates) => {
    if (editingAccount) {
      const success = await updateAccount(editingAccount.id, updates);
      if (success) {
        await loadAccounts();
        setEditingAccount(null);
        setView('list');
        return true;
      }
    }
    return false;
  };

  const handleReorder = async (newAccounts) => {
    setAccounts(newAccounts);
    await chrome.storage.local.set({ 'hack_auth_accounts': newAccounts });
  };

  const handleDeleteClick = (account) => {
    setShowDeleteConfirm(account);
  };

  const handleDeleteConfirm = async () => {
    if (showDeleteConfirm) {
      const success = await deleteAccount(showDeleteConfirm.id);
      if (success) {
        await loadAccounts();
      }
      setShowDeleteConfirm(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(null);
  };

  const handleAddClick = () => {
    setEditingAccount(null);
    setView('add');
  };

  const handleCancelAdd = () => {
    setEditingAccount(null);
    setView('list');
  };

  return (
    <div className="app">
      <Background />

      <div className="app-content">
        {/* Header */}
        <header className="app-header">
          <div className="app-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h1 className="text-title glitch-text">{t.appTitle}</h1>
          </div>
          <div className="app-header-actions">
            <LanguageToggle onLanguageChange={setLang} />
            <ThemeToggle />
          </div>
        </header>

        {/* Main Content */}
        <main className="app-main">
          {view === 'list' ? (
            <AccountList
              accounts={accounts}
              onEdit={handleEditAccount}
              onDelete={handleDeleteClick}
              onViewQR={(account) => setShowQRCode(account)}
              onReorder={handleReorder}
              lang={lang}
            />
          ) : (
            <AddAccount
              onAdd={editingAccount ? handleUpdateAccount : handleAddAccount}
              onCancel={handleCancelAdd}
              initialData={editingAccount}
              lang={lang}
            />
          )}
        </main>

        {/* Footer */}
        {view === 'list' && (
          <footer className="app-footer">
            <button
              className="btn btn-primary btn-glow"
              onClick={handleAddClick}
              style={{ width: '100%' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t.addNewAccount}
            </button>
          </footer>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={handleDeleteCancel}>
          <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-title">{t.confirmDelete}</h3>
            <p className="text-muted">
              {t.confirmDeleteMessage.replace('{name}', showDeleteConfirm.name)}
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={handleDeleteCancel}>
                {t.cancel}
              </button>
              <button className="btn btn-danger" onClick={handleDeleteConfirm}>
                {t.delete}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Generator Modal */}
      {showQRCode && (
        <QRCodeGenerator
          account={showQRCode}
          onClose={() => setShowQRCode(null)}
          lang={lang}
        />
      )}
    </div>
  );
}

export default App;

/**
 * Chrome Storage API 封装
 * 用于账号数据的持久化存储
 */

const STORAGE_KEY = 'hack_auth_accounts';
const THEME_KEY = 'hack_auth_theme';

/**
 * 获取所有账号
 * @returns {Promise<Array>} 账号列表
 */
export async function getAccounts() {
    try {
        const result = await chrome.storage.local.get([STORAGE_KEY]);
        return result[STORAGE_KEY] || [];
    } catch (error) {
        console.error('获取账号失败:', error);
        return [];
    }
}

/**
 * 保存账号列表
 * @param {Array} accounts - 账号列表
 * @returns {Promise<boolean>} 是否成功
 */
export async function saveAccounts(accounts) {
    try {
        await chrome.storage.local.set({ [STORAGE_KEY]: accounts });
        return true;
    } catch (error) {
        console.error('保存账号失败:', error);
        return false;
    }
}

/**
 * 添加新账号
 * @param {Object} account - 账号对象 {id, name, issuer, secret}
 * @returns {Promise<boolean>} 是否成功
 */
export async function addAccount(account) {
    const accounts = await getAccounts();
    const newAccount = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        ...account,
    };
    accounts.push(newAccount);
    return await saveAccounts(accounts);
}

/**
 * 更新账号
 * @param {string} id - 账号ID
 * @param {Object} updates - 更新的字段
 * @returns {Promise<boolean>} 是否成功
 */
export async function updateAccount(id, updates) {
    const accounts = await getAccounts();
    const index = accounts.findIndex(acc => acc.id === id);

    if (index === -1) {
        return false;
    }

    accounts[index] = {
        ...accounts[index],
        ...updates,
        updatedAt: new Date().toISOString(),
    };

    return await saveAccounts(accounts);
}

/**
 * 删除账号
 * @param {string} id - 账号ID
 * @returns {Promise<boolean>} 是否成功
 */
export async function deleteAccount(id) {
    const accounts = await getAccounts();
    const filtered = accounts.filter(acc => acc.id !== id);
    return await saveAccounts(filtered);
}

/**
 * 导出所有账号数据（JSON格式）
 * @returns {Promise<string>} JSON字符串
 */
export async function exportAccounts() {
    const accounts = await getAccounts();
    return JSON.stringify(accounts, null, 2);
}

/**
 * 导入账号数据
 * @param {string} jsonData - JSON字符串
 * @returns {Promise<boolean>} 是否成功
 */
export async function importAccounts(jsonData) {
    try {
        const accounts = JSON.parse(jsonData);

        if (!Array.isArray(accounts)) {
            throw new Error('格式错误：需要数组格式');
        }

        // 验证数据结构
        for (const acc of accounts) {
            if (!acc.name || !acc.secret) {
                throw new Error('格式错误：缺少必要字段');
            }
        }

        return await saveAccounts(accounts);
    } catch (error) {
        console.error('导入失败:', error);
        return false;
    }
}

/**
 * 获取主题设置
 * @returns {Promise<string>} 主题名称（'dark' 或 'light'）
 */
export async function getTheme() {
    try {
        const result = await chrome.storage.local.get([THEME_KEY]);
        return result[THEME_KEY] || 'dark';
    } catch (error) {
        console.error('获取主题失败:', error);
        return 'dark';
    }
}

/**
 * 保存主题设置
 * @param {string} theme - 主题名称
 * @returns {Promise<boolean>} 是否成功
 */
export async function saveTheme(theme) {
    try {
        await chrome.storage.local.set({ [THEME_KEY]: theme });
        return true;
    } catch (error) {
        console.error('保存主题失败:', error);
        return false;
    }
}

/**
 * 清空所有数据
 * @returns {Promise<boolean>} 是否成功
 */
export async function clearAllData() {
    try {
        await chrome.storage.local.clear();
        return true;
    } catch (error) {
        console.error('清空数据失败:', error);
        return false;
    }
}

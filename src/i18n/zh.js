export const zh = {
    // 标题
    appTitle: 'AUTHENTICATOR',

    // 主界面
    addNewAccount: '添加新账号',
    searchPlaceholder: '搜索账号...',

    // 空状态
    noAccounts: '还没有账号',
    noAccountsHint: '点击下方按钮添加你的第一个2FA账号',
    noSearchResults: '未找到匹配的账号',

    // 添加账号
    addAccount: '添加账号',
    editAccount: '编辑账号',
    close: '关闭',

    // 模式
    manualInput: '手动输入',
    scanQRCode: '扫描二维码',

    // 表单字段
    issuer: '发行者',
    issuerOptional: '发行者（可选）',
    issuerHint: '如：Google, GitHub, AWS',
    accountName: '账号名称',
    accountNameRequired: '账号名称*',
    accountNamePlaceholder: 'my-account@example.com',
    secret: '密钥',
    secretRequired: '密钥*',
    secretHint: 'Base32格式',
    secretPlaceholder: '输入密钥 (例如: JBSWY3...)',
    issuerLabel: '发行者 (选填)',
    issuerPlaceholder: '例如: Google, GitHub',
    accountNameLabel: '账号名称 (选填)',
    accountNamePlaceholder: '例如: admin@example.com',
    notesOptional: '备注 (选填)',
    notesPlaceholder: '添加备注信息（如：个人账号、公司账号等）',

    // 按钮
    cancel: '取消',
    add: '添加账号',
    update: '更新账号',
    delete: '删除',
    adding: '添加中...',

    // 二维码
    qrUploadHint: '点击上传或拖放二维码图片',
    qrPasteHint: '支持粘贴图片 (Ctrl/Cmd + V)',
    qrProcessing: '正在识别二维码...',

    // 错误信息
    errorAccountName: '请输入账号名称',
    errorSecret: '请输入密钥',
    errorSecretFormat: '密钥格式不正确（应为Base32格式）',
    errorQRFormat: '请上传图片文件（PNG、JPG、GIF、WebP）',
    errorQRSize: '图片文件过大，请上传小于5MB的图片',
    errorQRRead: '未能识别二维码，请确保图片清晰且包含有效的二维码',

    // 删除确认
    confirmDelete: '确认删除',
    confirmDeleteMessage: '确定要删除账号「{name}」吗？',

    // TOTP卡片
    copySuccess: '已复制',
    timeRemaining: '{seconds}秒',
    edit: '编辑',
    unknown: '未知',
    unnamedAccount: '未命名账号',

    // 主题
    switchTheme: '切换到{theme}模式',
    darkMode: '浅色',
    lightMode: '深色',
};

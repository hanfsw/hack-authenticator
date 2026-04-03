export const en = {
    // Title
    appTitle: 'AUTHENTICATOR',

    // Main interface
    addNewAccount: 'Add New Account',
    searchPlaceholder: 'Search accounts...',

    // Empty state
    noAccounts: 'No Accounts Yet',
    noAccountsHint: 'Click the button below to add your first 2FA account',
    noSearchResults: 'No matching accounts found',

    // Add account
    addAccount: 'Add Account',
    editAccount: 'Edit Account',
    close: 'Close',

    // Mode
    manualInput: 'Manual Input',
    scanQRCode: 'Scan QR Code',

    // Form fields
    issuer: 'Issuer',
    issuerOptional: 'Issuer (Optional)',
    issuerHint: 'e.g., Google, GitHub, AWS',
    accountName: 'Account Name',
    accountNameRequired: 'Account Name*',
    accountNamePlaceholder: 'my-account@example.com',
    secret: 'Secret Key',
    secretRequired: 'Secret Key*',
    secretHint: 'Base32 format',
    secretPlaceholder: 'Enter secret (e.g., JBSWY3...)',
    issuerLabel: 'Issuer (Optional)',
    issuerPlaceholder: 'e.g., Google, GitHub',
    accountNameLabel: 'Account Name (Optional)',
    accountNamePlaceholder: 'e.g., admin@example.com',
    notesOptional: 'Notes (Optional)',
    notesPlaceholder: 'Add notes (e.g., Personal, Work, etc.)',

    // Buttons
    cancel: 'Cancel',
    add: 'Add Account',
    update: 'Update Account',
    delete: 'Delete',
    adding: 'Adding...',

    // QR Code
    qrUploadHint: 'Click to upload or drag and drop QR code image',
    qrPasteHint: 'Supports paste (Ctrl/Cmd + V)',
    qrProcessing: 'Processing QR code...',

    // Error messages
    errorAccountName: 'Please enter account name',
    errorSecret: 'Please enter secret key',
    errorSecretFormat: 'Invalid secret key format (should be Base32)',
    errorQRFormat: 'Please upload an image file (PNG, JPG, GIF, WebP)',
    errorQRSize: 'Image file too large, please upload less than 5MB',
    errorQRRead: 'Failed to read QR code, please ensure the image is clear and contains a valid QR code',

    // Delete confirmation
    confirmDelete: 'Confirm Delete',
    confirmDeleteMessage: 'Are you sure you want to delete account "{name}"?',

    // TOTP card
    copySuccess: 'Copied',
    timeRemaining: '{seconds}s',
    edit: 'Edit',
    unknown: 'Unknown',
    unnamedAccount: 'Unnamed Account',

    // Theme
    switchTheme: 'Switch to {theme} mode',
    darkMode: 'light',
    lightMode: 'dark',
};

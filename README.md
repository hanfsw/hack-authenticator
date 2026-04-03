# Hack Authenticator - 赛博朋克风格的谷歌身份验证器

一个赛博朋克风格的 Chrome 浏览器插件，用于生成 TOTP（Time-based One-Time Password）动态验证码，支持各种需要二次验证的平台。

![Hack Authenticator](./public/icons/icon-128.png)

## ✨ 特性

### 🎨 Hack / 赛博朋克 UI 设计
- **深色模式**（默认）：深色背景 + 霓虹色（青色、紫色、绿色）
- **浅色模式**：浅色背景 + 赛博风格调色
- 一键明暗主题切换，保存用户偏好
- 扫描线动画、发光效果、故障特效
- 流畅的动画过渡效果

### 🔐 核心功能
- **TOTP 验证码生成**：6 位动态验证码，30 秒自动刷新
- **多种导入方式**：
  - 手动输入密钥（Base32 格式）
  - 粘贴/上传二维码图片自动识别
- **账号管理**：添加、编辑、删除、搜索、拖拽排序账号
- **查看绑定二维码**：生成账号对应的 OTPAuth 格式二维码，方便迁移到其他设备
- **一键复制**：点击验证码或复制按钮，快速复制到剪贴板
- **账号备注**：支持为账号添加备注信息，并显示创建时间
- **多语言支持**：支持中文 / English 切换，偏好持久化保存
- **数据持久化**：使用 chrome.storage.local 安全存储
- **隐私保护**：所有数据仅存储在本地，不发送任何网络请求

### 🛠 技术栈
- **前端框架**：React 19 + Vite
- **Chrome 扩展**：Manifest V3 + @crxjs/vite-plugin
- **TOTP 算法**：otpauth 库
- **二维码识别**：qr-scanner 库
- **二维码生成**：qrcode 库
- **动画**：Framer Motion + CSS 动画
- **字体**：JetBrains Mono + Orbitron

## 📦 安装使用

### 开发模式

1. **克隆项目**
```bash
git clone <repository-url>
cd google-authenticator-extension
```

2. **安装依赖**
```bash
npm install
```

3. **构建扩展**
```bash
npm run build
```

4. **加载到 Chrome**
   - 打开 Chrome 浏览器
   - 访问 `chrome://extensions/`
   - 启用「开发者模式」
   - 点击「加载已解压的扩展程序」
   - 选择项目的 `dist` 目录

> **提示**：由于依赖 `chrome.storage` API，插件必须以扩展形式加载，不支持直接浏览器预览（`npm run dev`）。每次修改代码后需重新执行 `npm run build`，然后在扩展管理页刷新。

### 生产构建

```bash
npm run build
```

构建完成后，`dist` 目录即为可分发的 Chrome 扩展。

## 🎯 使用指南

### 1. 添加账号

#### 方式一：手动输入
1. 点击底部「添加新账号」按钮
2. 选择「手动输入」模式
3. 填写以下信息：
   - **发行者**（可选）：如 Google、GitHub、AWS
   - **账号名称**：如 user@example.com
   - **密钥**：Base32 格式的密钥（从 2FA 设置页面获取）
   - **备注**（可选）：自定义备注信息
4. 点击「添加账号」

#### 方式二：扫描二维码
1. 点击底部「添加新账号」按钮
2. 选择「扫描二维码」模式
3. 上传或粘贴二维码图片
4. 自动识别并填充账号信息
5. 点击「添加账号」

### 2. 使用验证码
- 验证码每 30 秒自动刷新
- 点击验证码数字或右侧复制按钮，即可复制到剪贴板
- 进度条显示当前验证码的剩余有效时间

### 3. 管理账号
- **编辑**：点击账号卡片右上角的编辑（铅笔）按钮
- **删除**：点击删除（垃圾桶）按钮，弹窗确认后删除
- **搜索**：账号数量超过 4 个时，顶部显示搜索框，支持按发行者、账号名、标签模糊搜索
- **排序**：非搜索状态下，可直接拖拽账号卡片调整顺序，顺序自动保存

### 4. 查看绑定二维码
- 点击账号卡片右上角的二维码图标
- 弹出当前账号对应的 OTPAuth 格式二维码
- 使用其他设备的身份验证器扫描即可完成迁移绑定

### 5. 切换主题
- 点击右上角的主题切换按钮
- 在深色和浅色模式之间切换
- 主题偏好自动保存

### 6. 切换语言
- 点击右上角的语言切换按钮（`中` / `EN`）
- 支持中文和英文界面切换
- 语言偏好自动保存

## 📁 项目结构

```
google-authenticator-extension/
├── public/
│   └── icons/                  # 插件图标 (16/48/128px)
├── src/
│   ├── components/             # React 组件
│   │   ├── AccountList.jsx     # 账号列表（含搜索、拖拽排序）
│   │   ├── AddAccount.jsx      # 添加/编辑账号表单
│   │   ├── Background.jsx      # 赛博朋克背景动画
│   │   ├── LanguageToggle.jsx  # 中/英文切换
│   │   ├── QRCodeGenerator.jsx # 绑定二维码生成弹窗
│   │   ├── QRCodeReader.jsx    # 二维码图片识别
│   │   ├── ThemeToggle.jsx     # 明暗主题切换
│   │   └── TOTPCard.jsx        # 单账号 TOTP 卡片
│   ├── i18n/                   # 国际化
│   │   ├── index.js            # i18n 工具函数
│   │   ├── zh.js               # 中文翻译
│   │   └── en.js               # 英文翻译
│   ├── styles/                 # 全局样式
│   │   ├── animations.css      # 动画效果
│   │   ├── index.css           # 全局样式
│   │   └── themes.css          # 主题变量
│   ├── utils/                  # 工具函数
│   │   ├── qrcode.js           # 二维码解析工具
│   │   ├── storage.js          # chrome.storage API 封装
│   │   └── totp.js             # TOTP 算法封装
│   ├── App.jsx                 # 主应用组件
│   └── main.jsx                # 入口文件
├── manifest.json               # Chrome 扩展配置 (Manifest V3)
├── vite.config.js              # Vite 构建配置
└── package.json                # 依赖配置
```

## 🔧 开发

### 添加新功能
1. 在 `src/components/` 创建新组件及对应 CSS 文件
2. 在 `src/utils/` 添加工具函数
3. 新增多语言文本时，同步更新 `src/i18n/zh.js` 和 `src/i18n/en.js`
4. 在 `App.jsx` 中集成新组件

### 修改样式
- 主题变量：`src/styles/themes.css`
- 全局样式：`src/styles/index.css`
- 动画效果：`src/styles/animations.css`
- 各组件均有独立的 `.css` 文件（与 `.jsx` 同名）

### 构建配置
- Chrome 扩展配置：`manifest.json`
- Vite 配置：`vite.config.js`（使用 `@crxjs/vite-plugin`）

## 🧪 测试验证码准确性

使用已知测试密钥验证：
```javascript
// 测试密钥（RFC 6238 标准）
const testSecret = 'JBSWY3DPEHPK3PXP';
// 应生成与 Google Authenticator 相同的验证码
```

## 🛡 安全性

- ✅ 所有数据仅存储在本地（chrome.storage.local）
- ✅ 不发送任何网络请求
- ✅ 不收集用户信息
- ✅ 开源透明，可审计

## 📝 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

> ⚠️ **安全提示**：请妥善保管你的 2FA 密钥，不要与他人分享。丢失密钥可能导致无法访问你的账号。

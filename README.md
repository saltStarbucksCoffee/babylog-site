# 宝宝印记 BabyLog — 官网（GitHub Pages）

本目录是 App「宝宝印记（BabyLog）」的官方网站，纯静态、无构建步骤，可直接用 GitHub Pages 托管。

| 页面 | 文件 | 用途 |
|---|---|---|
| 营销首页 | `index.html` | App Store 营销 URL（可选）、对外介绍 |
| 技术支持 | `support.html` | App Store「支持 URL（Support URL）」必填 |
| 隐私政策 | `privacy.html` | App Store「隐私政策 URL」必填 |

三页均为中英双语（默认中文，右上角 EN 按钮切换，偏好记忆在浏览器本地）。截图在 `assets/` 下，由 App Store 预览图裁剪生成。

## 上线前必须替换的占位内容

全站搜索替换以下占位符：

1. **GitHub Issues 链接**：把 `https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO/issues` 替换为实际仓库 Issues 地址（出现在 `index.html`、`support.html`、`privacy.html` 的页脚与联系卡）。
2. **App Store 链接**：上架后在 `assets/site.js` 顶部把 `APP_STORE_URL` 改为实际链接（例如 `https://apps.apple.com/cn/app/idXXXXXXXXXX`）。未配置时下载按钮暂不可点。
3. **隐私政策生效日期**：`privacy.html` 中当前写的是 2026-09-20，如有调整请同步修改。

## 用 GitHub Pages 上线（推荐）

假设仓库名为 `babylog-site`、用户名为 `yourname`：

```sh
cd website
git init
git add .
git commit -m "BabyLog website"
git remote add origin https://github.com/yourname/babylog-site.git
git push -u origin main
```

然后在 GitHub 仓库页：**Settings → Pages → Source 选 `main` 分支 / `(root)` 目录 → Save**。
约一分钟后即可访问：

- 营销页：`https://yourname.github.io/babylog-site/`
- 支持 URL（填入 App Store Connect）：`https://yourname.github.io/babylog-site/support.html`
- 隐私政策 URL（填入 App Store Connect）：`https://yourname.github.io/babylog-site/privacy.html`

也可以把这三个文件放进现有项目仓库的 `docs/` 分支或 `gh-pages` 分支，只要保证上述三个路径可公开访问即可。

## 本地预览

```sh
cd website && python3 -m http.server 8080
# 浏览器打开 http://localhost:8080
```

## 设计说明

- 色板取自 App 的 DesignSystem Token（Design Baseline v3）：奶油底 `#F8F1E8`、鼠尾草绿 `#4A7D6A`、墨色 `#1F2A2E`、薄荷 `#DDEDE8`。
- 共享样式在 `assets/site.css`，共享脚本在 `assets/site.js`（语言切换 + App Store 链接注入）。
- Logo / favicon / apple-touch-icon 统一用 App 图标：`assets/app-icon.png`（180×180）。更新时从 `../BabyLog/Resources/App/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png` 重新生成：`sips -z 180 180 AppIcon-1024.png --out assets/app-icon.png`。
- 文案与 App Store Connect 上架信息（`../Docs/appstore/AppStoreConnect上架信息.md`）及 App 内 `PrivacyPolicyView` 保持一致；营销表述遵守产品医疗边界（不做智能分析、发烧判断等宣传）。

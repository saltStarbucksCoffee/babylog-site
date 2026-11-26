# 部署指南：用 GitHub Pages 上线宝宝印记官网

目标：把 `website/` 目录推到一个新的 GitHub 仓库，用 Pages 托管，得到三个可公开访问的网址，填进 App Store Connect。

---

## 第 0 步：占位符状态（2026-10-25 已处理）

三个 HTML 里的 `YOUR_GITHUB_USERNAME/YOUR_REPO` 已替换为 `saltstarbuckscoffee/babylog-site`。**需要把本次修改推送到 GitHub Pages 才会对线上生效**；推送后用 `curl -s https://saltstarbuckscoffee.github.io/babylog-site/support.html | grep YOUR_GITHUB` 确认无残留。

已处理（2026-11-25，E17）：

| 项 | 处理结果 |
|---|---|
| App Store 链接 | `assets/i18n.json` 的 `_meta.appStoreURL` 已是 `https://apps.apple.com/app/id6814028524`，`site.js` 自动注入到所有 `[data-appstore]` |
| 七语言 | 新增 `assets/i18n.json`（202 键 × 7 语言），三页改为 `data-i18n` + `<select class="lang-select">` |
| 过期口径 | 「免费 · 无内购」→「免费下载 · 含一次性 Pro」；FAQ iCloud 同步改为 Pro 权益；隐私政策生效日期 2026-11-25 / 1.1+ |
| 配图 | 5 张 App 截图按语言各一套：`assets/ui-*.{zh-Hans,zh-Hant,en,ja,ko}.jpg`（zh-TW/HK/MO 复用 zh-Hant），`data-i18n-src` 随语言换图 |

推送前本地自检：

```sh
python3 BabyLog/Scripts/check-website-i18n.py
python3 -m http.server 8080 --directory website   # 打开 http://localhost:8080/ 切换七语言
```

## 第 1 步：在 GitHub 上新建空仓库

1. 登录 GitHub → 右上角 **+** → **New repository**；
2. Repository name 填 `babylog-site`；
3. 选择 **Public**（重要：免费账号的 Pages 只对公开仓库开放）；
4. **不要**勾选 README / .gitignore / license（保持空仓库）；
5. 点 **Create repository**，创建后页面上的仓库地址形如 `https://github.com/<你的用户名>/babylog-site.git`。

## 第 2 步：本地推送（Terminal，在项目根目录执行）

```sh
cd /Users/jing/Coding/AppleDevProjects/parenting_work/website

git init
git add .
git commit -m "BabyLog website: home, support, privacy"
git branch -M main
git remote add origin https://github.com/<你的用户名>/babylog-site.git
git push -u origin main
```

可能遇到的问题：

- **首次使用 git**：先配置身份
  ```sh
  git config --global user.name "你的名字"
  git config --global user.email "你的邮箱"
  ```
- **推送要求登录**：密码不能用账号密码，用 Personal Access Token（GitHub → Settings → Developer settings → Tokens）或直接装 GitHub CLI 后 `gh auth login` 走浏览器授权。

## 第 3 步：开启 GitHub Pages

1. 打开仓库页面 → **Settings** → 左侧 **Pages**；
2. **Source** 选 `Deploy from a branch`；
3. **Branch** 选 `main`，目录选 `/ (root)`，点 **Save**；
4. 等 1–2 分钟，页面顶部会出现绿色提示，网址为：

```
https://<你的用户名>.github.io/babylog-site/
```

## 第 4 步：验证 + 填入 App Store Connect

逐个打开确认（语言切换、图片、锚点都正常）：

- 首页：`https://<你的用户名>.github.io/babylog-site/`
- 支持 URL → 填入 App Store Connect「支持 URL」：
  `https://<你的用户名>.github.io/babylog-site/support.html`
- 隐私政策 URL → 填入「隐私政策 URL」：
  `https://<你的用户名>.github.io/babylog-site/privacy.html`

## 以后更新网站

改完文件后在 `website/` 目录：

```sh
git add .
git commit -m "update website"
git push
```

推送后 Pages 会自动重新发布，约 1 分钟生效（浏览器可能有缓存，强刷 ⌘⇧R）。

## 自定义域名（可选）

如果以后买了域名（如 `babylog.app`）：仓库 Settings → Pages → Custom domain 填入域名，并在 `website/` 里加一个内容为域名的 `CNAME` 文件，再到域名服务商加一条 CNAME 记录指向 `<你的用户名>.github.io`。

# Architecture Portfolio — Nadia Sha

英文建筑作品集网站。纯 HTML / CSS / JavaScript，不需要构建步骤，也没有第三方依赖；`dist/` 就是网站本身。

## 当前阶段

图片来自你在 GitHub 的 `tmp/` 文件夹，复制到 `dist/assets/` 并改成网站使用的文件名（`tmp/` 本身不动）。5 个真实项目已显示真实图片，06–15 示例条目仍是模糊占位。

新增、改名或删除 `dist/assets/` 里的文件后，运行：

```sh
node scripts/media-manifest.mjs
```

它会把现有文件和像素尺寸写进 `content.js`：缺少的图片自动显示模糊占位，缺少的页面和 PDF 自动隐藏。

还缺：MOKA SUSHI 建成后的照片、Living Energy 的效果图与图纸、研究册第 7–22 页和气流动画、Collective Housing 的 10 张图纸、所有 PDF 原件。Theatre、Collective Housing 和 Living Energy 汇报的图分辨率偏低，有高清原图后替换即可。

## 与 GitHub 同步

这个文件夹就是 GitHub 仓库 `sy-space/arch`。在 GitHub 上传图片后，在文件夹里运行 `git pull` 拉到本地；本地修改后运行 `git add -A`、`git commit -m "说明"`、`git push` 推上去。`CLAUDE.md` 和 `style.md` 含有中文名，不会上传。

首页条目：

- 01 MOKA SUSHI：丹麦 Hobro 的个人落地项目（2026 年 2–7 月）。
- 02–05 四个真实 RESEARCH 项目：Living Energy、Theatre Built from Reclaimed Building Materials（2024 秋，奥胡斯）、Living a Ramp（EPFL EAST，与 Domingo Prada 合作，2024 春，Basel）、Collective Housing Aarhus（2023 年 9–12 月，简介待补充）。
- 06–15：10 个示例占位，不代表真实作品，页脚有说明。正式上线时隐藏，首页只显示真实项目。

网站只显示英文名 Nadia Sha。联系方式尚未提供。

## 预览

需要 Node.js 18 或更新版本。在项目文件夹运行：

```sh
node scripts/serve.mjs
```

打开 http://127.0.0.1:4180/ 。左下角的版本按钮可以在保存过的几个版本之间切换，页面位置和打开的项目保持不变。这个按钮只在本地预览里出现，不会上线。保存版本：`node scripts/snapshot.mjs 1-arial`（按钮上显示 ARIAL，数字只决定顺序）；给当前版本命名：`node scripts/snapshot.mjs --current "AFTER"`；清空：`node scripts/snapshot.mjs --clear`。

端口被占用时运行 `node scripts/serve.mjs 4181`。不要用 4173，那个端口你另有用途。修改文件后刷新浏览器即可，按 Ctrl+C 关闭。

## 修改内容

| 文件 | 用途 |
| --- | --- |
| `dist/content.js` | 15 个项目的标题、类别、图片、介绍、事实、文档和详情媒体顺序 |
| `dist/assets/` | 首页与详情图片、PDF、视频（素材到位后创建） |
| `dist/index.html` | 姓名、个人介绍、分类导航和页脚 |
| `dist/style.css`、`dist/compact.css` | 网格、间距、字体和手机适配（`compact.css` 覆盖 `style.css`） |
| `dist/app.js` | 项目显示、类别筛选、打开和关闭详情 |
| `CLAUDE.md` | 给 Claude Code 的长期设计与编辑要求 |
| `style.md` | 参考网站分析与已确认的设计方向 |

在 `content.js` 中：数组顺序就是首页顺序；`image` 是首页代表图；`focus`（可选，如 `'50% 30%'`）指定正方形裁切时保留画面的哪一部分；`media` 决定详情页图片与视频的顺序，每项可加 `w`、`h`（像素宽高），让长图加载时页面不跳动；`documents` 提供 PDF 原件入口。

每个项目有自己的链接，是项目名的小写连字符形式，例如 `http://127.0.0.1:4180/#moka-sushi`。改项目名会改变链接。类别值为 `research`、`projects` 或 `cross-disciplinary`。

首页所有代表图统一为正方形，用 `object-fit: cover` 裁切，模糊占位同样是方形；详情页图片保持原始比例连续展示。

## 放入真实材料时

- 照片导出为 WebP 或 JPG，不用 PNG。
- 同步更新图片说明 `alt`、来源 `credit`、正文、事实 `facts` 和备注 `note`。
- 保留准确的作者、摄影师、合作团队及个人职责；尚未提供的项目名称、地点、成果和联系方式不可编造。
- 所有照片和图纸都是本人作品。

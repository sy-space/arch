# 作品集

本项目是 个人建筑作品集网站，用 HTML、CSS 和 JavaScript 写成，无需构建，也无需安装依赖。整个网站放在 `dist/` 文件夹。

首页顶部一行放名字、三个分类和 CONTACT。下面是简介，再往下是贴满屏幕的方图墙：一行四张，文字在图下，Contact 占最后一格。

## 预览

需要 Node.js 18 或以上。在项目文件夹运行：

```sh
node scripts/serve.mjs
```

浏览器打开 http://127.0.0.1:4182/ 。改完文件刷新页面，Ctrl+C 关闭。4182 被占用时改用 `node scripts/serve.mjs 4183`。4173 留给另一个工具。

对比两种改法前，先运行 `node scripts/snapshot.mjs 1-old` 存一份。预览页左下角随即出现版本按钮，点击即可切换，页面位置不变。`--current "NEW"` 给当前版本命名，`--clear` 清空全部存档。按钮只在本地预览出现，不进网站。

## 项目和图片

首页现有 15 个条目，01 到 05 是真实作品：

06 到 15 是示例，显示为模糊方块，页脚注明它们并非真实作品。上线前从首页移除。

原图存放在 GitHub 的 `tmp/` 文件夹。本项目把可用的图复制到 `dist/assets/`，按 `content.js` 需要的名字改名，`tmp/` 原样保留。MOKA SUSHI、Living a Ramp 和 Theatre 的首页图从页面裁出正方形，文件名为 `cover.jpg`。

在 `dist/assets/` 加图、改名或删图之后，运行：

```sh
node scripts/media-manifest.mjs
```

脚本把现有文件和像素尺寸写进 `content.js`。缺图的项目显示模糊方块，缺失的页面和 PDF 不显示。

仍缺的材料：

- MOKA SUSHI 建成后的照片。项目介绍已提到照片，照片到位后再决定这句的去留。
- Living Energy 的效果图和图纸、研究册第 7 到 22 页、气流动画。
- Collective Housing 的 10 张正式图纸，以及全部 PDF 原件。

Theatre、Collective Housing 和 Living Energy 0622 汇报的图尺寸偏小，大屏上发糊。拿到高清原图后替换。

## 改内容

| 文件 | 内容 |
| --- | --- |
| `dist/content.js` | 15 个项目的标题、类别、图片、介绍、信息表、PDF 和详情页图片顺序 |
| `dist/assets/` | 网站使用的图片、PDF、视频 |
| `tmp/` | 上传的原图，不可删除 |
| `dist/index.html` | 名字、简介、分类、Contact 格和页脚，联系方式填在这里 |
| `dist/style.css` | 图墙、间距、字体和手机排版 |
| `dist/app.js` | 方图、筛选、详情页、图片计数和左右键切换 |
| `scripts/media-manifest.mjs` | 登记 `dist/assets/` 里的文件和尺寸 |
| `CLAUDE.md`、`style.md` | 给 Claude 的要求和设计记录，只留本地，不上传 |

`content.js` 里数组的顺序就是首页顺序。每个项目包含这些字段：

- `image`：首页那张图。
- `focus`：可选，例如 `'50% 30%'`，决定正方形裁掉画面哪一侧。
- `media`：详情页图片和视频的顺序。
- `documents`：PDF 原件。

类别只有三个值：`research`、`projects`、`cross-disciplinary`。

每个项目有独立链接，由项目名转成小写加连字符，例如 `http://127.0.0.1:4182/#moka-sushi`。项目名改动，链接随之改变。

首页图统一裁成正方形。详情页的图保留原比例，一张接一张往下排。

## 与 GitHub 同步

项目文件夹即公开仓库 `sy-space/arch`。GitHub 上传新图后，运行 `git pull` 拉到本地。本地改完，运行三行推送：

```sh
git add -A
git commit -m "写明改了什么"
git push
```

`CLAUDE.md` 和 `style.md` 含中文名，`.gitignore` 将它们挡在仓库之外。

## 放入真实材料

- 照片导出为 WebP 或 JPG，不用 PNG。
- 换图时同步修改图片说明 `alt`、正文和信息表。
- 作者、摄影师、合作者和个人职责照实填写。未提供的地点、成果和联系方式留空，不编造。
- 所有照片和图纸均为 本人作品。 

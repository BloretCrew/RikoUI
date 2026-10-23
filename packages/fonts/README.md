# Riko UI Fonts ✦ `@bloret-crew/riko-ui-fonts`

Riko UI 使用的字体，自托管版本：不依赖 Google Fonts，可放在任意服务器或 CDN 上，全球与中国大陆均可访问。

| 字体 | 字重 | 用途 |
|---|---|---|
| ZCOOL XiaoWei | 400 | 标题 `--riko-font-title` |
| Noto Sans SC | 400 / 500 / 700 | 正文 `--riko-font-body` |
| Noto Serif SC | 400 / 600 | 长文阅读 `--riko-font-read` |
| Caveat | 500 / 600 / 700 | 手写点缀 `--riko-font-hand` |

所有字体都是 woff2 + `unicode-range` 分片（共 600 余个文件），浏览器只下载页面实际用到的字符所在分片，通常只有几百 KB。

```js
import '@bloret-crew/riko-ui-fonts/riko-fonts.css';
```

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@bloret-crew/riko-ui-fonts@0/riko-fonts.css">
```

自托管：把整个包目录（`riko-fonts.css` + `files/`）原样上传即可，CSS 中均为相对路径。

**修正说明**：ZCOOL XiaoWei 原版有轮廓方向缺陷，浏览器中「回」「圄」「圃」等字会显示为实心方块。本包已修正这些字形（未改动设计），详见 `LICENSES/MODIFICATIONS.txt`。

## 许可

所有字体均为 **SIL Open Font License 1.1**：可免费商用、嵌入网页与应用、再分发和修改；唯一限制是不能单独出售字体本身，修改版需继续使用 OFL，且不得使用保留字体名。

| 字体 | 版权方 | 保留字体名 | 本包是否修改 |
|---|---|---|---|
| ZCOOL XiaoWei | The ZCOOL XiaoWei Project Authors | 无 | 是：修正部分字形轮廓方向（见 `LICENSES/MODIFICATIONS.txt`），未改名称与设计 |
| Noto Sans SC | Adobe | Source | 否（仅转为 woff2 分片） |
| Noto Serif SC | Google | 无 | 否（仅转为 woff2 分片） |
| Caveat | The Caveat Project Authors | 无 | 否（仅转为 woff2 分片） |

完整许可证与版权声明见 `LICENSES/`。

# MD2PPT AI 生成指南 (AI Generation Guide)

專案網址：https://github.com/eric861129/MD2PPT-Evolution

本指南旨在協助 AI 模型 (ChatGPT, Claude, Gemini) 生成完全相容於 **MD2PPT-Evolution v0.10+** 的 Markdown 簡報代碼。

## 1. 核心結構 (Core Structure)

### 1.1 全域設定 (Global Frontmatter)
**必須**位於文件第一行。

✅ **正確範例：**
```markdown
---
theme: amber
transition: slide
title: 簡報標題
author: 講者名稱
---
```

須注意 一定要有起始 --- 與 結束--- 於全域設定

### 1.2 分頁符號 (Slide Separator)
使用 `===` 作為強制分頁。
**關鍵規則：** `===` 前後建議保留空行，且**緊接其後**的必須是該頁的設定區塊或內容。

✅ **正確範例：**
```markdown
# 第一頁內容...

===

---
layout: grid
columns: 2
---

# 第二頁內容...
```

❌ **錯誤範例：**
- `===` 後面沒有換行直接接 `---` (雖然解析器支援，但建議換行以利閱讀)。
- 在 `---` 設定區塊前插入了文字內容。

## 2. 頁面設定 (Slide Configuration)

每一頁的頂部（`===` 之後）**必須**包含 YAML 設定。即使沒有特殊設定，也請加上 `layout: default`。

### 支援參數
| 參數     | 說明      | 選項                                                                  |
| :------- | :-------- | :-------------------------------------------------------------------- |
| `layout` | 版面配置  | `default`, `impact`, `center`, `grid`, `two-column`, `quote`, `alert` |
| `bg`     | 背景模式  | `mesh` (網格), `#HEX` (純色), 或圖片 URL                              |
| `mesh`   | Mesh 設定 | 當 `bg: mesh` 時使用。包含 `colors` (陣列) 與 `seed` (數字)           |

✅ **Mesh 背景範例：**
```yaml
---
layout: impact
bg: mesh
mesh:
  colors: ["#FF5733", "#33FF57", "#3357FF"]
  seed: 12345
---
```

✅ **純色背景範例 (簡約風格)：**
```yaml
---
layout: center
bg: "#1e293b" # 深藍灰色
---
```

## 3. 元件語法 (Component Syntax)

### 3.1 圖表 (Charts)
使用 `::: chart-type` 語法。**必須**包含 JSON 設定與 Markdown 表格。

### ⚠️ 致命錯誤預防 (Critical Syntax Rules)
**圖表語法對「空行」極度敏感。請務必遵守：**
1. `::: chart-xxx {json}` 後面**必須空一行**。
2. 表格結束後，**必須空一行**，才能寫結尾的 `:::`。

✅ **正確範例 (Correct)：**
```markdown
::: chart-pie { "title": "銷售數據", "showLegend": true }

| 季度 | 營收 |
| :--- | :--- |
| Q1   | 100  |
| Q2   | 200  |

:::
```

❌ **錯誤範例 (Incorrect - Do NOT do this)：**
```markdown
::: chart-pie { "title": "錯誤示範" }
| 季度 | 營收 | <-- 錯誤：這裡少了一個空行 |
| :--- | :--- |
| Q1   | 100  |
:::               <-- 錯誤：這裡少了一個空行
```

### 3.2 雙欄內容 (Two-Column)
當 `layout: two-column` 時，使用 `:: right ::` 分隔左右欄。

### ⚠️ 致命錯誤預防
**`:: right ::` 前後必須有空行**，否則會被視為普通文字，導致分欄失敗。

✅ **正確範例：**
```markdown
# 左側標題
左側內容...


:: right ::


# 右側標題
右側內容...
```

### ⚠️ 右側標題的#與左側標題要相同

✅ **正確範例：**

```markdown
# 左側標題
左側內容...


:: right ::


# 右側標題
右側內容...
```

❌ 錯誤範例

```markdown
## 左側標題
左側內容...


:: right ::


### 右側標題
右側內容...
```

### 3.3 警示框 (Alert/Callout)
使用 `::: alert` 或標準的 Blockquote Callout。

✅ **正確範例：**
```markdown
::: alert
**這是一個重要的警告訊息！**
:::
```

## 5. 專業配色盤 (Pro Color Palettes)

請 AI 參考以下配色組合生成 `mesh.colors`，避免隨機生成導致的不協調。

### 科技/深色 (Cyber/Dark)
- **Midnight Blue**: `["#0F172A", "#312E81", "#4338CA"]`
- **Neon Cyber**: `["#111827", "#7C3AED", "#DB2777"]`

### 溫暖/活力 (Warm/Vibrant)
- **Sunset**: `["#FFF7ED", "#FB923C", "#EA580C"]`
- **Amber Gold**: `["#FFFBEB", "#F59E0B", "#D97706"]`

### 專業/穩重 (Professional/Clean)
- **Ocean**: `["#F0F9FF", "#38BDF8", "#0284C7"]`
- **Nature**: `["#F0FDF4", "#4ADE80", "#16A34A"]`

### 漸層種子建議 (Seed)
- 使用 1000~9999 之間的整數，避免使用過小或過大的數值。

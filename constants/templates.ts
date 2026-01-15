/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

export const ACTION_TEMPLATES = {
  // Structure
  INSERT_SLIDE: `

===
---
layout: default
---

# $cursor`,
  
  // Layouts
  LAYOUT_GRID: `

===
---
layout: grid
columns: 2
---

# Grid Slide

Column 1 content...

Column 2 content...$cursor`,
  LAYOUT_QUOTE: `

===
---
layout: quote
---

> "$cursor"
- Author`,
  LAYOUT_ALERT: `

===
---
layout: alert
---

# Alert Title

$cursor`,
  
  // Components
  INSERT_TABLE: `

::: table-modern
| Header 1 | Header 2 |
| :--- | :--- |
| $cursor | Cell 2 |
:::

`,
  INSERT_IMAGE: `![$cursor](https://source.unsplash.com/random/800x600)`,
  INSERT_NOTE: `

<!-- note:
$cursor
-->
`
};


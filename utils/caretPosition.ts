/**
 * MD2PPT-Evolution
 * Caret Position Utility (Optimized)
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

export interface CaretPosition {
  top: number;
  left: number;
  lineHeight: number;
}

/**
 * Creates and returns a mirror div for measuring coordinates in a textarea.
 * Reusing this div is much faster than creating it every time.
 */
let mirrorDiv: HTMLDivElement | null = null;

function getMirrorDiv(element: HTMLTextAreaElement): HTMLDivElement {
  if (!mirrorDiv) {
    mirrorDiv = document.createElement('div');
    mirrorDiv.style.position = 'absolute';
    mirrorDiv.style.visibility = 'hidden';
    mirrorDiv.style.whiteSpace = 'pre-wrap';
    mirrorDiv.style.wordWrap = 'break-word';
    mirrorDiv.style.top = '0';
    mirrorDiv.style.left = '0';
    document.body.appendChild(mirrorDiv);
  }

  const style = window.getComputedStyle(element);
  const properties = [
    'direction', 'boxSizing', 'width', 'height', 'overflowX', 'overflowY',
    'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderStyle',
    'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
    'fontStyle', 'fontVariant', 'fontWeight', 'fontStretch', 'fontSize', 'fontSizeAdjust', 'lineHeight', 'fontFamily',
    'textAlign', 'textTransform', 'textIndent', 'textDecoration', 'letterSpacing', 'wordSpacing', 'tabSize', 'MozTabSize'
  ];

  properties.forEach(prop => {
    // @ts-ignore
    mirrorDiv!.style[prop] = style[prop];
  });

  return mirrorDiv!;
}

/**
 * Calculates multiple caret positions in one go to minimize DOM thrashing.
 */
export function getBatchCaretCoordinates(element: HTMLTextAreaElement, positions: number[]): CaretPosition[] {
  if (positions.length === 0) return [];
  
  const div = getMirrorDiv(element);
  const elementRect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  const lineHeight = parseInt(style.lineHeight) || parseInt(style.fontSize) * 1.2;
  const scrollTop = element.scrollTop;
  const scrollLeft = element.scrollLeft;

  const results: CaretPosition[] = [];
  const text = element.value;

  // We can't easily measure all at once by just appending spans because content 
  // needs to be exact up to the point.
  // But we can measure them sequentially without re-calculating styles or re-appending the div.
  
  for (const pos of positions) {
    div.textContent = text.substring(0, pos);
    const span = document.createElement('span');
    span.textContent = text.substring(pos, pos + 1) || '.';
    div.appendChild(span);
    
    results.push({
      top: elementRect.top + span.offsetTop - scrollTop,
      left: elementRect.left + span.offsetLeft - scrollLeft,
      lineHeight
    });
    
    div.removeChild(span);
  }

  return results;
}

/**
 * Legacy single version (now uses the optimized pool)
 */
export function getCaretCoordinates(element: HTMLTextAreaElement, position: number): CaretPosition {
  return getBatchCaretCoordinates(element, [position])[0];
}
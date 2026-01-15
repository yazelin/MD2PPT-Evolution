/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

export class EditorActionService {
  private textarea: HTMLTextAreaElement;

  constructor(textarea: HTMLTextAreaElement) {
    this.textarea = textarea;
  }

  /**
   * Inserts text at the current cursor position.
   * Supports $cursor placeholder to position the cursor after insertion.
   * Requires setContent callback to update React state.
   */
  insertText(template: string, setContent: (val: string) => void): void {
    if (!this.textarea) return;

    const start = this.textarea.selectionStart;
    const end = this.textarea.selectionEnd;
    
    // 1. Handle Placeholder
    const cursorPlaceholder = '$cursor';
    const cursorIndex = template.indexOf(cursorPlaceholder);
    const textToInsert = template.replace(cursorPlaceholder, '');

    // 2. Execute Edit
    // Using setRangeText preserves undo history in some browsers, but React state needs explicit update.
    this.textarea.setRangeText(textToInsert, start, end, 'select');
    
    // Trigger React update
    // We construct the new value manually to pass to setContent
    const currentValue = this.textarea.value; // setRangeText updates the value property
    setContent(currentValue);

    // 3. Reposition Cursor
    if (cursorIndex >= 0) {
      const newCursorPos = start + cursorIndex;
      this.textarea.setSelectionRange(newCursorPos, newCursorPos);
    } else {
        // If no placeholder, place cursor at the end of insertion
        const newCursorPos = start + textToInsert.length;
        this.textarea.setSelectionRange(newCursorPos, newCursorPos);
    }
    
    this.textarea.focus();
  }

  /**
   * Wraps the currently selected text with prefix and suffix.
   */
  wrapText(prefix: string, suffix: string, setContent: (val: string) => void): void {
    if (!this.textarea) return;
    
    const start = this.textarea.selectionStart;
    const end = this.textarea.selectionEnd;
    const text = this.textarea.value;
    const selectedText = text.substring(start, end);
    
    const newText = `${prefix}${selectedText}${suffix}`;
    
    this.textarea.setRangeText(newText, start, end, 'select');
    setContent(this.textarea.value);
    
    // If no text was selected, place cursor between tags
    if (start === end) {
        const newCursorPos = start + prefix.length;
        this.textarea.setSelectionRange(newCursorPos, newCursorPos);
    }
    
    this.textarea.focus();
  }
}
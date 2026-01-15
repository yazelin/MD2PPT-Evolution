import { describe, it, expect, vi } from 'vitest';
import { fileToBase64 } from '../utils/imageUtils';

describe('Image Utils - Drag and Drop Support', () => {
  it('should convert File to Base64', async () => {
    // Mock FileReader
    const mockResult = 'data:image/png;base64,mockdata';
    const originalFileReader = global.FileReader;
    
    // Simple mock implementation
    class MockFileReader {
      onload: any;
      onerror: any;
      result: any;
      readAsDataURL() {
        this.result = mockResult;
        if (this.onload) this.onload();
      }
    }
    
    global.FileReader = MockFileReader as any;

    const file = new File([''], 'test.png', { type: 'image/png' });
    const result = await fileToBase64(file);
    
    expect(result).toBe(mockResult);
    
    // Restore
    global.FileReader = originalFileReader;
  });
});

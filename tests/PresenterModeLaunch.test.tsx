import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { usePresenterMode } from '../hooks/usePresenterMode';
import { PresentationSyncService } from '../services/PresentationSyncService';

// Mock PresentationSyncService
vi.mock('../services/PresentationSyncService', () => ({
  PresentationSyncService: vi.fn(function() {
    return {
      sendMessage: vi.fn(),
      close: vi.fn()
    };
  })
}));

describe('usePresenterMode', () => {
  const originalOpen = window.open;
  const mockOpen = vi.fn();

  beforeEach(() => {
    window.open = mockOpen;
    vi.clearAllMocks();
  });

  afterEach(() => {
    window.open = originalOpen;
  });

  it('should open a new window when startPresentation is called', () => {
    const { result } = renderHook(() => usePresenterMode());

    act(() => {
      result.current.startPresentation();
    });

    // Expect window.open to be called
    // URL should be compatible with hash router or relative path
    // For now, let's assume it opens a relative path that we'll handle
    expect(mockOpen).toHaveBeenCalled();
    const url = mockOpen.mock.calls[0][0];
    expect(url).toMatch(/audience/); // Should contain 'audience' in path or query
  });

  it('should initialize PresentationSyncService when starting presentation', () => {
    const { result } = renderHook(() => usePresenterMode());

    act(() => {
      result.current.startPresentation();
    });

    expect(PresentationSyncService).toHaveBeenCalled();
  });
});

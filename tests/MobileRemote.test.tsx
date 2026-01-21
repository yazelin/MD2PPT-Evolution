import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MobileRemote } from '../components/presenter/MobileRemote';

// Mock PeerJS or RemoteControlService
const mockSend = vi.fn();
const mockConn = {
  send: mockSend,
  on: vi.fn(),
  close: vi.fn(),
  open: true // Must be true for sendAction to work
};

const mockPeer = {
  connect: vi.fn().mockReturnValue(mockConn),
  on: vi.fn(),
  destroy: vi.fn()
};

vi.mock('peerjs', () => ({
  default: vi.fn(),
  Peer: vi.fn(function() {
    return mockPeer;
  })
}));

describe('MobileRemote', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.location for peer ID extraction
    delete (window as any).location;
    (window as any).location = new URL('http://localhost/#/remote?peer=test-peer-id');
  });

  it('connects to the peer specified in the URL', () => {
    render(<MobileRemote />);
    
    // Simulate peer open
    const openCallback = mockPeer.on.mock.calls.find(call => call[0] === 'open')[1];
    act(() => {
      openCallback('my-mobile-id');
    });

    expect(mockPeer.connect).toHaveBeenCalledWith('test-peer-id');
  });

  it('sends NEXT action when Next button is clicked', () => {
    render(<MobileRemote />);
    
    // 1. Peer opens
    const openCallback = mockPeer.on.mock.calls.find(call => call[0] === 'open')[1];
    act(() => { openCallback('my-mobile-id'); });

    // 2. Connection opens (critical to enable buttons)
    const connOpenCallback = mockConn.on.mock.calls.find(call => call[0] === 'open')[1];
    act(() => { connOpenCallback(); });
    
    const nextBtn = screen.getByLabelText(/Next/i);
    fireEvent.click(nextBtn);

    expect(mockSend).toHaveBeenCalledWith({ action: 'NEXT' });
  });

  it('sends PREV action when Previous button is clicked', () => {
    render(<MobileRemote />);
    
    // 1. Peer opens
    const openCallback = mockPeer.on.mock.calls.find(call => call[0] === 'open')[1];
    act(() => { openCallback('my-mobile-id'); });

    // 2. Connection opens
    const connOpenCallback = mockConn.on.mock.calls.find(call => call[0] === 'open')[1];
    act(() => { connOpenCallback(); });
    
    const prevBtn = screen.getByLabelText(/Previous/i);
    fireEvent.click(prevBtn);

    expect(mockSend).toHaveBeenCalledWith({ action: 'PREV' });
  });
});

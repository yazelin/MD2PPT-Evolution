import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RemoteControlService } from '../services/RemoteControlService';

// Mock PeerJS
const mockPeer = {
  on: vi.fn(),
  disconnect: vi.fn(),
  destroy: vi.fn(),
  id: 'test-peer-id'
};

vi.mock('peerjs', () => ({
  default: vi.fn(),
  Peer: vi.fn(function() {
    return mockPeer;
  })
}));

describe('RemoteControlService', () => {
  let service: RemoteControlService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new RemoteControlService();
  });

  it('should initialize Peer', () => {
    expect(mockPeer.on).toHaveBeenCalledWith('open', expect.any(Function));
    expect(mockPeer.on).toHaveBeenCalledWith('connection', expect.any(Function));
  });

  it('should trigger onReady when Peer ID is available', () => {
    const readyHandler = vi.fn();
    service.onReady(readyHandler);

    // Simulate 'open' event
    const openCallback = mockPeer.on.mock.calls.find(call => call[0] === 'open')[1];
    openCallback('real-peer-id');

    expect(readyHandler).toHaveBeenCalledWith('real-peer-id');
  });

  it('should register command handlers and trigger them on data', () => {
    const commandHandler = vi.fn();
    service.onCommand(commandHandler);

    // Simulate 'connection' event
    const connectionCallback = mockPeer.on.mock.calls.find(call => call[0] === 'connection')[1];
    const mockConn = {
      on: vi.fn()
    };
    connectionCallback(mockConn);

    // Simulate 'data' event on the connection
    const dataCallback = mockConn.on.mock.calls.find(call => call[0] === 'data')[1];
    const testData = { action: 'NEXT' };
    dataCallback(testData);

    expect(commandHandler).toHaveBeenCalledWith(testData);
  });
});

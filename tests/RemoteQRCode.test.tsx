import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RemoteQRCodeModal } from '../components/presenter/RemoteQRCodeModal';
import QRCode from 'qrcode';

// Mock QRCode
vi.mock('qrcode', () => ({
  default: {
    toDataURL: vi.fn().mockResolvedValue('data:image/png;base64,mock')
  }
}));

describe('RemoteQRCodeModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generates a URL with the provided peerId', async () => {
    const peerId = 'test-123';
    render(<RemoteQRCodeModal peerId={peerId} isOpen={true} onClose={() => {}} />);

    // Check if QRCode.toDataURL was called with a URL containing the peerId
    await waitFor(() => {
      expect(QRCode.toDataURL).toHaveBeenCalledWith(
        expect.stringContaining(`peer=${peerId}`),
        expect.any(Object)
      );
    });
  });

  it('renders nothing if not open', () => {
    const { container } = render(<RemoteQRCodeModal peerId="test" isOpen={false} onClose={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });
});

/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import { Peer, DataConnection } from 'peerjs';

export class RemoteControlClient {
  private peer: Peer | null = null;
  private conn: DataConnection | null = null;
  private onDataCallback: ((data: any) => void) | null = null;
  private onStatusCallback: ((status: string) => void) | null = null;

  constructor(private targetPeerId: string) {
    this.initialize();
  }

  private initialize(): void {
    this.peer = new Peer();

    this.peer.on('open', () => {
      this.setStatus('Connecting...');
      this.connect();
    });

    this.peer.on('error', (err) => {
      console.error('Peer error:', err);
      this.setStatus('Connection Error');
    });
  }

  private connect(): void {
    if (!this.peer) return;

    this.conn = this.peer.connect(this.targetPeerId);

    this.conn.on('open', () => {
      this.setStatus('Connected');
    });

    this.conn.on('data', (data) => {
      if (this.onDataCallback) this.onDataCallback(data);
    });

    this.conn.on('close', () => {
      this.setStatus('Disconnected');
    });
  }

  public sendAction(action: string, payload?: any): void {
    if (this.conn && this.conn.open) {
      this.conn.send({ action, payload });
    }
  }

  public onData(callback: (data: any) => void): void {
    this.onDataCallback = callback;
  }

  public onStatus(callback: (status: string) => void): void {
    this.onStatusCallback = callback;
  }

  private setStatus(status: string): void {
    if (this.onStatusCallback) this.onStatusCallback(status);
  }

  public close(): void {
    this.conn?.close();
    this.peer?.destroy();
  }
}

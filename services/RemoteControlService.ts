/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import { Peer, DataConnection } from 'peerjs';

export interface RemoteCommand {
  action: string;
  payload?: any;
}

export type CommandHandler = (command: RemoteCommand) => void;
export type ReadyHandler = (peerId: string) => void;

export class RemoteControlService {
  private peer: Peer | null = null;
  private connections: DataConnection[] = [];
  private commandHandlers: CommandHandler[] = [];
  private readyHandlers: ReadyHandler[] = [];
  private peerId: string | null = null;
  public activeConnections: DataConnection[] = [];

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    // Initialize PeerJS
    this.peer = new Peer();

    this.peer.on('open', (id) => {
      this.peerId = id;
      this.readyHandlers.forEach(handler => handler(id));
    });

    this.peer.on('connection', (conn) => {
      this.handleConnection(conn);
    });

    this.peer.on('error', (err) => {
      console.error('PeerJS error:', err);
    });
  }

  private handleConnection(conn: DataConnection): void {
    this.activeConnections.push(conn);

    conn.on('data', (data) => {
      if (data && typeof data === 'object') {
        const command = data as RemoteCommand;
        this.commandHandlers.forEach(handler => handler(command));
      }
    });

    conn.on('close', () => {
      this.activeConnections = this.activeConnections.filter(c => c !== conn);
    });
  }

  public broadcast(data: any): void {
    this.activeConnections.forEach(conn => {
      if (conn.open) {
        conn.send(data);
      }
    });
  }

  public onReady(handler: ReadyHandler): void {
    if (this.peerId) {
      handler(this.peerId);
    }
    this.readyHandlers.push(handler);
  }

  public onCommand(handler: CommandHandler): void {
    this.commandHandlers.push(handler);
  }

  public offCommand(handler: CommandHandler): void {
    this.commandHandlers = this.commandHandlers.filter(h => h !== handler);
  }

  public getPeerId(): string | null {
    return this.peerId;
  }

  public close(): void {
    this.peer?.destroy();
    this.activeConnections.forEach(conn => conn.close());
    this.activeConnections = [];
    this.readyHandlers = [];
    this.commandHandlers = [];
  }
}

import { BlockType } from "../../types";
import { BlockRenderer } from "./types";
import * as Renderers from "./index";

export class RendererRegistry {
  private renderers: Map<BlockType, BlockRenderer> = new Map();

  constructor() {
      this.registerAllManual();
  }

  register(renderer: BlockRenderer): void {
    this.renderers.set(renderer.type, renderer);
  }

  getRenderer(type: BlockType): BlockRenderer | undefined {
    return this.renderers.get(type);
  }

  registerAllManual() {
      // FORCE DISABLE ALL RENDERERS FOR DEBUGGING
      /*
      Object.values(Renderers).forEach(renderer => {
          if (renderer && renderer.type && typeof renderer.render === 'function') {
              this.register(renderer);
          }
      });
      */
  }
}

export const rendererRegistry = new RendererRegistry();
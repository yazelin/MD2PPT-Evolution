import { BlockType } from "../../types";
import { BlockRenderer } from "./types";

export class RendererRegistry {
  private renderers: Map<BlockType, BlockRenderer> = new Map();

  register(renderer: BlockRenderer): void {
    this.renderers.set(renderer.type, renderer);
  }

  getRenderer(type: BlockType): BlockRenderer | undefined {
    return this.renderers.get(type);
  }

  async registerAll(): Promise<void> {
    const modules = import.meta.glob('./**/*.ts', { eager: false });
    for (const path in modules) {
      if (path.includes('registry.ts') || path.includes('types.ts')) continue;
      const module: any = await modules[path]();
      const renderer = module.default || Object.values(module).find((v: any) => v && v.type && typeof v.render === 'function');
      if (renderer && renderer.type) {
        this.register(renderer);
      }
    }
  }
}

export const rendererRegistry = new RendererRegistry();

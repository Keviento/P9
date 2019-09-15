import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { TracingToolService } from '../tracing-tool.service';

@Injectable({
  providedIn: 'root',
})
export class PencilToolService extends TracingToolService {
  private currentPath: string;
  // They Could be in TracingToolService
  private currentWidth = 2;
  private currentColor = 'black';
  private svgPathRef: SVGPathElement;

  constructor(private elementRef : ElementRef<SVGElement>, private renderer: Renderer2){
    super();
  }

  onMouseDown(e: MouseEvent): void {
    super.onMouseDown(e);
    this.currentPath = `M${e.offsetX} ${e.offsetY}`;
    this.createSVGCircle(e.offsetX, e.offsetY, this.currentWidth);
    this.createSVGPath();
  }

  onMouseMove(e: MouseEvent): void {
    if (this.isDrawing) {
      this.createSVGCircle(e.offsetX, e.offsetY, this.currentWidth);
      this.currentPath += ` L${e.offsetX} ${e.offsetY}`;
      this.updateSVGPath();
    }
  }

  onMouseUp(e: MouseEvent): void {
    super.onMouseUp(e);
    this.currentPath = '';
  }

  onMouseLeave(e: MouseEvent): void {
    this.isDrawing = false;
  }

  createSVGCircle(x: number, y: number, w: number) {
    const el = this.renderer.createElement('line', 'http://www.w3.org/2000/svg');
    this.renderer.setAttribute(el, 'x1', x.toString());
    this.renderer.setAttribute(el, 'x2', x.toString());
    this.renderer.setAttribute(el, 'y1', y.toString());
    this.renderer.setAttribute(el, 'y2', y.toString());
    this.renderer.setAttribute(el, 'stroke-width', w.toString());
    this.renderer.setAttribute(el, 'stroke-linecap', 'round');
    this.renderer.setAttribute(el, 'stroke', this.currentColor);
    this.renderer.appendChild(this.elementRef.nativeElement, el);
  }

  createSVGPath(): void {
    this.svgPathRef = this.renderer.createElement('path', 'http://www.w3.org/2000/svg');
    this.renderer.setAttribute(this.svgPathRef, 'fill', 'none');
    this.renderer.setAttribute(this.svgPathRef, 'stroke', this.currentColor);
    this.renderer.setAttribute(this.svgPathRef, 'stroke-width', this.currentWidth.toString());
    this.renderer.appendChild(this.elementRef.nativeElement, this.svgPathRef);
  }

  updateSVGPath(): void {
    this.renderer.setAttribute(this.svgPathRef, 'd', this.currentPath);
  }
}

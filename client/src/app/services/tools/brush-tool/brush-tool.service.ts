import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { Mouse, SVG_NS } from '../../constants';
import { TracingToolService } from '../abstract-tools/tracing-tool/tracing-tool.service';
import { DrawStackService } from '../../draw-stack/draw-stack.service';

@Injectable({
    providedIn: 'root',
})
export class BrushToolService extends TracingToolService {
    private currentPath = '';
    private currentWidth = 8;
    private currentColor = 'black';
    private currentPatternId = '';
    private svgPath = this.renderer.createElement('path', SVG_NS);
    private svgWrap = this.renderer.createElement('svg', SVG_NS);

    constructor(
        private elementRef: ElementRef<SVGElement>,
        private renderer: Renderer2,
        private drawStack: DrawStackService,
    ) {
        super();
    }

    onMouseDown(e: MouseEvent): void {
        if (e.button === Mouse.LeftButton) {
            super.onMouseDown(e);
            this.createSVGWrapper();
            this.currentPath = `M${e.offsetX} ${e.offsetY}`;
            this.createSVGCircle(e.offsetX, e.offsetY);
            this.createSVGPath();
        }
    }

    onMouseMove(e: MouseEvent): void {
        if (this.isDrawing && e.button === Mouse.LeftButton) {
            this.createSVGCircle(e.offsetX, e.offsetY);
            this.currentPath += ` L${e.offsetX} ${e.offsetY}`;
            this.updateSVGPath();
        }
    }

    onMouseUp(e: MouseEvent): void {
        if (this.isDrawing && e.button === Mouse.LeftButton) {
            super.onMouseUp(e);
            this.currentPath = '';
            this.drawStack.push(this.svgWrap);
        }
    }

    createSVGWrapper(): void {
        this.svgWrap = this.renderer.createElement('svg', SVG_NS);
        const filter = this.createFilter();
        this.renderer.appendChild(this.svgWrap, filter);
        this.renderer.appendChild(this.elementRef.nativeElement, this.svgWrap);
    }

    createFilter(): SVGFilterElement {
        const filter = this.renderer.createElement('filter', SVG_NS);
        this.renderer.setAttribute(filter, 'id', 'myFilter');
        this.renderer.setAttribute(filter, 'filterUnits', 'userSpaceOnUse');

        const feGaussianBlur = this.renderer.createElement('feGaussianBlur', SVG_NS);
        this.renderer.setAttribute(feGaussianBlur, 'stdDeviation', '3');
        this.renderer.appendChild(filter, feGaussianBlur);

        return filter;
    }

    createSVGCircle(x: number, y: number): void {
        const el = this.renderer.createElement('line', SVG_NS);
        this.renderer.setAttribute(el, 'x1', x.toString());
        this.renderer.setAttribute(el, 'x2', x.toString());
        this.renderer.setAttribute(el, 'y1', y.toString());
        this.renderer.setAttribute(el, 'y2', y.toString());
        this.renderer.setAttribute(el, 'stroke-width', this.currentWidth.toString());
        this.renderer.setAttribute(el, 'stroke-linecap', 'round');
        this.renderer.setAttribute(el, 'stroke', 'black');

        this.renderer.setAttribute(el, 'filter', 'url(#myFilter)');

        this.renderer.appendChild(this.svgWrap, el);
    }

    createSVGPath(): void {
        this.svgPath = this.renderer.createElement('path', SVG_NS);
        this.renderer.setAttribute(this.svgPath, 'fill', 'none');
        this.renderer.setAttribute(this.svgPath, 'stroke', 'black');
        this.renderer.setAttribute(this.svgPath, 'stroke-width', this.currentWidth.toString());
        this.renderer.setAttribute(this.svgPath, 'filter', 'url(#myFilter)');
        this.renderer.appendChild(this.svgWrap, this.svgPath);
    }

    updateSVGPath(): void {
        this.renderer.setAttribute(this.svgPath, 'd', this.currentPath);
    }
}

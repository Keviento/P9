import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { Mouse, SVG_NS } from '../../constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { TracingToolService } from '../abstract-tools/tracing-tool/tracing-tool.service';

@Injectable({
    providedIn: 'root',
})
export class BrushToolService extends TracingToolService {
    private currentPath = '';
    private currentWidth = 8;
    private currentColor = 'black';
    private currentPattern = 2;
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
            this.createSVGCircle(e.offsetX, e.offsetY);
            this.currentPath = `M${e.offsetX} ${e.offsetY} L${e.offsetX + 1} ${e.offsetY - 1}`;
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
        const filter = this.createFilter(this.currentPattern);
        this.renderer.appendChild(this.svgWrap, filter);
        this.renderer.appendChild(this.elementRef.nativeElement, this.svgWrap);
    }

    createFilter(patternId: number): object {
        let filter;
        switch (patternId) {
            case 1:
                filter = this.renderer.createElement('filter', SVG_NS);
                this.renderer.setAttribute(filter, 'id', this.currentPattern.toString());
                this.renderer.setAttribute(filter, 'filterUnits', 'objectBoundingBox');
                this.renderer.setAttribute(filter, 'height', '100px');
                this.renderer.setAttribute(filter, 'width', '100px');
                this.renderer.setAttribute(filter, 'x', '-50px');
                this.renderer.setAttribute(filter, 'y', '-50px');
                
                const effect = this.renderer.createElement('feGaussianBlur', SVG_NS);
                this.renderer.setAttribute(effect, 'stdDeviation', '3');
                this.renderer.appendChild(filter, effect);
                break;
            case 2:
                filter = this.renderer.createElement('pattern', SVG_NS);
                this.renderer.setAttribute(filter, 'id', this.currentPattern.toString());
                this.renderer.setAttribute(filter, 'patternUnits', 'userSpaceOnUse');
                this.renderer.setAttribute(filter, 'width', '4');
                this.renderer.setAttribute(filter, 'height', '4');

                const path = this.renderer.createElement('path', SVG_NS);
                this.renderer.setAttribute(path, 'd', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2');
                this.renderer.setAttribute(path, 'stroke', this.currentColor);
                this.renderer.setAttribute(path, 'stroke-width', this.currentWidth.toString());

                this.renderer.appendChild(filter, path);
                break;
        }
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
        this.renderer.setAttribute(el, 'stroke', this.currentColor);

        this.renderer.setAttribute(el, 'filter', `url(#${this.currentPattern.toString()})`);

        this.renderer.appendChild(this.svgWrap, el);
    }

    createSVGPath(): void {
        this.svgPath = this.renderer.createElement('path', SVG_NS);
        this.renderer.setAttribute(this.svgPath, 'fill', 'none');
        this.renderer.setAttribute(this.svgPath, 'stroke', this.currentColor);
        this.renderer.setAttribute(this.svgPath, 'stroke-width', this.currentWidth.toString());
        this.renderer.setAttribute(this.svgPath, 'filter', `url(#${this.currentPattern})`);
        this.renderer.appendChild(this.svgWrap, this.svgPath);
        this.updateSVGPath();
    }

    updateSVGPath(): void {
        this.renderer.setAttribute(this.svgPath, 'd', this.currentPath);
    }
}

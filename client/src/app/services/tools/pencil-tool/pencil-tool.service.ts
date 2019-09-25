import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { Mouse, SVG_NS } from '../../constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { TracingToolService } from '../abstract-tools/tracing-tool/tracing-tool.service';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';

@Injectable({
    providedIn: 'root',
})
export class PencilToolService extends TracingToolService {
    private currentPath = '';
    private currentWidth = 0;
    private currentColor = 'black';
    private svgPathRef: SVGPathElement = this.renderer.createElement('path', SVG_NS);
    private svgWrapRef: SVGElement = this.renderer.createElement('svg', SVG_NS);
    private attributesManagerService: AttributesManagerService;

    constructor(
        private elementRef: ElementRef<SVGElement>,
        private renderer: Renderer2,
        private drawStack: DrawStackService,
    ) {
        super();
    }

    initializeAttributesManagerService(attributesManagerService: AttributesManagerService) {
        this.attributesManagerService = attributesManagerService;
        this.attributesManagerService.currentThickness.subscribe((thickness) => {
            this.currentWidth = thickness;
        });
    }

    onMouseDown(e: MouseEvent): void {
        if (e.button === Mouse.LeftButton) {
            super.onMouseDown(e);
            this.createSVGWrapper();
            this.currentPath = `M${e.clientX - this.elementRef.nativeElement.getBoundingClientRect().left}
            ${e.clientY - this.elementRef.nativeElement.getBoundingClientRect().top}`;
            this.createSVGCircle(e.clientX - this.elementRef.nativeElement.getBoundingClientRect().left,
            e.clientY - this.elementRef.nativeElement.getBoundingClientRect().top, this.currentWidth);
            this.createSVGPath();
        }
    }

    onMouseMove(e: MouseEvent): void {
        if (e.button === Mouse.LeftButton && this.isDrawing) {
            this.createSVGCircle(e.clientX - this.elementRef.nativeElement.getBoundingClientRect().left,
            e.clientY - this.elementRef.nativeElement.getBoundingClientRect().top, this.currentWidth);
            this.currentPath += ` L${e.clientX - this.elementRef.nativeElement.getBoundingClientRect().left}
            ${e.clientY - this.elementRef.nativeElement.getBoundingClientRect().top}`;
            this.updateSVGPath();
        }
    }

    onMouseUp(e: MouseEvent): void {
        if (e.button === Mouse.LeftButton && this.isDrawing) {
            super.onMouseUp(e);
            this.currentPath = '';
            this.drawStack.push(this.svgWrapRef);
        }
    }

    onMouseLeave(e: MouseEvent): void {
        if (this.isDrawing) {
            this.isDrawing = false;
            this.currentPath = '';
            this.drawStack.push(this.svgWrapRef);
        }
    }

    onMouseEnter(event: MouseEvent): undefined {
        return undefined;
    }

    onKeyDown(event: KeyboardEvent): undefined {
        return undefined;
    }

    onKeyUp(event: KeyboardEvent): undefined {
        return undefined;
    }

    createSVGWrapper(): void {
        const el: SVGElement = this.renderer.createElement('svg', SVG_NS);
        this.svgWrapRef = el;
        this.renderer.appendChild(this.elementRef.nativeElement, el);
    }

    createSVGCircle(x: number, y: number, w: number): void {
        const el: SVGLineElement = this.renderer.createElement('line', SVG_NS);
        this.renderer.setAttribute(el, 'x1', x.toString());
        this.renderer.setAttribute(el, 'x2', x.toString());
        this.renderer.setAttribute(el, 'y1', y.toString());
        this.renderer.setAttribute(el, 'y2', y.toString());
        this.renderer.setAttribute(el, 'stroke-width', w.toString());
        this.renderer.setAttribute(el, 'stroke-linecap', 'round');
        this.renderer.setAttribute(el, 'stroke', this.currentColor);
        this.renderer.appendChild(this.svgWrapRef, el);
    }

    createSVGPath(): void {
        this.svgPathRef = this.renderer.createElement('path', SVG_NS);
        this.renderer.setAttribute(this.svgPathRef, 'fill', 'none');
        this.renderer.setAttribute(this.svgPathRef, 'stroke', this.currentColor);
        this.renderer.setAttribute(this.svgPathRef, 'stroke-width', this.currentWidth.toString());
        this.renderer.setAttribute(this.svgPathRef, 'stroke-linejoin', 'round');
        this.renderer.appendChild(this.svgWrapRef, this.svgPathRef);
    }

    updateSVGPath(): void {
        this.renderer.setAttribute(this.svgPathRef, 'd', this.currentPath);
    }
}
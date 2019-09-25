import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { Keys, Mouse, SVG_NS, TraceType } from '../../constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AbstractShapeToolService } from '../abstract-tools/abstract-shape-tool/abstract-shape-tool.service';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';

@Injectable({
    providedIn: 'root',
})
export class RectangleToolService extends AbstractShapeToolService {
    private drawRectangle: SVGRectElement = this.renderer.createElement('rect', SVG_NS);
    private fillColor = 'green';
    private strokeColor = 'black';
    private strokeWidth = 1;
    private isSquarePreview = false;
    private attributesManagerService: AttributesManagerService;

    constructor(
        private drawStack: DrawStackService,
        private svgReference: ElementRef<SVGElement>,
        renderer: Renderer2,
    ) {
        super(renderer);
    }

    initializeAttributesManagerService(attributesManagerService: AttributesManagerService) {
        this.attributesManagerService = attributesManagerService;
        this.attributesManagerService.currentThickness.subscribe((thickness) => {
            this.strokeWidth = thickness;
        });
        this.attributesManagerService.currentTraceType.subscribe((traceType) => {
            this.updateTraceType(traceType);
        });
    }

    onMouseMove(event: MouseEvent): void {
        this.currentMouseX = event.clientX - this.svgReference.nativeElement.getBoundingClientRect().left;
        this.currentMouseY = event.clientY - this.svgReference.nativeElement.getBoundingClientRect().top;

        if (this.isPreviewing) {
            this.updatePreviewRectangle();
            this.updateDrawing();
        }
    }

    onMouseDown(event: MouseEvent): void {
        const button = event.button;

        if (button === Mouse.LeftButton && this.isIn) {
            this.initialMouseX = this.currentMouseX;
            this.initialMouseY = this.currentMouseY;
            this.isPreviewing = true;

            this.updatePreviewRectangle();
            this.updateDrawing();

            this.renderer.appendChild(this.svgReference.nativeElement, this.previewRectangle);
            this.renderer.appendChild(this.svgReference.nativeElement, this.drawRectangle);
        }
    }

    onMouseUp(event: MouseEvent): void {
        const button = event.button;

        if (button === Mouse.LeftButton && this.isIn) {
            if (this.previewRectangle.width.baseVal.value > 0 || this.previewRectangle.height.baseVal.value > 0) {
                this.createSVG();
            }
            this.isPreviewing = false;
            this.isSquarePreview = false;
            this.renderer.removeChild(this.svgReference.nativeElement, this.previewRectangle);
            this.renderer.removeChild(this.svgReference, this.drawRectangle);
        }
    }

    onMouseEnter(event: MouseEvent): void {
        this.isIn = true;
        this.isOut = false;
    }

    onMouseLeave(event: MouseEvent): void {
        this.isIn = false;
        this.isOut = true;
    }

    onKeyDown(event: KeyboardEvent): void {
        const key = event.key;

        switch (key) {
            case Keys.Shift:
                if (this.isPreviewing && !this.isSquarePreview) {
                    this.isSquarePreview = true;
                    this.updateDrawing();
                }
                break;

            default:
                break;
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        const key = event.key;

        switch (key) {
            case Keys.Shift:
                if (this.isPreviewing && this.isSquarePreview) {
                    this.isSquarePreview = false;
                    this.updatePreviewRectangle();
                    this.updateDrawing();
                }
                break;

            default:
                break;
        }
    }

    createSVG(): void {
        const el: SVGElement = this.renderer.createElement('svg', SVG_NS);
        const drawRectangle: SVGRectElement = this.renderer.createElement('rect', SVG_NS);
        this.renderer.setAttribute(drawRectangle, 'x', this.drawRectangle.x.baseVal.valueAsString);
        this.renderer.setAttribute(drawRectangle, 'y', this.drawRectangle.y.baseVal.valueAsString);
        this.renderer.setAttribute(drawRectangle, 'width', this.drawRectangle.width.baseVal.valueAsString);
        this.renderer.setAttribute(drawRectangle, 'height', this.drawRectangle.height.baseVal.valueAsString);
        this.renderer.setAttribute(drawRectangle, 'fill', this.fillColor.toString());
        this.renderer.setAttribute(drawRectangle, 'stroke', this.strokeColor.toString());
        this.renderer.setAttribute(drawRectangle, 'stroke-width', this.strokeWidth.toString());

        drawRectangle.addEventListener('mousedown', (event) => {
            if (event.button === Mouse.LeftButton) {
                this.renderer.setAttribute(drawRectangle, 'fill', this.fillColor.toString());
            } else if (event.button === Mouse.RightButton) {
                this.renderer.setAttribute(drawRectangle, 'stroke', this.strokeColor.toString());
            }
        });

        this.renderer.appendChild(el, drawRectangle);
        this.drawStack.push(el);
        this.renderer.appendChild(this.svgReference.nativeElement, el);
    }

    updateDrawing(): void {
        if (this.isSquarePreview) {
            this.updatePreviewSquare();
        } else {
            this.updatePreviewRectangle();
            this.renderer.setAttribute(
                this.drawRectangle,
                'x',
                (this.previewRectangle.x.baseVal.value + this.strokeWidth / 2).toString()
            );
            this.renderer.setAttribute(
                this.drawRectangle,
                'y',
                (this.previewRectangle.y.baseVal.value + this.strokeWidth / 2).toString()
            );
            this.renderer.setAttribute(
                this.drawRectangle,
                'width',
                (this.previewRectangle.width.baseVal.value - this.strokeWidth).toString()
            );
            this.renderer.setAttribute(
                this.drawRectangle,
                'height',
                (this.previewRectangle.height.baseVal.value - this.strokeWidth).toString()
            );
        }
        this.renderer.setAttribute(this.drawRectangle, 'fill', this.fillColor.toString());
        this.renderer.setAttribute(this.drawRectangle, 'stroke', this.strokeColor.toString());
        this.renderer.setAttribute(this.drawRectangle, 'stroke-width', this.strokeWidth.toString());
    }

    updatePreviewSquare(): void {
        let deltaX = this.currentMouseX - this.initialMouseX;
        let deltaY = this.currentMouseY - this.initialMouseY;
        const minLen = Math.min(Math.abs(deltaX), Math.abs(deltaY));

        // adjust x
        if (deltaX < 0) {
            deltaX *= -1;
            this.renderer.setAttribute(
                this.drawRectangle,
                'x',
                (this.initialMouseX - minLen + this.strokeWidth / 2).toString()
            );
            this.renderer.setAttribute(this.drawRectangle, 'width', (minLen - this.strokeWidth).toString());
        } else {
            this.renderer.setAttribute(this.drawRectangle, 'x', (this.initialMouseX + this.strokeWidth / 2).toString());
            this.renderer.setAttribute(this.drawRectangle, 'width', (minLen - this.strokeWidth).toString());
        }

        // adjust y
        if (deltaY < 0) {
            deltaY *= -1;
            this.renderer.setAttribute(
                this.drawRectangle,
                'y',
                (this.initialMouseY - minLen + this.strokeWidth / 2).toString()
            );
            this.renderer.setAttribute(this.drawRectangle, 'height', (minLen - this.strokeWidth).toString());
        } else {
            this.renderer.setAttribute(this.drawRectangle, 'y', (this.initialMouseY + this.strokeWidth / 2).toString());
            this.renderer.setAttribute(this.drawRectangle, 'height', (minLen - this.strokeWidth).toString());
        }
    }

    updateTraceType(traceType: string) {
        switch (traceType) {
            case TraceType.Outline: {
                this.fillColor = '#ffffff00';
                this.strokeColor = 'black';
                break;
            }
            case TraceType.Full: {
                this.fillColor = 'Green';
                this.strokeColor = '#ffffff00';
                break;
            }
            case TraceType.Both: {
                this.fillColor = 'Green';
                this.strokeColor = 'black';
            }
        }
    }
}

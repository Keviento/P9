import { Injectable, ElementRef, Renderer2 } from '@angular/core';

import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { AbstractToolService } from '../abstract-tools/abstract-tool.service';
import { AttributesManagerService } from '../attributes-manager/attributes-manager.service';
import { StackTargetInfo } from 'src/classes/StackTargetInfo';
import { Mouse } from 'src/constants/constants';
import { HTMLAttribute } from 'src/constants/tool-constants';

@Injectable({
    providedIn: 'root',
})
export class EraserToolService extends AbstractToolService {
    attributesManagerService: AttributesManagerService;
    currentStackTarget: StackTargetInfo;
    currentSize = 1;
    isOnTarget = false;
    lastStrokeColor = '';

    constructor(
        public drawStack: DrawStackService,
        public svgReference: ElementRef<SVGElement>,
        public renderer: Renderer2,
    ) {
        super();
        this.drawStack.currentStackTarget.subscribe((stackTarget) => {
            this.currentStackTarget = stackTarget;
            this.isOnTarget = true;
        });
    }

    initializeAttributesManagerService(attributesManagerService: AttributesManagerService): void {
        this.attributesManagerService = attributesManagerService;
        this.attributesManagerService.currentEraserSize.subscribe((newSize) => {
            this.currentSize = newSize;
            // this.setStamp();
        });
    }

    onMouseMove(event: MouseEvent): void {
        // this.currentMouseX = event.clientX - this.svgReference.nativeElement.getBoundingClientRect().left;
        // this.currentMouseY = event.clientY - this.svgReference.nativeElement.getBoundingClientRect().top;
        // this.positionStamp();
    }

    onMouseDown(event: MouseEvent): void {
        const button = event.button;
        let elementPosition = this.currentStackTarget.targetPosition;
        if (this.isOnTarget && this.drawStack.getElementByPosition(elementPosition) !== undefined) {
            if (button === Mouse.LeftButton) {
                this.renderer.removeChild(
                    this.svgReference.nativeElement, //retourne le "g"
                    this.drawStack.getElementByPosition(elementPosition),
                );

                // this.renderer.setAttribute(
                //     this.drawStack.getElementByPosition(elementPosition),
                //     HTMLAttribute.fill,
                //     'none',
                // );

                // this.renderer.setAttribute(
                //     this.drawStack.getElementByPosition(elementPosition),
                //     HTMLAttribute.stroke,
                //     'none',
                // );

                this.drawStack.removeElementByPosition(elementPosition);
            } else {
                // this.isOnTarget = false;
            }
        }
    }

    onMouseUp(event: MouseEvent): void {
        // const button = event.button;
        // if (button === Mouse.LeftButton && this.verifyPosition(event) && this.isIn && this.shouldStamp) {
        //     this.initStamp();
        // }
    }

    onMouseEnter(event: MouseEvent): void {
        let elementPosition = this.currentStackTarget.targetPosition;
        if (this.isOnTarget && this.drawStack.getElementByPosition(elementPosition) !== undefined) {
            //color on hover to red
            //lastStrokeColor = this.svgReference.nativeElement.ge

            this.renderer.setAttribute(
                this.drawStack.getElementByPosition(elementPosition),
                HTMLAttribute.stroke,
                '#ff0000',
            );
            console.log('color border in red');
        }
    }

    onMouseLeave(event: MouseEvent): void {
        // this.isIn = false;
        // if (this.shouldStamp) {
        //     this.cleanUp();
        // }
    }

    onKeyDown(event: KeyboardEvent): void {
        // const key = event.key;
        // if (key === Keys.Alt) {
        //     event.preventDefault();
        //     if (!this.isAlterRotation) {
        //         this.isAlterRotation = true;
        //     }
        // }
    }

    onKeyUp(event: KeyboardEvent): void {
        // const key = event.key;
        // if (key === Keys.Alt) {
        //     event.preventDefault();
        //     if (this.isAlterRotation) {
        //         this.isAlterRotation = false;
        //     }
        // }
    }

    cleanUp(): void {
        // if (this.stampIsAppended) {
        //     this.renderer.removeChild(this.svgReference.nativeElement, this.stampWrapper);
        //     this.stampIsAppended = false;
        // }
    }
}

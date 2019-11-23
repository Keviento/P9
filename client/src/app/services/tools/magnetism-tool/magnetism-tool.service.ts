import { Injectable } from '@angular/core';
import { CONTROL_POINTS, GRID_SIZE } from 'src/constants/tool-constants';
import { GridToolService } from '../grid-tool/grid-tool.service';
//import { SelectionToolService } from '../selection-tool/selection-tool.service';
import { Coords2D } from 'src/classes/Coords2D';
import { BehaviorSubject } from 'rxjs';
import { DrawingLoaderService } from '../../server/drawing-loader/drawing-loader.service';
import { Selection } from 'src/classes/selection/selection';

@Injectable({
    providedIn: 'root',
})
export class MagnetismToolService {
    currentPoint: CONTROL_POINTS;
    currentPointPosition: Coords2D;
    currentGridSize: number;
    totalDeltaX = 0;
    totalDeltaY = 0;

    selection: Selection;

    isMagnetic: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(
        private gridToolService: GridToolService,

        private drawingLoaderService: DrawingLoaderService,
    ) {
        // Prendre du tool selector si ca chie
        this.currentPoint = CONTROL_POINTS.TopLeft;
        this.currentPointPosition = new Coords2D(0, 0);
        this.currentGridSize = GRID_SIZE.Default;

        this.gridToolService.size.subscribe((size: number) => {
            this.currentGridSize = size;
            //console.log(this.currentGridSize);
        });
    }

    //  ngOnInit() {}

    initializeService(selection: Selection) {
        this.selection = selection;
    }

    updateControlPointPosition(): void {
        if (this.currentPoint === CONTROL_POINTS.CenterMiddle) {
            const selectionBox: SVGRectElement = this.selection.selectionBox;
            const x = selectionBox.x.baseVal.value + selectionBox.width.baseVal.value / 2;
            const y = selectionBox.y.baseVal.value + selectionBox.height.baseVal.value / 2;
            this.currentPointPosition.x = x;
            this.currentPointPosition.y = y;
        } else {
            const x = this.selection.controlPoints[this.currentPoint].cx.baseVal.value;
            const y = this.selection.controlPoints[this.currentPoint].cy.baseVal.value;
            this.currentPointPosition.x = x;
            this.currentPointPosition.y = y;
        }
    }

    changeState(state: boolean): void {
        if (!this.drawingLoaderService.untouchedWorkZone.value) {
            this.isMagnetic.next(state);
        }
    }

    switchState(): void {
        this.isMagnetic.value ? this.changeState(false) : this.changeState(true);
    }

    // grid size n'est pas bon
    // remainder semble aussi etre weird
    magnetizeX(deltaX: number, lastXPosition: number): number {
        this.totalDeltaX += deltaX;
        let remainder = this.totalDeltaX % this.currentGridSize;

        // console.log(deltaX);
        console.log('remainder: ' + remainder);
        //  console.log('grid size: ' + this.currentGridSize);

        if (remainder < this.currentGridSize / 2) {
            return 0;
        } else {
            this.totalDeltaX = 0;
            return lastXPosition + this.currentGridSize / 2;
        }
    }

    magnetizeY(deltaY: number, lastYPosition: number): number {
        this.totalDeltaY += deltaY;

        let remainder = this.totalDeltaY % this.currentGridSize;
        if (remainder < this.currentGridSize / 2) {
            return 0;
        } else {
            this.totalDeltaY = 0;
            return lastYPosition + this.currentGridSize / 2;
        }
    }
}

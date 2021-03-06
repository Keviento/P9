import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

import { MatSnackBar } from '@angular/material';
import { Drawing } from 'src/../../common/communication/Drawing';
import { ClipboardService } from 'src/app/services/clipboard/clipboard.service';
import { EventListenerService } from 'src/app/services/event-listener/event-listener.service';
import { ModalManagerService } from 'src/app/services/modal-manager/modal-manager.service';
import { DrawingLoaderService } from 'src/app/services/server/drawing-loader/drawing-loader.service';
import { DrawingSaverService } from 'src/app/services/server/drawing-saver/drawing-saver.service';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { GridToolService } from 'src/app/services/tools/grid-tool/grid-tool.service';
import { MagnetismToolService } from 'src/app/services/tools/magnetism-tool/magnetism-tool.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { UndoRedoerService } from 'src/app/services/undo-redoer/undo-redoer.service';
import { DEFAULT_TRANSPARENT, DEFAULT_WHITE } from 'src/constants/color-constants';
import { SIDEBAR_WIDTH } from 'src/constants/constants';
import {
    CURSOR_STYLES,
    GRID_OPACITY,
    GRID_SIZE,
    HTML_ATTRIBUTE,
    SNACKBAR_DURATION,
    TOOL_NAME,
} from 'src/constants/tool-constants';
import { DrawingInfo } from '../../../../../common/communication/DrawingInfo';
import { DrawStackService } from '../../services/draw-stack/draw-stack.service';
import { DrawingModalWindowService } from '../../services/drawing-modal-window/drawing-modal-window.service';

@Component({
    selector: 'app-work-zone',
    templateUrl: './work-zone.component.html',
    styleUrls: ['./work-zone.component.scss'],
})
export class WorkZoneComponent implements OnInit {
    drawingInfo: DrawingInfo = { width: 0, height: 0, color: DEFAULT_WHITE } as DrawingInfo;
    gridIsActive = false;
    modalIsDisplayed: boolean;

    gridSize = GRID_SIZE.Default;
    gridOpacity = GRID_OPACITY.Max;
    toolName: TOOL_NAME = TOOL_NAME.Selection;

    drawStack: DrawStackService;

    @ViewChild('svgpad', { static: true }) refSVG: ElementRef<SVGElement>;

    private eventListenerService: EventListenerService;

    constructor(
        private drawingModalWindowService: DrawingModalWindowService,
        private renderer: Renderer2,
        private toolSelector: ToolSelectorService,
        private colorToolService: ColorToolService,
        private gridToolService: GridToolService,
        private shortCutManagerService: ShortcutManagerService,
        private modalManagerService: ModalManagerService,
        private drawingLoaderService: DrawingLoaderService,
        private drawingSaverService: DrawingSaverService,
        private undoRedoerService: UndoRedoerService,
        private clipboard: ClipboardService,
        private snackBar: MatSnackBar,
        private magnetismToolService: MagnetismToolService,
    ) {}

    ngOnInit(): void {
        this.undoRedoerService.initializeService(this.refSVG);
        this.drawStack = new DrawStackService(this.renderer, this.drawingLoaderService, this.undoRedoerService);

        this.toolSelector.initTools(this.drawStack, this.refSVG, this.renderer);
        this.initializeEventListeners();

        this.toolSelector.currentToolName.subscribe((toolName) => {
            this.toolName = toolName;
        });

        this.drawingLoaderService.currentDrawing.subscribe((selectedDrawing: Drawing) => {
            if (selectedDrawing.svg !== '') {
                this.drawingLoaderService.emptyDrawStack.next(false);
                this.updateDrawingInfo(selectedDrawing.drawingInfo);
                this.appendDrawingToView(selectedDrawing);
                this.drawingLoaderService.untouchedWorkZone.next(false);
            }

            if (this.undoRedoerService.fromLoader) {
                this.undoRedoerService.saveCurrentState(this.drawStack.idStack);
                this.undoRedoerService.fromLoader = false;
            }
        });

        this.drawingModalWindowService.drawingInfo.subscribe((drawingInfo: DrawingInfo) => {
            if (drawingInfo.width !== 0 && drawingInfo.height !== 0) {
                this.resetWorkzone(drawingInfo);
                this.drawingLoaderService.untouchedWorkZone.next(false);
            }

            if (this.undoRedoerService.undos.length === 0 && !this.undoRedoerService.fromLoader) {
                setTimeout(() => {
                    this.undoRedoerService.saveCurrentState([]);
                }, 0);
            }
        });

        this.drawingSaverService.initializeDrawingSaverService(this.refSVG, this.drawStack);

        this.colorToolService.backgroundColor.subscribe((backgroundColor: string) => {
            this.drawingInfo.color = backgroundColor;
            this.setRectangleBackgroundStyle();
        });

        this.gridToolService.state.subscribe((state: boolean) => {
            this.gridIsActive = state;
        });

        this.gridToolService.size.subscribe((size: number) => {
            this.gridSize = size;
        });
        this.gridToolService.opacity.subscribe((opacity: number) => {
            this.gridOpacity = opacity;
        });

        this.modalManagerService.currentModalIsDisplayed.subscribe((modalIsDisplayed: boolean) => {
            this.modalIsDisplayed = modalIsDisplayed;
        });
        this.setDefaultWorkZoneProperties();
    }

    setDefaultWorkZoneProperties() {
        this.drawingInfo.height = window.innerHeight;
        this.drawingInfo.width = window.innerWidth - SIDEBAR_WIDTH;
        this.drawingInfo.color = DEFAULT_TRANSPARENT;
        this.drawingLoaderService.emptyDrawStack.next(true);
        this.setRectangleBackgroundStyle();
    }

    updateDrawingInfo(newDrawingInfo: DrawingInfo) {
        this.drawingInfo = newDrawingInfo;
        this.drawingModalWindowService.changeDrawingInfo(
            this.drawingInfo.width,
            this.drawingInfo.height,
            this.drawingInfo.color,
        );
    }

    appendDrawingToView(selectedDrawing: Drawing) {
        this.renderer.setProperty(this.refSVG.nativeElement, HTML_ATTRIBUTE.InnerHTML, selectedDrawing.svg);

        const idStack = Object.values(selectedDrawing.drawingInfo.idStack);
        idStack.forEach((id) => {
            const children: SVGElement[] = Array.from(this.refSVG.nativeElement.children) as SVGElement[];
            const child: SVGElement = children.filter((filterChild) => {
                return filterChild.getAttribute('id_element') === id;
            })[0];
            this.drawStack.push(child as SVGAElement, false);
        });
    }

    initializeEventListeners() {
        this.eventListenerService = new EventListenerService(
            this.refSVG,
            this.toolSelector,
            this.gridToolService,
            this.shortCutManagerService,
            this.modalManagerService,
            this.renderer,
            this.drawingLoaderService,
            this.undoRedoerService,
            this.clipboard,
            this.magnetismToolService,
        );
        this.eventListenerService.addEventListeners();
    }

    resetWorkzone(drawingInfo: DrawingInfo) {
        this.drawingInfo = drawingInfo;

        this.setRectangleBackgroundStyle();

        for (const el of this.drawStack.reset()) {
            this.renderer.removeChild(this.refSVG.nativeElement, el);
        }
        this.drawingLoaderService.emptyDrawStack.next(true);
    }

    onClickRectangle() {
        if (this.drawingLoaderService.untouchedWorkZone.value) {
            this.snackBar.open('Veuillez créer un nouveau dessin!', 'OK', {
                duration: SNACKBAR_DURATION,
            });
        }
    }

    getCursorStyle() {
        if (this.drawingLoaderService.untouchedWorkZone.value) {
            return { cursor: CURSOR_STYLES.NotAllowed };
        }
        switch (this.toolName) {
            case TOOL_NAME.Eraser:
            case TOOL_NAME.Quill:
                return { cursor: CURSOR_STYLES.None };
            case TOOL_NAME.Brush:
            case TOOL_NAME.Pencil:
            case TOOL_NAME.Rectangle:
            case TOOL_NAME.Ellipsis:
            case TOOL_NAME.Pen:
            case TOOL_NAME.Polygon:
            case TOOL_NAME.ColorApplicator:
            case TOOL_NAME.Line:
            case TOOL_NAME.SprayCan:
            case TOOL_NAME.Fill:
                return { cursor: CURSOR_STYLES.Crosshair };
            default:
                return { cursor: CURSOR_STYLES.Default };
        }
    }

    backgroundColor(): string {
        if (this.drawingLoaderService.untouchedWorkZone.value) {
            this.drawingInfo.color = DEFAULT_TRANSPARENT;
        }
        return this.drawingInfo.color;
    }

    setRectangleBackgroundStyle() {
        if (this.drawingInfo.width > 0 || this.drawingInfo.height > 0) {
            this.renderer.setAttribute(
                this.refSVG.nativeElement.children[0],
                HTML_ATTRIBUTE.Height,
                this.drawingInfo.height + 'px',
            );
            this.renderer.setAttribute(
                this.refSVG.nativeElement.children[0],
                HTML_ATTRIBUTE.Width,
                this.drawingInfo.width + 'px',
            );

            this.renderer.setAttribute(
                this.refSVG.nativeElement.children[0],
                'style',
                'fill: #' + this.backgroundColor() + ';',
            );
        }
    }
}

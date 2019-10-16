import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { ToolName } from 'src/constants/tool-constants';
import { WelcomeModalWindowComponent } from '../../components/welcome-modal-window/welcome-modal-window.component';
import { DrawingModalWindowService } from '../../services/drawing-modal-window/drawing-modal-window.service';
import { ShortcutManagerService } from '../../services/shortcut-manager/shortcut-manager.service';
import { ToolSelectorService } from '../../services/tools/tool-selector/tool-selector.service';
import { WelcomeModalWindowService } from '../../services/welcome-modal-window/welcome-modal-window.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    displayNewDrawingModalWindow = false;
    displayWelcomeModalWindow = false;
    welcomeModalWindowClosed = false;
    isOnInput = false;

    constructor(
        private welcomeModalWindowService: WelcomeModalWindowService,
        private dialog: MatDialog,
        private toolSelectorService: ToolSelectorService,
        private drawingModalWindowService: DrawingModalWindowService,
        private shortcutManagerService: ShortcutManagerService,
    ) {}

    ngOnInit(): void {
        this.drawingModalWindowService.currentDisplayNewDrawingModalWindow.subscribe(
            (displayNewDrawingModalWindow: boolean) => {
                this.displayNewDrawingModalWindow = displayNewDrawingModalWindow;
            },
        );
        this.shortcutManagerService.currentIsOnInput.subscribe((isOnInput: boolean) => {
            this.isOnInput = isOnInput;
        });
        this.welcomeModalWindowService.currentWelcomeModalWindowClosed.subscribe(
            (welcomeModalWindowClosed: boolean) => {
                this.welcomeModalWindowClosed = welcomeModalWindowClosed;
            },
        );
        this.displayWelcomeModalWindow = this.welcomeModalWindowService.getValueFromLocalStorage();
        this.openWelcomeModalWindow();
    }

    openWelcomeModalWindow(): void {
        if (this.displayWelcomeModalWindow) {
            const dialogRef = this.dialog.open(WelcomeModalWindowComponent, {
                panelClass: 'myapp-max-width-dialog',
                disableClose: true,
            });
            dialogRef.afterClosed().subscribe((displayWelcomeModalWindow) => {
                displayWelcomeModalWindow = displayWelcomeModalWindow.toString();
                this.welcomeModalWindowService.setValueToLocalStorage(displayWelcomeModalWindow);
            });
        }
    }

    shouldAllowShortcut(): boolean {
        return (
            !this.displayNewDrawingModalWindow &&
            (this.welcomeModalWindowClosed || !this.displayWelcomeModalWindow) &&
            !this.isOnInput
        );
    }

    @HostListener('window:contextmenu', ['$event']) onRightClick(event: MouseEvent) {
        event.preventDefault();
    }

    // File option
    @HostListener('window:keydown.control.o', ['$event']) onControlO(event: KeyboardEvent) {
        event.preventDefault();
        if (this.shouldAllowShortcut()) {
            this.toolSelectorService.changeTool(ToolName.NewDrawing);
        }
    }
    @HostListener('window:keydown.control.s', ['$event']) onControlS(event: KeyboardEvent) {
        event.preventDefault();
        if (this.shouldAllowShortcut()) {
            this.toolSelectorService.changeTool(ToolName.Save);
        }
    }
    @HostListener('window:keydown.control.g', ['$event']) onControlG(event: KeyboardEvent) {
        event.preventDefault();
        if (this.shouldAllowShortcut()) {
            this.toolSelectorService.changeTool(ToolName.ArtGallery);
        }
    }
    @HostListener('window:keydown.control.e', ['$event']) onControlE(event: KeyboardEvent) {
        event.preventDefault();
        if (this.shouldAllowShortcut()) {
            this.toolSelectorService.changeTool(ToolName.Export);
        }
    }

    // Selection
    // Will be implemented later

    // Choose a tool
    @HostListener('window:keydown.c', ['$event']) onC(event: KeyboardEvent) {
        if (this.shouldAllowShortcut()) {
            event.preventDefault();
            this.toolSelectorService.changeTool(ToolName.Pencil);
        }
    }
    @HostListener('window:keydown.w', ['$event']) onW(event: KeyboardEvent) {
        if (this.shouldAllowShortcut()) {
            event.preventDefault();
            this.toolSelectorService.changeTool(ToolName.Brush);
        }
    }
    @HostListener('window:keydown.p', ['$event']) onP(event: KeyboardEvent) {
        if (this.shouldAllowShortcut()) {
            event.preventDefault();
            this.toolSelectorService.changeTool(ToolName.Quill);
        }
    }
    @HostListener('window:keydown.y', ['$event']) onY(event: KeyboardEvent) {
        if (this.shouldAllowShortcut()) {
            event.preventDefault();
            this.toolSelectorService.changeTool(ToolName.Pen);
        }
    }
    @HostListener('window:keydown.a', ['$event']) onA(event: KeyboardEvent) {
        if (this.shouldAllowShortcut()) {
            event.preventDefault();
            this.toolSelectorService.changeTool(ToolName.SprayCan);
        }
    }
    @HostListener('window:keydown.1', ['$event']) on1(event: KeyboardEvent) {
        if (this.shouldAllowShortcut()) {
            event.preventDefault();
            this.toolSelectorService.changeTool(ToolName.Rectangle);
        }
    }
    @HostListener('window:keydown.2', ['$event']) on2(event: KeyboardEvent) {
        if (this.shouldAllowShortcut()) {
            event.preventDefault();
            this.toolSelectorService.changeTool(ToolName.Ellipsis);
        }
    }
    @HostListener('window:keydown.3', ['$event']) on3(event: KeyboardEvent) {
        if (this.shouldAllowShortcut()) {
            event.preventDefault();
            this.toolSelectorService.changeTool(ToolName.Polygon);
        }
    }
    @HostListener('window:keydown.l', ['$event']) onL(event: KeyboardEvent) {
        if (this.shouldAllowShortcut()) {
            event.preventDefault();
            this.toolSelectorService.changeTool(ToolName.Line);
        }
    }
    @HostListener('window:keydown.t', ['$event']) onT(event: KeyboardEvent) {
        if (this.shouldAllowShortcut()) {
            event.preventDefault();
            this.toolSelectorService.changeTool(ToolName.Text);
        }
    }
    @HostListener('window:keydown.r', ['$event']) onR(event: KeyboardEvent) {
        if (this.shouldAllowShortcut()) {
            event.preventDefault();
            this.toolSelectorService.changeTool(ToolName.ColorApplicator);
        }
    }
    @HostListener('window:keydown.b', ['$event']) onB(event: KeyboardEvent) {
        if (this.shouldAllowShortcut()) {
            event.preventDefault();
            this.toolSelectorService.changeTool(ToolName.Fill);
        }
    }
    @HostListener('window:keydown.e', ['$event']) onE(event: KeyboardEvent) {
        if (this.shouldAllowShortcut()) {
            event.preventDefault();
            this.toolSelectorService.changeTool(ToolName.Eraser);
        }
    }
    @HostListener('window:keydown.i', ['$event']) onI(event: KeyboardEvent) {
        if (this.shouldAllowShortcut()) {
            event.preventDefault();
            this.toolSelectorService.changeTool(ToolName.Dropper);
        }
    }
    @HostListener('window:keydown.s', ['$event']) onS(event: KeyboardEvent) {
        if (this.shouldAllowShortcut()) {
            event.preventDefault();
            this.toolSelectorService.changeTool(ToolName.Selection);
        }
    }

    // Workzone options
    // Will be implemented later
}

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { BehaviorSubject, Observable } from 'rxjs';

import { DrawingModalWindowService } from 'src/app/services/drawing-modal-window/drawing-modal-window.service';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { DrawingModalWindowComponent } from './drawing-modal-window.component';

describe('DrawingModalWindowComponent', () => {
    let component: DrawingModalWindowComponent;
    let fixture: ComponentFixture<DrawingModalWindowComponent>;
    let form: FormGroup;

    let drawingModalService: DrawingModalWindowService;
    let colorToolService: ColorToolService;
    let shortcutManagerService: ShortcutManagerService;

    const testColor = '23fe45';
    const dialogMock = {
        close: () => null,
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DrawingModalWindowComponent],
            providers: [
                FormBuilder,
                {
                    provide: MatDialogRef,
                    useValue: {},
                },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .overrideComponent(DrawingModalWindowComponent, {
                set: {
                    providers: [
                        {
                            provide: MatDialogRef,
                            useValue: dialogMock,
                        },
                        {
                            provide: DrawingModalWindowService,
                            useValue: {
                                changeDisplayNewDrawingModalWindow: () => null,
                                changeDrawingInfo: () => null,
                            },
                        },
                        {
                            provide: ColorToolService,
                            useValue: {
                                changeBackgroundColor: () => null,
                                addColorToQueue: () => null,
                            },
                        },
                        {
                            provide: ShortcutManagerService,
                            useValue: {
                                changeIsOnInput: () => null,
                            },
                        },
                    ],
                },
            })
            .compileComponents();

        fixture = TestBed.createComponent(DrawingModalWindowComponent);
        component = fixture.componentInstance;

        component.initializeForm();
        form = component.drawingModalForm;

        drawingModalService = fixture.debugElement.injector.get(DrawingModalWindowService);
        colorToolService = fixture.debugElement.injector.get(ColorToolService);
        shortcutManagerService = fixture.debugElement.injector.get(ShortcutManagerService);
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set displayNewDrawingModalWindow to subscribe to value in drawing modal window service', () => {
        const SPY = spyOn(component, 'initializeForm');
        colorToolService.backgroundColor = new BehaviorSubject<string>('');
        drawingModalService.currentDisplayNewDrawingModalWindow = new Observable<boolean>();
        colorToolService.previewColor = new BehaviorSubject<string>('');
        drawingModalService.blankDrawingZone = new BehaviorSubject<boolean>(true);
        component.ngOnInit();
        expect(SPY).toHaveBeenCalled();
    });

    it('should call initialize form when component is rendered', () => {
        const SPY = spyOn(component, 'initializeForm');
        colorToolService.backgroundColor = new BehaviorSubject<string>('');
        drawingModalService.currentDisplayNewDrawingModalWindow = new Observable<boolean>();
        colorToolService.previewColor = new BehaviorSubject<string>('');
        drawingModalService.blankDrawingZone = new BehaviorSubject<boolean>(true);
        component.ngOnInit();
        expect(SPY).toHaveBeenCalled();
    });

    it('should call Drawing Modal Window service changeDisplayNewDrawingModalWindow function on form submit', () => {
        const SPY = spyOn(drawingModalService, 'changeDisplayNewDrawingModalWindow');
        drawingModalService.blankDrawingZone = new BehaviorSubject<boolean>(false);
        component.onSubmit();
        expect(SPY).toHaveBeenCalledWith(false);
    });

    it('should call Drawing Modal Window service changeDrawingInfo function on form submit', () => {
        const SPY = spyOn(drawingModalService, 'changeDrawingInfo');
        drawingModalService.blankDrawingZone = new BehaviorSubject<boolean>(false);
        component.onSubmit();
        expect(SPY).toHaveBeenCalledWith(form.controls.width.value, form.controls.height.value);
    });

    it('should call Color Tool service changeBackgroundColor function on form submit', () => {
        const SPY = spyOn(colorToolService, 'changeBackgroundColor');
        drawingModalService.blankDrawingZone = new BehaviorSubject<boolean>(false);
        component.onSubmit();
        expect(SPY).toHaveBeenCalledWith(component.previewColor);
    });

    it('should set Drawing Modal Window service blankDrawingZone to false on form submit', () => {
        drawingModalService.blankDrawingZone = new BehaviorSubject<boolean>(true);
        component.onSubmit();
        expect(drawingModalService.blankDrawingZone.value).toEqual(false);
    });

    it('should call Color Tool service addColorToQueue function on form submit', () => {
        const SPY = spyOn(colorToolService, 'addColorToQueue');
        drawingModalService.blankDrawingZone = new BehaviorSubject<boolean>(false);
        component.onSubmit();
        expect(SPY).toHaveBeenCalledWith(component.previewColor);
    });

    it('should not resize the dimensions when form is dirty', () => {
        const spyWidthSetValue = spyOn(component.drawingModalForm.controls.width, 'setValue');
        const spyHeightSetValue = spyOn(component.drawingModalForm.controls.height, 'setValue');

        component.drawingModalForm.controls.width.markAsDirty();
        component.drawingModalForm.controls.height.markAsDirty();
        component.onResize();

        expect(spyWidthSetValue).not.toHaveBeenCalled();
        expect(spyHeightSetValue).not.toHaveBeenCalled();
    });

    it('should resize the window when form is clean', () => {
        const spyWidthSetValue = spyOn(component.drawingModalForm.controls.width, 'setValue');
        const spyHeightSetValue = spyOn(component.drawingModalForm.controls.height, 'setValue');

        component.drawingModalForm.controls.width.markAsUntouched();
        component.drawingModalForm.controls.height.markAsUntouched();
        component.onResize();

        expect(spyWidthSetValue).toHaveBeenCalled();
        expect(spyHeightSetValue).toHaveBeenCalled();
    });

    it('should close dialog on onCancel', () => {
        const SPY = spyOn(component[`dialogRef`], 'close');
        component.onCancel();
        expect(SPY).toHaveBeenCalled();
    });

    it('should return the right preview color when getUserColorIcon funtion is called', () => {
        component.previewColor = testColor;
        const iconStyle = component.getUserColorIcon();
        expect(iconStyle).toEqual({
            backgroundColor: '#' + testColor,
        });
    });

    it('should set a new preview color when Queue Color Button is clicked', () => {
        component.previewColor = '000000';
        component.onClickColorQueueButton(testColor);
        expect(component.previewColor).toEqual(testColor);
    });

    it('should set shortcut isOnInput flag to true on focus', () => {
        const SPY = spyOn(shortcutManagerService, 'changeIsOnInput');
        component.onFocus();
        expect(SPY).toHaveBeenCalledWith(true);
    });

    it('should set shortcut isOnInput flag to false on focus out', () => {
        const SPY = spyOn(shortcutManagerService, 'changeIsOnInput');
        component.onFocusOut();
        expect(SPY).toHaveBeenCalledWith(false);
    });
});

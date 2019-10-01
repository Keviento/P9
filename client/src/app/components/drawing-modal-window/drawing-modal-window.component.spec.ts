import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { BehaviorSubject } from 'rxjs';
import { DrawingModalWindowService } from 'src/app/services/drawing-modal-window/drawing-modal-window.service';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { DrawingModalWindowComponent } from './drawing-modal-window.component';

fdescribe('DrawingModalWindowComponent', () => {
    let component: DrawingModalWindowComponent;
    let fixture: ComponentFixture<DrawingModalWindowComponent>;
    let form: FormGroup;

    let drawingModalService: DrawingModalWindowService;
    let colorToolService: ColorToolService;
    // let shortCutManagerService: ShortcutManagerService;

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
                                changeDrawingInfoWidthHeight: () => null,
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
                            useValue: {},
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
        // shortCutManagerService = fixture.debugElement.injector.get(ShortcutManagerService);
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call Drawing Modal Window service changeDisplayNewDrawingModalWindow function on form submit', () => {
        const SPY = spyOn(drawingModalService, 'changeDisplayNewDrawingModalWindow');
        drawingModalService.blankDrawingZone = new BehaviorSubject<boolean>(false);
        component.onSubmit();
        expect(SPY).toHaveBeenCalledWith(false);
    });

    it('should call Drawing Modal Window service changeDrawingInfoWidthHeight function on form submit', () => {
        const SPY = spyOn(drawingModalService, 'changeDrawingInfoWidthHeight');
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

    it('should not resize the dimensions when form is dirty', () => {
        const spyWidthSetValue = spyOn(component.drawingModalForm.controls['width'], 'setValue');
        const spyHeightSetValue = spyOn(component.drawingModalForm.controls['height'], 'setValue');

        component.drawingModalForm.controls['width'].markAsDirty();
        component.drawingModalForm.controls['height'].markAsDirty();
        component.onResize();

        expect(spyWidthSetValue).not.toHaveBeenCalled();
        expect(spyHeightSetValue).not.toHaveBeenCalled();
    });

    it('should resize the window when form is clean', () => {
        const spyWidthSetValue = spyOn(component.drawingModalForm.controls['width'], 'setValue');
        const spyHeightSetValue = spyOn(component.drawingModalForm.controls['height'], 'setValue');

        component.drawingModalForm.controls['width'].markAsUntouched();
        component.drawingModalForm.controls['height'].markAsUntouched();
        component.onResize();

        expect(spyWidthSetValue).toHaveBeenCalled();
        expect(spyHeightSetValue).toHaveBeenCalled();
    });
});

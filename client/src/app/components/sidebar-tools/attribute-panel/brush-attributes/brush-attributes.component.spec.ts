import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';

import { BrushAttributesComponent } from './brush-attributes.component';
import { MatSliderChange } from '@angular/material';
import { AttributesManagerService } from 'src/app/services/tools/attributes-manager/attributes-manager.service';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Thickness } from 'src/constants/tool-constants';

fdescribe('BrushAttributesComponent', () => {
    let component: BrushAttributesComponent;
    let fixture: ComponentFixture<BrushAttributesComponent>;
    let event: MatSliderChange;
    let attributesManageService: AttributesManagerService;
    let shortcutManagerService: ShortcutManagerService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BrushAttributesComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                FormBuilder,
                {
                    provide: AttributesManagerService,
                    useValue: {
                        changeThickness: () => null,
                        changeStyle: () => 1,
                    },
                },
                {
                    provide: ShortcutManagerService,
                    useValue: {
                        changeIsOnInput: () => null,
                    },
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BrushAttributesComponent);
        component = fixture.componentInstance;
        component.initializeForm();

        event = new MatSliderChange();

        let injector = getTestBed();
        attributesManageService = injector.get<AttributesManagerService>(AttributesManagerService);
        shortcutManagerService = injector.get<ShortcutManagerService>(ShortcutManagerService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(`#onSliderChange should change the value of thickness if event value [${Thickness.Min},${Thickness.Max}]`, () => {
        event.value = Thickness.Default;
        component.onSliderChange(event);

        expect(component.brushAttributesForm.value.thickness).toBe(Thickness.Default);
    });

    it(`#onSliderChange should not change the value of thickness if event value < ${Thickness.Min}`, () => {
        const oldValue = component.brushAttributesForm.value.thickness;

        event.value = Thickness.Min - 1;
        component.onSliderChange(event);

        expect(component.brushAttributesForm.value.thickness).toBe(oldValue);
    });

    it(`#onSliderChange should not change the value of thickness if event value > ${Thickness.Max}`, () => {
        const oldValue = component.brushAttributesForm.value.thickness;

        event.value = Thickness.Max + 1;
        component.onSliderChange(event);

        expect(component.brushAttributesForm.value.thickness).toBe(oldValue);
    });

    it('#onSliderChange should not change the value of thickness if event value is null', () => {
        const oldValue = component.brushAttributesForm.value.thickness;

        event.value = null;
        component.onSliderChange(event);

        expect(component.brushAttributesForm.value.thickness).toBe(oldValue);
    });

    it(`#onSliderChange should call onThicknessChange if event value is [${Thickness.Min},${Thickness.Max}]`, () => {
        spyOn(component, 'onThicknessChange');
        event.value = Thickness.Default;
        component.onSliderChange(event);

        expect(component.onThicknessChange).toHaveBeenCalled();
    });

    it(`#onThicknessChange should call changeThickness if form thickness value is [${Thickness.Min},${Thickness.Max}]`, () => {
        let spy = spyOn(attributesManageService, 'changeThickness').and.returnValue();
        component.onThicknessChange();
        expect(spy).toHaveBeenCalled();
    });

    it(`#onThicknessChange should not change thickness of AttibuteManagerService if form thickness > ${Thickness.Max}`, () => {
        const oldValue = component.brushAttributesForm.value.thickness;

        component.brushAttributesForm.controls.thickness.setValue(Thickness.Max + 1);
        component.onThicknessChange();

        expect(attributesManageService.thickness.getValue()).toBe(oldValue);
    });

    it(`#onThicknessChange should not change thickness of AttibuteManagerService if form thickness < ${Thickness.Min}`, () => {
        const oldValue = component.brushAttributesForm.value.thickness;
        component.brushAttributesForm.controls.thickness.setValue(Thickness.Min - 1);

        component.onThicknessChange();

        expect(attributesManageService.thickness.getValue()).toBe(oldValue);
    });

    it('#onFocus should call changeIsOnInput when user in on focus', () => {
        let spy = spyOn(shortcutManagerService, 'changeIsOnInput').and.returnValue();
        component.onFocus();
        expect(spy).toHaveBeenCalled();
    });

    it('#onFocus should  call changeIsOnInput when user is out of focus', () => {
        let spy = spyOn(shortcutManagerService, 'changeIsOnInput').and.returnValue();
        component.onFocusOut();
        expect(spy).toHaveBeenCalled();
    });

    it('#change should call changeStyle when user select a brush style', () => {
        let spy = spyOn(attributesManageService, 'changeStyle').and.returnValues();
        component.change(1);
        expect(spy).toHaveBeenCalled();
    });
});

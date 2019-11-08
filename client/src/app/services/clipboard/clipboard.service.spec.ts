import { TestBed, getTestBed } from '@angular/core/testing';

import { ClipboardService } from './clipboard.service';
import { Renderer2, ElementRef, Type } from '@angular/core';
import { DrawStackService } from '../draw-stack/draw-stack.service';
import { ManipulatorService } from '../manipulator/manipulator.service';
import { Selection } from '../../../classes/selection/selection';
import * as TestHelpers from 'src/classes/test-helpers.spec';
import { OFFSET_STEP } from 'src/constants/tool-constants';

describe('ClipboardService', () => {
    let injector: TestBed;
    let service: ClipboardService;
    let selection: Selection;
    let manipulator: ManipulatorService;

    let rendererMock: Renderer2;
    let drawStackMock: DrawStackService;
    let elementRefMock: ElementRef<SVGElement>;

    let spyOnAppendChild: jasmine.Spy;
    let spyOnRemoveChild: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ManipulatorService,
                Selection,
                {
                    provide: Renderer2,
                    useValue: {
                        createElement: () => null,
                        setAttribute: () => null,
                        appendChild: () => null,
                        removeChild: () => null,
                    },
                },
                {
                    provide: ElementRef,
                    useValue: {
                        nativeElement: {
                            getBoundingClientRect: () => null,
                        },
                    },
                },
            ],
        });

        injector = getTestBed();
        rendererMock = injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
        drawStackMock = injector.get<DrawStackService>(DrawStackService as Type<DrawStackService>);
        elementRefMock = injector.get<ElementRef>(ElementRef as Type<ElementRef>);
        selection = new Selection(rendererMock, elementRefMock);
        manipulator = injector.get(ManipulatorService);
        manipulator.initializeService(rendererMock);
        service = injector.get(ClipboardService);
        service.initializeService(elementRefMock, rendererMock, drawStackMock, selection);

        spyOnAppendChild = spyOn(service.renderer, 'appendChild').and.returnValue();
        spyOnRemoveChild = spyOn(service.renderer, 'removeChild').and.returnValue();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should assign values to renderer, drawStack, selection and elementref when calling initializeService', () => {
        const mockService = injector.get(ClipboardService) as ClipboardService;

        mockService.initializeService(elementRefMock, rendererMock, drawStackMock, selection);

        expect(mockService.renderer).toBeTruthy();
        expect(mockService.drawStack).toBeTruthy();
        expect(mockService.selection).toBeTruthy();
        expect(mockService.elementRef).toBeTruthy();
    });

    it('should set offset to 0, add selection to duplicationBuffer and set firstDuplication to true if calling restartDuplication', () => {
        const spyOnClear = spyOn(service.duplicationBuffer, 'clear');
        const spyOnAdd = spyOn(service.duplicationBuffer, 'add');
        service.selection.selectedElements.add(TestHelpers.createMockSVGGElement());
        service.restartDuplication();

        expect(spyOnClear).toHaveBeenCalled();
        expect(spyOnAdd).toHaveBeenCalled();
        expect(service.offsetValue).toEqual(0);
        expect(service.firstDuplication).toBeTruthy();
    });

    it('should increase the offset, clone the selection to workzone and update the selection when calling clone', () => {
        const elementsToClone: Set<SVGGElement> = new Set<SVGGElement>();
        const elementToClone = {
            cloneNode: (bool: boolean) => {
                return TestHelpers.createMockSVGGElement();
            },
        };
        elementsToClone.add((elementToClone as unknown) as SVGGElement);

        const spyOnPush = spyOn(drawStackMock, 'push');
        const spyOnUpdateSelection = spyOn(service, 'updateSelection');
        const spyOnManipulator = spyOn(manipulator, 'offsetSingle');
        const spyOnIncreaseOffset = spyOn(service, 'increaseOffsetValue');

        service.clone(elementsToClone);

        expect(spyOnAppendChild).toHaveBeenCalled();
        expect(spyOnPush).toHaveBeenCalled();
        expect(spyOnUpdateSelection).toHaveBeenCalled();
        expect(spyOnManipulator).toHaveBeenCalled();
        expect(spyOnIncreaseOffset).toHaveBeenCalled();
    });

    it('should emptySelection and add new elements to selection when calling updateSelection', () => {
        const newElements: Set<SVGGElement> = new Set<SVGGElement>();
        newElements.add(TestHelpers.createMockSVGGElement());

        const spyOnEmptySelection = spyOn(service.selection, 'emptySelection');
        const spyOnAddToSelection = spyOn(service.selection, 'addToSelection');

        service.updateSelection(newElements);

        expect(spyOnEmptySelection).toHaveBeenCalled();
        expect(spyOnAddToSelection).toHaveBeenCalled();
    });

    it('should update clippingsBound with the selection bounds when calling fetchSelectionBounds', () => {
        const mockDOMRect = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        };

        const mockSVGRect = {
            getBoundingClientRect: () => {
                return (mockDOMRect as unknown) as DOMRect;
            },
        };

        service.selection.selectionBox = (mockSVGRect as unknown) as SVGRectElement;

        spyOn(service.selection.selectionBox, 'getBoundingClientRect').and.returnValue(
            (mockDOMRect as unknown) as DOMRect
        );

        service.fetchSelectionBounds();

        expect(service.clippingsBound).toEqual((mockDOMRect as unknown) as DOMRect);
    });

    it('should return true if clippingsBound is inside the workzone when calling isInBounds', () => {
        const mockDOMRect = {
            x: 0,
            y: 0,
            width: 400,
            height: 400,
        };

        const mockClippingsBound = {
            x: 10,
            y: 10,
            width: 10,
            height: 10,
        };
        service.clippingsBound = (mockClippingsBound as unknown) as DOMRect;
        spyOn(service.elementRef.nativeElement, 'getBoundingClientRect').and.returnValue(
            (mockDOMRect as unknown) as DOMRect
        );

        const res = service.isInBounds();

        expect(res).toBeTruthy();
    });

    it('should return false if clippingsBound is inside the workzone when calling isInBounds', () => {
        const mockDOMRect = {
            x: 0,
            y: 0,
            width: 400,
            height: 400,
        };

        const mockClippingsBound = {
            x: 410,
            y: 410,
            width: 10,
            height: 10,
        };
        service.clippingsBound = (mockClippingsBound as unknown) as DOMRect;
        spyOn(service.elementRef.nativeElement, 'getBoundingClientRect').and.returnValue(
            (mockDOMRect as unknown) as DOMRect
        );

        const res = service.isInBounds();

        expect(res).toBeFalsy();
    });

    it('should reset the offsetValue if not in bounds when calling handleOutOfBounds', () => {
        const spyOnIsInBounds = spyOn(service, 'isInBounds').and.callFake(() => {
            return false;
        });
        const spyOnFetchSelectionBounds = spyOn(service, 'fetchSelectionBounds');
        const mockDOMRect = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        };
        const mockSVGRect = {
            getBoundingClientRect: () => {
                return (mockDOMRect as unknown) as DOMRect;
            },
        };
        service.selection.selectionBox = (mockSVGRect as unknown) as SVGRectElement;

        service.increaseOffsetValue();
        service.handleOutOfBounds();

        expect(spyOnIsInBounds).toHaveBeenCalled();
        expect(spyOnFetchSelectionBounds).toHaveBeenCalled();
        expect(service.offsetValue).toEqual(0);
    });

    it('should not reset the offsetValue if in bounds when calling handleOutOfBounds', () => {
        const spyOnIsInBounds = spyOn(service, 'isInBounds').and.callFake(() => {
            return true;
        });
        const spyOnFetchSelectionBounds = spyOn(service, 'fetchSelectionBounds');
        const mockDOMRect = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        };
        const mockSVGRect = {
            getBoundingClientRect: () => {
                return (mockDOMRect as unknown) as DOMRect;
            },
        };
        service.selection.selectionBox = (mockSVGRect as unknown) as SVGRectElement;

        service.increaseOffsetValue();
        service.handleOutOfBounds();

        expect(spyOnIsInBounds).toHaveBeenCalled();
        expect(spyOnFetchSelectionBounds).toHaveBeenCalled();
        expect(service.offsetValue).toEqual(OFFSET_STEP);
    });

    it('should increase the offsetValue of OFFSET_STEP when calling increaseOffsetValue', () => {
        service.increaseOffsetValue();

        expect(service.offsetValue).toEqual(OFFSET_STEP);
    });

    it('should decrease the offsetValue by OFFSET_STEP and not let it under 0 when calling decreaseOffsetValue', () => {
        service.decreaseOffsetValue();

        expect(service.offsetValue).toEqual(0);
    });

    it('should decrease the offsetValue by OFFSET_STEP and when calling decreaseOffsetValue', () => {
        service.increaseOffsetValue();
        service.decreaseOffsetValue();

        expect(service.offsetValue).toEqual(0);
    });

    it('should remove cut elements from workzone, clear the selection and add them to a cleared clippings when calling cut', () => {
        const spyOnFetch = spyOn(service, 'fetchSelectionBounds').and.callFake(() => null);
        const spyOnClearClippings = spyOn(service.clippings, 'clear');
        const spyOnAddClippings = spyOn(service.clippings, 'add');
        const spyOnClearDuplicationBuffer = spyOn(service.duplicationBuffer, 'clear');
        const spyOnDeleteDrawStack = spyOn(service.drawStack, 'delete').and.callFake((el: SVGGElement) => null);
        const spyOnEmptySelection = spyOn(service.selection, 'emptySelection');

        service.selection.selectedElements.add(TestHelpers.createMockSVGGElement());

        service.cut();

        expect(service.firstDuplication).toBeTruthy();
        expect(service.offsetValue).toEqual(0);
        expect(spyOnClearDuplicationBuffer).toHaveBeenCalled();
        expect(spyOnClearClippings).toHaveBeenCalled();
        expect(spyOnFetch).toHaveBeenCalled();
        expect(spyOnAddClippings).toHaveBeenCalled();
        expect(spyOnRemoveChild).toHaveBeenCalled();
        expect(spyOnDeleteDrawStack).toHaveBeenCalled();
        expect(spyOnEmptySelection).toHaveBeenCalled();
    });

    it('should add copied elements to a cleared clippings', () => {
        const spyOnFetch = spyOn(service, 'fetchSelectionBounds').and.callFake(() => null);
        const spyOnClearClippings = spyOn(service.clippings, 'clear');
        const spyOnAddClippings = spyOn(service.clippings, 'add');
        const spyOnClearDuplicationBuffer = spyOn(service.duplicationBuffer, 'clear');

        service.selection.selectedElements.add(TestHelpers.createMockSVGGElement());

        service.copy();

        expect(service.firstDuplication).toBeTruthy();
        expect(service.offsetValue).toEqual(0);
        expect(spyOnClearDuplicationBuffer).toHaveBeenCalled();
        expect(spyOnClearClippings).toHaveBeenCalled();
        expect(spyOnFetch).toHaveBeenCalled();
        expect(spyOnAddClippings).toHaveBeenCalled();
    });

    it('should call clone and handleOutOfBounds when calling duplicate', () => {
        const spyOnClone = spyOn(service, 'clone').and.callFake((set: Set<SVGGElement>) => null);
        const spyOnHandleOutOfBounds = spyOn(service, 'handleOutOfBounds').and.callFake(() => null);

        service.selection.selectedElements.add(TestHelpers.createMockSVGGElement());
        service.duplicate();

        expect(spyOnClone).toHaveBeenCalled();
        expect(spyOnHandleOutOfBounds).toHaveBeenCalled();
    });

    it('should replace duplicationBuffer for selection and reset offset when first calling duplicate', () => {
        const spyOnClone = spyOn(service, 'clone').and.callFake((set: Set<SVGGElement>) => null);
        const spyOnHandleOutOfBounds = spyOn(service, 'handleOutOfBounds').and.callFake(() => null);
        const spyOnClearDuplicationBuffer = spyOn(service.duplicationBuffer, 'clear');
        const spyOnAddDuplicationBuffer = spyOn(service.duplicationBuffer, 'add');

        service.selection.selectedElements.add(TestHelpers.createMockSVGGElement());
        service.duplicate();

        expect(spyOnClone).toHaveBeenCalled();
        expect(spyOnHandleOutOfBounds).toHaveBeenCalled();
        expect(spyOnClearDuplicationBuffer).toHaveBeenCalled();
        expect(spyOnAddDuplicationBuffer).toHaveBeenCalled();
        expect(service.firstDuplication).toBeFalsy();
        expect(service.offsetValue).toEqual(0);
    });

    it('should call clone and handleOutOfBounds when calling paste', () => {
        const spyOnClone = spyOn(service, 'clone').and.callFake((set: Set<SVGGElement>) => null);
        const spyOnHandleOutOfBounds = spyOn(service, 'handleOutOfBounds').and.callFake(() => null);

        service.selection.selectedElements.add(TestHelpers.createMockSVGGElement());
        service.paste();

        expect(spyOnClone).toHaveBeenCalled();
        expect(spyOnHandleOutOfBounds).toHaveBeenCalled();
        expect(service.firstDuplication).toBeTruthy();
    });

    it('should remove selection from workzone, clear the selection and clear duplicationBuffer when calling delete', () => {
        const spyOnClearDuplicationBuffer = spyOn(service.duplicationBuffer, 'clear');
        const spyOnDeleteDrawStack = spyOn(service.drawStack, 'delete').and.callFake((el: SVGGElement) => null);
        const spyOnEmptySelection = spyOn(service.selection, 'emptySelection');

        service.selection.selectedElements.add(TestHelpers.createMockSVGGElement());

        service.delete();

        expect(service.firstDuplication).toBeTruthy();
        expect(service.offsetValue).toEqual(0);
        expect(spyOnClearDuplicationBuffer).toHaveBeenCalled();
        expect(spyOnRemoveChild).toHaveBeenCalled();
        expect(spyOnDeleteDrawStack).toHaveBeenCalled();
        expect(spyOnEmptySelection).toHaveBeenCalled();
    });
});

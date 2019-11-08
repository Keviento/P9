import { ElementRef, Renderer2, Type } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';

import { SVGGElementInfo } from 'src/classes/svggelement-info';
import {
    createKeyBoardEvent,
    createMockSVGGElementWithAttribute,
    createMouseEvent,
} from 'src/classes/test-helpers.spec';
import { Keys, SVG_NS } from 'src/constants/constants';
import { HTMLAttribute, ToolName } from 'src/constants/tool-constants';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { EraserToolService } from './eraser-tool.service';

describe('EraserToolService', () => {
    let injector: TestBed;
    let service: EraserToolService;
    let leftMouseEvent: MouseEvent;
    let rightMouseEvent: MouseEvent;

    let spyOnremoveChild: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                EraserToolService,
                {
                    provide: Renderer2,
                    useValue: {
                        createElement: () => null,
                        setAttribute: () => null,
                        appendChild: () => null,
                        removeChild: () => null,
                        setProperty: () => null,
                    },
                },
                {
                    provide: DrawStackService,
                    useValue: {
                        push: () => null,
                        currentStackTarget: {
                            subscribe: () => null,
                        },
                        getElementByPosition: () => {
                            const mockSVGGElement = {
                                getAttribute: () => null,
                            };
                            return (mockSVGGElement as unknown) as SVGGElement;
                        },
                        removeElementByPosition: () => null,
                        getDrawStackLength: () => 1,
                        drawStack: () => {
                            const mockdrawStack = {
                                getAttribute: () => null,
                            };
                            return (mockdrawStack as unknown) as SVGGElement[];
                        },
                        renderer: () => {
                            const mockrenderer = {};
                            return (mockrenderer as unknown) as Renderer2;
                        },
                        changeTargetElement: () => null,
                        delete: () => null,
                    },
                },
                {
                    provide: ElementRef,
                    useValue: {
                        nativeElement: {
                            getBoundingClientRect: () => {
                                const boundleft = 0;
                                const boundtop = 0;
                                const boundRect = {
                                    left: boundleft,
                                    top: boundtop,
                                };
                                return boundRect;
                            },
                        },
                    },
                },
            ],
        });

        injector = getTestBed();
        service = injector.get(EraserToolService);
        const rendererMock = injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
        const drawStackMock = injector.get<DrawStackService>(DrawStackService as Type<DrawStackService>);
        const elementRefMock = injector.get<ElementRef>(ElementRef as Type<ElementRef>);
        service.initializeService(elementRefMock, rendererMock, drawStackMock);

        leftMouseEvent = createMouseEvent(10, 10, 0);
        rightMouseEvent = createMouseEvent(10, 10, 2);

        spyOnremoveChild = spyOn(service.renderer, 'removeChild').and.returnValue();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call onMouseDown if isLeftMouseDown is true', () => {
        service.isLeftMouseDown = true;
        const spyOnMouseDown: jasmine.Spy = spyOn(service, 'onMouseDown');
        const spyOncheckElementsToErase: jasmine.Spy = spyOn(service, 'checkElementsToErase');

        service.onMouseMove(leftMouseEvent);

        expect(spyOnMouseDown).toHaveBeenCalled();
        expect(spyOncheckElementsToErase).toHaveBeenCalled();
    });

    it('should not call onMouseDown if isLeftMouseDown is false', () => {
        service.isLeftMouseDown = false;
        const spyOnMouseDown: jasmine.Spy = spyOn(service, 'onMouseDown');
        const spyOncheckElementsToErase: jasmine.Spy = spyOn(service, 'checkElementsToErase');

        service.onMouseMove(leftMouseEvent);

        expect(spyOnMouseDown).toHaveBeenCalledTimes(0);
        expect(spyOncheckElementsToErase).toHaveBeenCalled();
    });

    it('needToBeErased should return true if the left button is clicked', () => {
        service.isOnTarget = true;

        expect(service.needToBeErased(leftMouseEvent.button)).toEqual(true);
    });

    it('needToBeErased should return false if the right button is clicked', () => {
        service.isOnTarget = true;

        expect(service.needToBeErased(rightMouseEvent.button)).toEqual(false);
    });

    it('should call appendSquare if isSquareAppended is false', () => {
        service.isSquareAppended = false;
        const spyOnappendSquare: jasmine.Spy = spyOn(service, 'appendSquare');

        service.setSquareToMouse(leftMouseEvent);

        expect(spyOnappendSquare).toHaveBeenCalled();
    });

    it('should not call appendSquare if isSquareAppended is true', () => {
        service.isSquareAppended = true;
        const spyOnappendSquare: jasmine.Spy = spyOn(service, 'appendSquare');

        service.setSquareToMouse(leftMouseEvent);

        expect(spyOnappendSquare).toHaveBeenCalledTimes(0);
    });

    it('should call removeChild if isOnTarget is true and getElementByPosition returns an element', () => {
        service.isOnTarget = true;
        const spyOncheckElementsToErase: jasmine.Spy = spyOn(service, 'checkElementsToErase');
        const spyOngetElementByPosition: jasmine.Spy = spyOn(service.drawStack, 'getElementByPosition').and.returnValue(
            service.renderer.createElement('rect', SVG_NS),
        );

        service.onMouseDown(leftMouseEvent);

        expect(service.isLeftMouseDown).toEqual(true);
        expect(spyOncheckElementsToErase).toHaveBeenCalled();
        expect(spyOnremoveChild).toHaveBeenCalled();
        expect(spyOngetElementByPosition).toHaveBeenCalled();
    });

    it('should call checkElementsToErase if isOnTarget is false and set isOnTarget to false', () => {
        service.isOnTarget = false;
        const spyOncheckElementsToErase: jasmine.Spy = spyOn(service, 'checkElementsToErase');

        service.onMouseDown(rightMouseEvent);

        expect(service.isOnTarget).toEqual(false);
        expect(spyOncheckElementsToErase).toHaveBeenCalled();
    });

    it('isTouchingElementBox should return true if selection box and elementBox are in touch', () => {
        const selectionBox = new DOMRect(0, 0, 0, 0);
        const elBox = new DOMRect(0, 0, 0, 0);

        expect(service.isTouchingElementBox(selectionBox, elBox, 1)).toEqual(true);
    });

    it('isTouchingElementBox should return false if selection box and elementBox are not in touch', () => {
        const selectionBox = new DOMRect(0, 0, 0, 0);
        const elBox = new DOMRect(10, 10, 1, 1);

        expect(service.isTouchingElementBox(selectionBox, elBox)).toEqual(false);
    });

    it('checkElementsToErase should call get and set function of changedElements if an element does not exist', () => {
        const spyOngetDOMRect: jasmine.Spy = spyOn(service, 'getDOMRect').and.returnValue(new DOMRect(0, 0, 0, 0));
        const spyOngetDrawStackLength: jasmine.Spy = spyOn(service.drawStack, 'getDrawStackLength').and.returnValue(1);
        const spyOnisTouchingElementBox: jasmine.Spy = spyOn(service, 'isTouchingElementBox').and.returnValue(true);
        const spyOnget: jasmine.Spy = spyOn(service.changedElements, 'get').and.returnValue(undefined);
        const spyOnset: jasmine.Spy = spyOn(service.changedElements, 'set');

        service.drawStack.drawStack[0] = createMockSVGGElementWithAttribute('id_element');

        service.checkElementsToErase();

        expect(spyOngetDOMRect).toHaveBeenCalled();
        expect(spyOngetDrawStackLength).toHaveBeenCalled();
        expect(spyOnisTouchingElementBox).toHaveBeenCalled();
        expect(spyOnget).toHaveBeenCalled();
        expect(spyOnset).toHaveBeenCalled();
    });

    it('checkElementsToErase should not call set function of changedElements if an element exists', () => {
        spyOn(service, 'getDOMRect').and.returnValue(new DOMRect(0, 0, 0, 0));
        spyOn(service.drawStack, 'getDrawStackLength').and.returnValue(1);
        spyOn(service, 'isTouchingElementBox').and.returnValue(true);
        const spyOnget: jasmine.Spy = spyOn(service.changedElements, 'get').and.returnValue(new SVGGElementInfo());
        const spyOnset: jasmine.Spy = spyOn(service.changedElements, 'set');

        service.drawStack.drawStack[0] = createMockSVGGElementWithAttribute('id_element');

        service.checkElementsToErase();

        expect(spyOnget).toHaveBeenCalled();
        expect(spyOnset).toHaveBeenCalledTimes(0);
    });

    it('checkElementsToErase should not call set function of changedElements if lastElementColoredNumber equals "topElement"', () => {
        spyOn(service, 'getDOMRect').and.returnValue(new DOMRect(0, 0, 0, 0));
        spyOn(service.drawStack, 'getDrawStackLength').and.returnValue(1);
        spyOn(service, 'isTouchingElementBox').and.returnValue(true);
        service.lastElementColoredNumber = 0;
        const spyOnset: jasmine.Spy = spyOn(service.changedElements, 'set');

        service.drawStack.drawStack[0] = createMockSVGGElementWithAttribute('id_element');

        service.checkElementsToErase();

        expect(spyOnset).toHaveBeenCalledTimes(0);
    });

    it('checkElementsToErase should call removeBorder if isTouchingElementBox returns false', () => {
        const spyOngetDOMRect: jasmine.Spy = spyOn(service, 'getDOMRect').and.returnValue(new DOMRect(0, 0, 0, 0));
        const spyOngetDrawStackLength: jasmine.Spy = spyOn(service.drawStack, 'getDrawStackLength').and.returnValue(1);
        const spyOnisTouchingElementBox: jasmine.Spy = spyOn(service, 'isTouchingElementBox').and.returnValue(false);

        service.drawStack.drawStack[0] = createMockSVGGElementWithAttribute('id_element');

        const spyOnremoveBorder: jasmine.Spy = spyOn(service, 'removeBorder');

        service.checkElementsToErase();

        expect(spyOngetDOMRect).toHaveBeenCalled();
        expect(spyOngetDrawStackLength).toHaveBeenCalled();
        expect(spyOnisTouchingElementBox).toHaveBeenCalled();
        expect(spyOnremoveBorder).toHaveBeenCalled();
    });

    it('mouseOverColorBorder should call setAttribute if border width is null', () => {
        const spyOnsetAttribute: jasmine.Spy = spyOn(service.renderer, 'setAttribute');
        const spyOngetElementByPosition: jasmine.Spy = spyOn(service.drawStack, 'getElementByPosition').and.returnValue(
            createMockSVGGElementWithAttribute('id_element'),
        );

        service.mouseOverColorBorder(0, null, ToolName.Pen);

        expect(spyOnsetAttribute).toHaveBeenCalled();
        expect(spyOngetElementByPosition).toHaveBeenCalled();
    });

    it('mouseOverColorBorder should call setAttribute if border width is not null', () => {
        const spyOnsetAttribute: jasmine.Spy = spyOn(service.renderer, 'setAttribute');

        service.mouseOverColorBorder(0, '5', ToolName.Rectangle);

        expect(spyOnsetAttribute).toHaveBeenCalled();
    });

    it('mouseOutRestoreBorder should call setAttribute if border width is null', () => {
        const spyOnsetAttribute: jasmine.Spy = spyOn(service.renderer, 'setAttribute');
        const spyOngetElementByPosition: jasmine.Spy = spyOn(service.drawStack, 'getElementByPosition').and.returnValue(
            createMockSVGGElementWithAttribute('id_element'),
        );

        service.mouseOutRestoreBorder(0, null, null, ToolName.Pen);

        expect(spyOnsetAttribute).toHaveBeenCalled();
        expect(spyOngetElementByPosition).toHaveBeenCalled();
    });

    it('mouseOutRestoreBorder should call setAttribute if border width is not null', () => {
        const spyOnsetAttribute: jasmine.Spy = spyOn(service.renderer, 'setAttribute');

        service.mouseOutRestoreBorder(0, 'ffffff', '1', ToolName.Rectangle);

        expect(spyOnsetAttribute).toHaveBeenCalled();
    });

    it('removeBorder should call mouseOutRestoreBorder if element is not undefined', () => {
        service.currentTarget = 0;
        service.drawStack.drawStack[0] = service.renderer.createElement('rect', SVG_NS);
        service.changedElements.set('0', new SVGGElementInfo());
        const spyOnmouseOutRestoreBorder: jasmine.Spy = spyOn(service, 'mouseOutRestoreBorder');
        const spyOnget: jasmine.Spy = spyOn(service.changedElements, 'get').and.returnValue(new SVGGElementInfo());

        service.removeBorder('0', '');

        expect(spyOnmouseOutRestoreBorder).toHaveBeenCalled();
        expect(spyOnget).toHaveBeenCalled();
    });

    it('removeBorder should call get of changedElements if currentTraget is not undefined', () => {
        service.currentTarget = 0;
        service.drawStack.drawStack[0] = service.renderer.createElement('rect', SVG_NS);
        service.changedElements.set('0', new SVGGElementInfo());
        const spyOnmouseOutRestoreBorder: jasmine.Spy = spyOn(service, 'mouseOutRestoreBorder');
        const spyOnget: jasmine.Spy = spyOn(service.changedElements, 'get').and.returnValue(undefined);

        service.removeBorder('0');

        expect(spyOnmouseOutRestoreBorder).toHaveBeenCalledTimes(0);
        expect(spyOnget).toHaveBeenCalled();
    });

    it('removeBorder should not call spyOnmouseOutRestoreBorder if currentTraget is undefined', () => {
        service.currentTarget = -1;
        const spyOnmouseOutRestoreBorder: jasmine.Spy = spyOn(service, 'mouseOutRestoreBorder');

        service.removeBorder('0');

        expect(spyOnmouseOutRestoreBorder).toHaveBeenCalledTimes(0);
    });

    it('getDOMRect should return a new DOMRect object', () => {
        const mockDOMRect = {
            x: 500,
            y: 500,
            width: 50,
            height: 50,
        };

        expect(service.getDOMRect(createMockSVGGElementWithAttribute('test'))).toEqual(mockDOMRect as DOMRect);
    });

    it('getStrokeWidth should return 10 if the getAttribute requested exists', () => {
        const element = createMockSVGGElementWithAttribute(HTMLAttribute.stroke_width);

        expect(service.getStrokeWidth(element)).toEqual(10);
    });

    it('getStrokeWidth should return 0 if the getAttribute requested does not exist', () => {
        const element = createMockSVGGElementWithAttribute('test');

        expect(service.getStrokeWidth(element)).toEqual(0);
    });

    it('onMouseUp should set isLeftMouseDown to false if it is a left mouse click ', () => {
        service.isLeftMouseDown = true;

        service.onMouseUp(leftMouseEvent);

        expect(service.isLeftMouseDown).toEqual(false);
    });

    it('onMouseUp should not set isLeftMouseDown to false if it is a right mouse click ', () => {
        service.isLeftMouseDown = true;

        service.onMouseUp(rightMouseEvent);

        expect(service.isLeftMouseDown).toEqual(true);
    });

    it('onMouseEnter should call appendSquare', () => {
        const spyOnappendSquare: jasmine.Spy = spyOn(service, 'appendSquare');

        service.onMouseEnter(leftMouseEvent);

        expect(spyOnappendSquare).toHaveBeenCalled();
    });

    it('onMouseOver should return undefined if onMouseOver is not implemented', () => {
        expect(service.onMouseOver(leftMouseEvent)).toBeUndefined();
    });

    it('onKeyDown should return undefined if onKeyDown is not implemented', () => {
        expect(service.onKeyDown(createKeyBoardEvent(Keys.Alt))).toBeUndefined();
    });

    it('onKeyUp should return undefined if onKeyUp is not implemented', () => {
        expect(service.onKeyUp(createKeyBoardEvent(Keys.Alt))).toBeUndefined();
    });

    it('onMouseLeave should call removeChild', () => {
        service.onMouseLeave(leftMouseEvent);

        expect(spyOnremoveChild).toHaveBeenCalled();
    });

    it('cleanUp should call removeChild', () => {
        service.cleanUp();

        expect(spyOnremoveChild).toHaveBeenCalled();
    });

    it('cleanUp should call removeBorder if lastElementColoredNumber is different than 1', () => {
        service.lastElementColoredNumber = 1;
        const spyOnremoveBorder: jasmine.Spy = spyOn(service, 'removeBorder');

        service.cleanUp();

        expect(spyOnremoveChild).toHaveBeenCalled();
        expect(spyOnremoveBorder).toHaveBeenCalled();
    });
});
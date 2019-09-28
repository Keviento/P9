import { ElementRef, Renderer2, Type } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';

import { DrawStackService } from 'src/app/services/draw-stack/draw-stack.service';
import { Mouse } from 'src/constants/constants';
import {  createMouseEvent, createMockSVGCircle } from '../test-helpers'; // , createMouseEvent,
import { TracingToolService } from './tracing-tool.service';

const MOCK_X = 10;
const MOCK_Y = 10;
const mockMouseLeftButton = createMouseEvent(MOCK_X, MOCK_Y, Mouse.LeftButton);

fdescribe('TracingToolService', () => {
    let injector: TestBed;
    let service: TracingToolService;
    let renderer: Renderer2;

    let spyOnSetAttribute: jasmine.Spy;
    let spyOnAppendChild: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TracingToolService,
            {
                provide: Renderer2,
                useValue: {
                    createElement: () => null,
                    setAttribute: () => null,
                    appendChild: () => null,
                },
            }, {
                provide: ElementRef,
                useValue: {
                    nativeElement : {},
                },
            }, {
                provide: DrawStackService,
                useValue: {
                    push: () => null,
                    getDrawStackLength: () => 0,
                },
            }],
        });

        injector = getTestBed();
        service = injector.get(TracingToolService);

        spyOn(service, 'getXPos').and.returnValue(MOCK_X);
        spyOn(service, 'getYPos').and.returnValue(MOCK_Y);

        renderer = injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
        spyOnSetAttribute = spyOn(renderer, 'setAttribute').and.returnValue();
        spyOnAppendChild = spyOn(renderer, 'appendChild').and.returnValue();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('when onMouseDown isDrawing should be true', () => {
        // Arrange
        spyOn(service, 'createSVGWrapper').and.returnValue();
        spyOn(service, 'createSVGCircle').and.returnValue(null as unknown as SVGCircleElement);
        spyOn(service, 'createSVGPath').and.returnValue();
        // Act
        service.onMouseDown(mockMouseLeftButton);
        // Assert
        expect(service.getIsDrawing()).toBeTruthy();
    });

    it('when onMouseDown currentPath contain M and mouse position', () => {
        // Arrange
        spyOn(service, 'createSVGWrapper').and.returnValue();
        spyOn(service, 'createSVGCircle').and.returnValue(null as unknown as SVGCircleElement);
        spyOn(service, 'createSVGPath').and.returnValue();
        // Act
        service.onMouseDown(mockMouseLeftButton);
        // Assert
        expect(service.getCurrentPath()).toContain(`M${MOCK_X} ${MOCK_Y}`);
    });

    it('when onMouseMove if notDrawing should not update currentPath', () => {
        // Arrange
        spyOn(service, 'getIsDrawing').and.returnValue(false);
        // Act
        service.onMouseMove(mockMouseLeftButton);
        // Assert
        expect(service.getCurrentPath()).toBe('');
    });

    it('when onMouseMove if isDrawing currentPath contain L and mouse position', () => {
        // Arrange
        spyOn(service, 'getIsDrawing').and.returnValue(true);
        spyOn(service, 'updateSVGPath').and.returnValue();
        spyOn(service, 'updatePreviewCircle').and.returnValue();
        // Act
        service.onMouseMove(mockMouseLeftButton);
        // Assert
        expect(service.getCurrentPath()).toContain(`L${MOCK_X} ${MOCK_Y}`);
    });

    it('when onMouseUp if isDrawing then currentPath is empty', () => {
        // Arrange
        spyOn(service, 'getIsDrawing').and.returnValue(true);
        // Act
        service.onMouseUp(mockMouseLeftButton);
        // Assert
        expect(service.getCurrentPath()).toBe('');
    });

    it('when onMouseLeave then onMouseUp is called', () => {
        // Arrange
        const spyMouseUp = spyOn(service, 'onMouseUp').and.returnValue();
        // Act
        service.onMouseLeave(mockMouseLeftButton);
        // Assert
        expect(spyMouseUp).toHaveBeenCalled ();
    });

    it('when createSVGWrapper is called renderer.setAttribute is called before appendChild', () => {
        // Arrange
        // Act
        service.createSVGWrapper();
        // Assert
        expect(spyOnSetAttribute).toHaveBeenCalledBefore(spyOnAppendChild);
    });

    it('when createSVGCircle then renderer.createElement is called before setAttribute and before appendChild', () => {
        // Arrange
        const mockCircle = createMockSVGCircle();
        const spyOnCreateElement = spyOn(renderer, 'createElement').and.returnValue(mockCircle);
        // Act
        service.createSVGCircle(MOCK_X, MOCK_Y);
        // Assert
        expect(spyOnCreateElement).toHaveBeenCalledBefore(spyOnSetAttribute);
        expect(spyOnSetAttribute).toHaveBeenCalledBefore(spyOnAppendChild);
    })

    it('when updatePreviewCirlce then renderer.setAttribute is called twice', () => {
        // Arrange
        // Act
        service.updatePreviewCircle(MOCK_X, MOCK_Y);
        // Assert
        expect(spyOnSetAttribute).toHaveBeenCalledTimes(2);
    });

    it('when updateSVGPath then renderer.setAttribute is called', () => {
        // Arrange
        // Act
        service.updateSVGPath();
        // Assert
        expect(spyOnSetAttribute).toHaveBeenCalled();
    })

    // it('when MouseEvent is left button currentPath contains M and mouse position', () => {
    //     spyOn(service, 'createSVGWrapper').and.returnValue();
    //     //spyOn(service, 'createSVGCircle').and.callFake();
    // });

    // it('when createSVGWrapper renderer.creteElement should be called before renderer.setAttribute', () => {
    //     const createElementSpy = spyOn(renderer, 'createElement').and.callThrough();
    //     const setAttributeSpy = spyOn(renderer, 'setAttribute').and.callThrough();
    //     service.createSVGWrapper();
    //     expect(createElementSpy).toHaveBeenCalledBefore(setAttributeSpy);
    // });

    // it('when onMouseDown if LeftButton createSVGWrapper is called', () => {
    //     const createSVGWrapperSpy = spyOn(service, 'createSVGWrapper').and.returnValue();
    //     service.onMouseDown(mockMouseLeftButton);
    //     expect(createSVGWrapperSpy).toHaveBeenCalled();
    // });

});

import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { CanvasToBMP } from 'src/classes/CanvasToBMP';
import { SVG_NS } from 'src/constants/constants';
import { FILE_TYPE, HTML_ATTRIBUTE, MAX_BMP_SIZE } from 'src/constants/tool-constants';

@Injectable({
    providedIn: 'root',
})
export class ExportToolService {
    private svg: SVGElement;
    private anchor: HTMLAnchorElement;
    private canvas: HTMLCanvasElement;
    private renderer: Renderer2;
    private img: HTMLImageElement;
    private fileType: FILE_TYPE;
    private filename: string;
    private canvasToBMP: CanvasToBMP;

    private launchDownload(): void {
        if (typeof(this.fileType) !== 'string') {
            this.fileType = FILE_TYPE.SVG;
        }
        this.renderer.setAttribute(this.anchor, HTML_ATTRIBUTE.Download, `${this.filename}.${this.fileType}`);
        this.anchor.click();
    }

    private getXMLSVG(): string {
        return new XMLSerializer().serializeToString(this.svg);
    }

    private createSVGBlob(): Blob {
        this.renderer.setAttribute(this.svg, 'xmlns', SVG_NS);
        return new Blob([this.getXMLSVG()], { type: 'image/svg+xml;charset=utf-8' });
    }

    initializeService(ref: ElementRef<SVGElement>, renderer: Renderer2): void {
        this.svg = ref.nativeElement;
        this.renderer = renderer;
        this.canvas = this.renderer.createElement(HTML_ATTRIBUTE.Canvas);
        this.anchor = this.renderer.createElement(HTML_ATTRIBUTE.A);
        this.img = this.renderer.createElement(HTML_ATTRIBUTE.Img);
    }

    saveFile(fileType: FILE_TYPE, filename: string): void {
        this.fileType = fileType;
        this.filename = filename;
        this.resizeCanvas();
        this.canvasToBMP = new CanvasToBMP();
        if (this.fileType === FILE_TYPE.SVG) {
            this.saveAsSVG();
        } else {
            this.saveAsOther();
        }
    }

    private saveAsSVG(): void {
        const uri = 'data:image/svg+xml,' + encodeURIComponent(this.getXMLSVG());
        this.renderer.setAttribute(this.anchor, HTML_ATTRIBUTE.Href, uri);
        this.launchDownload();
    }

    private saveAsOther(): void {
        const originalSvgSize: ClientRect | DOMRect = this.svg.getBoundingClientRect();

        if (FILE_TYPE.BMP === this.fileType) {
            setTimeout(() => {
                this.compressSVG();
            }, 0);
        }

        const url: string = URL.createObjectURL(this.createSVGBlob());
        this.img.onload = () => {
            const uri = this.setUri(url);
            this.launchDownload();
            URL.revokeObjectURL(uri);
        };

        this.renderer.setAttribute(this.img, HTML_ATTRIBUTE.Src, url);
        if (FILE_TYPE.BMP === this.fileType) {
            setTimeout(() => {
                this.decompressSVG(originalSvgSize);
            }, 0);
        }
    }

    private resizeCanvas(): void {
        const svgSize = this.svg.getBoundingClientRect();
        this.canvas.width = svgSize.width;
        this.canvas.height = svgSize.height;
    }

    private compressSVG(): void {
        const svgSize = this.svg.getBoundingClientRect();
        this.renderer.setAttribute(this.svg, HTML_ATTRIBUTE.ViewBox, `0,0,${svgSize.width},${svgSize.height}`);
        this.renderer.setAttribute(this.svg, HTML_ATTRIBUTE.Width, `${MAX_BMP_SIZE}`);
        this.renderer.setAttribute(this.svg, HTML_ATTRIBUTE.Height, `${MAX_BMP_SIZE}`);
        this.resizeCanvas();
    }

    private decompressSVG(svgSize: ClientRect | DOMRect): void {
        this.renderer.removeAttribute(this.svg, HTML_ATTRIBUTE.ViewBox);
        this.renderer.setAttribute(this.svg, HTML_ATTRIBUTE.Width, `${svgSize.width}`);
        this.renderer.setAttribute(this.svg, HTML_ATTRIBUTE.Height, `${svgSize.height}`);
    }

    private setUri(url: string): string {
        (this.canvas.getContext('2d') as CanvasRenderingContext2D).drawImage(this.img, 0, 0);

        URL.revokeObjectURL(url);

        let uri: string;
        if (this.fileType !== FILE_TYPE.BMP) {
            uri = this.canvas.toDataURL('image/' + this.fileType).replace('image/' + this.fileType, 'octet/stream');
        } else {
            uri = this.canvasToBMP.toDataURL(this.canvas);
        }
        this.renderer.setAttribute(this.anchor, HTML_ATTRIBUTE.Href, uri);
        return uri;
    }
}

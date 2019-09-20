import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Message } from '../../../../../common/communication/message';
import { WelcomeModalWindowComponent } from '../../components/welcome-modal-window/welcome-modal-window.component';
import { IndexService } from '../../services/index/index.service';
import { WelcomeModalWindowService } from '../../services/welcome-modal-window/welcome-modal-window.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    readonly title: string = 'LOG2990';
    message = new BehaviorSubject<string>('');

    welcomeModalWindowService: WelcomeModalWindowService;

    constructor(
        private basicService: IndexService,
        welcomeModalWindowService: WelcomeModalWindowService,
        private dialog: MatDialog,
        ) {
        this.welcomeModalWindowService = welcomeModalWindowService;
        this.basicService
            .basicGet()
            .pipe(map((message: Message) => `${message.title} ${message.body}`))
            .subscribe(this.message);
    }

    openWelcomeModalWindow(): void {
        if (this.welcomeModalWindowService.getValueFromLocalStorage()) {
            const dialogRef = this.dialog.open(WelcomeModalWindowComponent, { disableClose: true, maxWidth: '650px' });
            dialogRef.afterClosed().subscribe((displayWelcomeModalWindow) => {
                displayWelcomeModalWindow = displayWelcomeModalWindow.toString();
                this.welcomeModalWindowService.setValueToLocalStorage(displayWelcomeModalWindow);
            });
        }
    }

    ngOnInit(): void {
        this.openWelcomeModalWindow();
    }
}

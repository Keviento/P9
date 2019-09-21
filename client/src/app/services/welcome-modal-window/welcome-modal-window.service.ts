import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class WelcomeModalWindowService {
    readonly storageKey = 'display welcome modal';
    displayWelcomeModalWindow = true;

    getValueFromLocalStorage() {
        if (localStorage.getItem(this.storageKey)) {
            this.displayWelcomeModalWindow = localStorage.getItem(this.storageKey) === 'true';
            this.displayWelcomeModalWindow = !(localStorage.getItem(this.storageKey) === 'false');
        }

        return this.displayWelcomeModalWindow;
    }

    setValueToLocalStorage(value: string) {
        localStorage.setItem(this.storageKey, value);
    }
}

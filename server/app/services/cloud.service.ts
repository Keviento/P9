import * as admin from 'firebase-admin';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class CloudService {
    initialize(): void {
        try {
            // tslint:disable-next-line: no-require-imports
            const serviceAccount = require('../../API_KEYS');
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount.default as admin.ServiceAccount),
                storageBucket: 'p9-cloud.appspot.com',
            });
            console.log('Connected to Cloud Storage!');
        } catch (e) {
            if (e instanceof Error && e.message.includes('Cannot find module')) {
                console.log('Can\'t find serviceAccount!');
            } else {
                throw e;
            }
        }
    }

    delete(srcFilename: string) {
        const bucket = admin.storage().bucket();
        bucket.file(srcFilename).delete();
    }

    save(srcFilename: string, content: string): void {
        if (admin.apps.length) {
            const bucket = admin.storage().bucket();
            bucket.file(srcFilename).save(content);
        }
    }

    download(srcFilename: string): Promise<[Buffer]> {
        if (admin.apps.length) {
            const bucket = admin.storage().bucket();
            return bucket.file(srcFilename).download();
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([Buffer.from('', 'utf8')]);
            }, 10);
        });
    }
}

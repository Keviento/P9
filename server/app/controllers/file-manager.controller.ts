import { NextFunction, Request, Response, Router } from 'express';
import { injectable } from 'inversify';

import { Message } from '../../../common/communication/Message';
const Post = require('../model/post');

@injectable()
export class FileManagerController {
	public router: Router;

	constructor() {
		this.configureRouter();
	}

	private configureRouter(): void {
		this.router = Router();

		this.router.post('/open', async (req: Request, res: Response, next: NextFunction) => {
			let message: Message = req.body;

			let query = { title: message.body };

			Post.findOne(query)
				.then((ans: Message) => {
					res.json(ans);
				})
				.catch((error: Error) => {
					console.log(error);
				});
		});

		this.router.post('/save', (req: Request, res: Response, next: NextFunction) => {
			let message: Message = req.body;

			let query = { title: message.title };
			let update = { body: message.body };
			let options = { upsert: true, new: true };

			Post.findOneAndUpdate(query, update, options)
				.then((ans: Message) => {
					res.json(ans);
				})
				.catch((error: Error) => {
					console.log(error);
				});
		});
	}
}
import * as vscode from 'vscode';
import * as AnkiConnect from './AnkiConnect';

export class AnkiViewViewProvider implements vscode.WebviewViewProvider {

	public static readonly viewType = 'ankiview.view.sideview';

	private _view?: vscode.WebviewView;

	constructor(
		private readonly _ankiConnect: AnkiConnect.AnkiConnect,
		readonly _context: vscode.ExtensionContext,
	) {
		_context.subscriptions.push(vscode.window.registerWebviewViewProvider(AnkiViewViewProvider.viewType, this));
	}

	public async resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	) {
		this._view = webviewView;

		await this.showQuestion();
	}

	private async replaceResource(html: string) {
		let images = Array.from(html.matchAll(/img src="(.*?)"/g)).map((v, _) => v[1]);
		let imageData = images.map(async (v) => this._ankiConnect.api.media.retrieveMediaFile(v));

		for (let index = 0; index < images.length; index++) {
			let img = await imageData[index];
			html = html.replace(images[index], `data:image/png;base64, ` + img.result);
		}

		return `<div class="card ankiview">${html}</div>`;
	}

	public async showAnswer() {
		console.log("CodeView: showAnswer");
		try {
			let html = (await this._ankiConnect.api.graphical.guiCurrentCard()).result.answer;
			this._view!.webview.html = await this.replaceResource(html);
			await this._ankiConnect.api.graphical.guiShowAnswer();
		} catch (err) {
			this.error(err);
		}
	}

	public async showQuestion() {
		console.log("CodeView: showQuestion");
		try {
			let html = (await this._ankiConnect.api.graphical.guiCurrentCard()).result.question;
			this._view!.webview.html = await this.replaceResource(html);
			await this._ankiConnect.api.graphical.guiShowQuestion();
		} catch (err) {
			this.error(err);
		}
	}

	public async error(err: unknown) {
		this._view!.webview.html = `
		<p>Please Open Collection In "Anki" Application then trig "AnkiView: SideView: Show Question" command.</p>
		`;
	}

	public async undo() {
		console.log("CodeView: undo");
		await this._ankiConnect.api.graphical.guiUndo();

		await this.showQuestion();
	}

	public async answerCard(ease: number, autoEase: boolean = false) {
		console.log("CodeView: answerCard: " + ease);
		await this.showAnswer();
		let easeList = (await this._ankiConnect.api.graphical.guiCurrentCard()).result.buttons;

		if (easeList.includes(ease)) {
			await this._ankiConnect.api.graphical.guiAnswerCard(ease);
		} else if (autoEase) {
			await this._ankiConnect.api.graphical.guiAnswerCard(easeList[easeList.length - 1]);
		} else {
			return false;
		}
		this.showQuestion();
		return true;
	}
}

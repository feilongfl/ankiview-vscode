import * as vscode from 'vscode';
import * as AnkiConnect from './AnkiConnect';

export class AnkiBarViewProvider implements vscode.WebviewViewProvider {

	public static readonly viewType = 'ankibar.view.sideview';

	private _view?: vscode.WebviewView;

	constructor(
		private readonly _ankiConnect: AnkiConnect.AnkiConnect,
		readonly _context: vscode.ExtensionContext,
	) {
		_context.subscriptions.push(vscode.window.registerWebviewViewProvider(AnkiBarViewProvider.viewType, this));
	}

	public async resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	) {
		this._view = webviewView;

		await this.showQuestion();
	}

	public async showAnswer() {
		this._view!.webview.html = (await this._ankiConnect.api.graphical.guiCurrentCard()).result.answer;
		await this._ankiConnect.api.graphical.guiShowAnswer();
	}

	public async showQuestion() {
		this._view!.webview.html = (await this._ankiConnect.api.graphical.guiCurrentCard()).result.question;
		await this._ankiConnect.api.graphical.guiShowQuestion();
	}

	public async answerCard(ease: number, autoEase: boolean = false) {
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

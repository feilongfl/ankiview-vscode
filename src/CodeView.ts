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
		this._view!.webview.html = (await this._ankiConnect.Api.Graphical.GuiCurrentCard()).result.answer;
	}

	public async showQuestion() {
		this._view!.webview.html = (await this._ankiConnect.Api.Graphical.GuiCurrentCard()).result.question;
	}
}

import * as vscode from 'vscode';
import * as AnkiConnect from './AnkiConnect';

export class AnkiBarViewProvider implements vscode.WebviewViewProvider {

	public static readonly viewType = 'ankibar.view.sideview';

	private _view?: vscode.WebviewView;

	constructor(
		private readonly _extensionUri: vscode.Uri,
		private readonly _ankiConnect: AnkiConnect.AnkiConnect,
	) { }

	public async resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	) {
		this._view = webviewView;

		webviewView.webview.html = await this._getHtmlForWebview(webviewView.webview);
	}

	private async _getHtmlForWebview(webview: vscode.Webview) {
		let cc = await this._ankiConnect.Api.Graphical.GuiCurrentCard();

		return cc.result.answer;
	}
}

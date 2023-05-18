import * as vscode from 'vscode';
import * as AnkiConnect from './AnkiConnect';

const ankibarPluginId = "ankibar";

let configuration = vscode.workspace.getConfiguration(ankibarPluginId);
const ankiConnect = new AnkiConnect.AnkiConnect(configuration.get<string>("api", "http://localhost:8765"));

export function activate(context: vscode.ExtensionContext) {
	let disposable_ankibarMiscellaneousVersion = vscode.commands.registerCommand('ankibar.Miscellaneous.Version', async () => {
		try {
			const version = await ankiConnect.Api.Miscellaneous.Version();
			vscode.window.showInformationMessage('AnkiBar: AnkiConnect Version: ' + version.result);
		}
		catch (err) {
			vscode.window.showInformationMessage('AnkiBar: AnkiConnect Ping Failed!');
		}
	});
	context.subscriptions.push(disposable_ankibarMiscellaneousVersion);

	let disposable_ankibarMiscellaneousSync = vscode.commands.registerCommand('ankibar.Miscellaneous.Sync', async () => {
		try {
			// todo: add tips here
			await ankiConnect.Api.Miscellaneous.Sync();
		}
		catch (err) {
			vscode.window.showInformationMessage('AnkiBar: AnkiConnect Sync Failed!');
		}
	});
	context.subscriptions.push(disposable_ankibarMiscellaneousSync);

	const provider = new AnkiBarViewProvider(context.extensionUri);
	context.subscriptions.push(vscode.window.registerWebviewViewProvider(AnkiBarViewProvider.viewType, provider));
}

export function deactivate() { }

class AnkiBarViewProvider implements vscode.WebviewViewProvider {

	public static readonly viewType = 'ankibar.view.sideview';

	private _view?: vscode.WebviewView;

	constructor(
		private readonly _extensionUri: vscode.Uri,
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
		let cc = await ankiConnect.Api.Graphical.GuiCurrentCard();

		return cc.result.answer;
	}
}

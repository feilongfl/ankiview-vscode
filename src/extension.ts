import * as vscode from 'vscode';
import * as AnkiConnect from './AnkiConnect';

const ankibarPluginId = "ankibar";

let configuration = vscode.workspace.getConfiguration(ankibarPluginId);
const ankiConnect = new AnkiConnect.AnkiConnect(configuration.get<string>("api", "http://localhost:8765"));

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('ankibar.Version', async () => {
		try {
			const version = await ankiConnect.Api.Miscellaneous.Version();
			vscode.window.showInformationMessage('AnkiBar: AnkiConnect Version: ' + version.result);
		}
		catch (err) {
			vscode.window.showInformationMessage('AnkiBar: AnkiConnect Ping Failed!');
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }

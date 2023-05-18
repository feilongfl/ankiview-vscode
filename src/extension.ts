import * as vscode from 'vscode';
import * as AnkiConnect from './AnkiConnect';
import * as CodeCommand from './CodeCommand';
import * as CodeView from './CodeView';

const ankiviewPluginId = "ankiview";

let configuration = vscode.workspace.getConfiguration(ankiviewPluginId);
const ankiConnect = new AnkiConnect.AnkiConnect(configuration.get<string>("api", "http://localhost:8765"));

export function activate(context: vscode.ExtensionContext) {
	const ankiProvider = new CodeView.AnkiViewViewProvider(ankiConnect, context);
	CodeCommand.registCommand(ankiConnect, ankiProvider, context);
}

export function deactivate() { }

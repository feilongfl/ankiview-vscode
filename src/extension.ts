import * as vscode from 'vscode';
import * as AnkiConnect from './AnkiConnect';
import * as CodeCommand from './CodeCommand';
import * as CodeView from './CodeView';
import * as CodeBar from './CodeBar';

const ankiviewPluginId = "ankiview";

let configuration = vscode.workspace.getConfiguration(ankiviewPluginId);
const ankiConnect = new AnkiConnect.AnkiConnect(configuration.get<string>("api", "http://localhost:8765"));

export function activate(context: vscode.ExtensionContext) {
	const ankiCodeBar = new CodeBar.CodeBar(context);
	const ankiProvider = new CodeView.AnkiViewViewProvider(ankiConnect, ankiCodeBar, context);
	CodeCommand.registCommand(ankiConnect, ankiProvider, ankiCodeBar, context);
}

export function deactivate() { }

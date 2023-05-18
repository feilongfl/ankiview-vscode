import * as vscode from 'vscode';
import * as AnkiConnect from './AnkiConnect';
import * as CodeCommand from './CodeCommand';
import * as CodeView from './CodeView';

const ankibarPluginId = "ankibar";

let configuration = vscode.workspace.getConfiguration(ankibarPluginId);
const ankiConnect = new AnkiConnect.AnkiConnect(configuration.get<string>("api", "http://localhost:8765"));

export function activate(context: vscode.ExtensionContext) {
	const ankiProvider = new CodeView.AnkiBarViewProvider(ankiConnect, context);
	CodeCommand.registCommand(ankiConnect, ankiProvider, context);
}

export function deactivate() { }

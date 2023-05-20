import * as vscode from 'vscode';
import * as AnkiConnect from './AnkiConnect';
import * as CodeBar from './CodeBar';

const ankiviewPluginId = "ankiview";

export class AnkiViewViewProvider implements vscode.WebviewViewProvider {

	public static readonly viewType = 'ankiview.view.sideview';

	private _view?: vscode.WebviewView;
	private _ankiTimeBar: CodeBar.TimeBar;

	constructor(
		private readonly _ankiConnect: AnkiConnect.AnkiConnect,
		protected readonly ankiTimeBar: CodeBar.TimeBar,
		readonly _context: vscode.ExtensionContext,
	) {
		_context.subscriptions.push(vscode.window.registerWebviewViewProvider(AnkiViewViewProvider.viewType, this));
		this._ankiTimeBar = ankiTimeBar;
	}

	private async codeViewHandler(data: any) {
		await vscode.commands.executeCommand(data.command);
	}

	public async resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	) {
		this._view = webviewView;

		this._view.webview.options = {
			// Allow scripts in the webview
			enableScripts: true,

			localResourceRoots: [
				this._context.extensionUri,
			]
		};

		this._view.webview.onDidReceiveMessage(data => this.codeViewHandler(data));

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

	public async getDecks() {
		return (await this._ankiConnect.api.deck.deckNames()).result;
	}

	public async openDeck(name: string) {
		await this._ankiConnect.api.graphical.guiDeckReview(name);
	}

	private mergeViewHtml(cardHtml: string, ctrlHtml: string) {
		let showButton = vscode.workspace.getConfiguration(ankiviewPluginId).get<boolean>("showButton", true);

		return showButton ? `<p></p>${ctrlHtml}<p></p>${cardHtml}` : cardHtml;
	}

	public async showAnswer() {
		console.log("CodeView: showAnswer");
		try {
			let html = (await this._ankiConnect.api.graphical.guiCurrentCard()).result.answer;
			let ankiHtml = await this.replaceResource(html);
			let cardHtml = `
			<anki class="ankiview-answer">
			${ankiHtml}
			</anki>
			`;
			let ctrlHtml = `
			<div class="ankiview-answer-controller">
			<button class="ankiview-answer-button" id="button-answer-ease1">Again</button>
			<button class="ankiview-answer-button" id="button-answer-ease2">Hard</button>
			<button class="ankiview-answer-button" id="button-answer-ease3">Good</button>
			<button class="ankiview-answer-button" id="button-answer-ease4">Easy</button>
			</div>
			`;
			let viewHtml = this.mergeViewHtml(cardHtml, ctrlHtml);
			this._view!.webview.html = this.genAnkiViewHtml(viewHtml);
			await this._ankiConnect.api.graphical.guiShowAnswer();
			await this._ankiTimeBar.clear(30);
		} catch (err) {
			this.error(err);
		}
	}

	public async showQuestion() {
		console.log("CodeView: showQuestion");
		try {
			let html = (await this._ankiConnect.api.graphical.guiCurrentCard()).result.question;
			let ankiHtml = await this.replaceResource(html);
			let cardHtml = `
			<anki class="ankiview-question">
			${ankiHtml}
			</anki>
			`;
			let ctrlHtml = `
			<div class="ankiview-question-controller">
			<button class="ankiview-question-button" id="button-question-show">Show Answer</button>
			</div>
			`;
			let viewHtml = this.mergeViewHtml(cardHtml, ctrlHtml);
			this._view!.webview.html = this.genAnkiViewHtml(viewHtml);
			await this._ankiConnect.api.graphical.guiShowQuestion();
			await this._ankiTimeBar.clear(30);
		} catch (err) {
			this.error(err);
		}
	}

	private getNonce() {
		let text = '';
		const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		for (let i = 0; i < 32; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}

	private genAnkiViewHtml(content: string) {
		const scriptAnkiUri = this._view!.webview.asWebviewUri(vscode.Uri.joinPath(this._context.extensionUri, 'media', 'CodeView.js'));
		const styleCodeUri = this._view!.webview.asWebviewUri(vscode.Uri.joinPath(this._context.extensionUri, 'media', 'vscode.css'));
		const styleAnkiUri = this._view!.webview.asWebviewUri(vscode.Uri.joinPath(this._context.extensionUri, 'media', 'CodeView.css'));
		const nonce = this.getNonce();

		// <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${this._view!.webview.cspSource}; script-src 'nonce-${nonce}';">
		const header = `
		<head>
			<title>Anki Test</title>
			<link href="${styleCodeUri}" rel="stylesheet">
			<link href="${styleAnkiUri}" rel="stylesheet">
		</head>
		`;
		const body = `
		<body>
			<AnkiCard>${content}</AnkiCard>
			<script nonce="${nonce}" src="${scriptAnkiUri}"></script>
		</body>
		`;

		return `<html>${header}${body}</html>`;
	}

	public async error(err: unknown) {
		try {
			let version = await this._ankiConnect.api.miscellaneous.version();

			this._view!.webview.html = this.genAnkiViewHtml(`
			<p></p>
			<button class="ankiview-button" id="button-opendeck">Open Deck</button>
			<p></p>
			<button class="ankiview-button" id="button-sync">Sync</button>
			<h3>Anki Connect Ready, Version: ${version.result}</h3>
			`);
		} catch (error) {
			this._view!.webview.html = this.genAnkiViewHtml(`
			<h3>Anki Connect Failed.</h3>
			<button class="ankiview-button" id="button-retry">Retry</button>
			<p>Please check:</br>
			1. If anki is open.</br>
			2. If anki-connect is installed.</br>
			3. If anki-connect setting is correct.</p>
			`);
		}
		await this._ankiTimeBar.clear(0);
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

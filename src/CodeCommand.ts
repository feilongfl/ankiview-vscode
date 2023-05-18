import * as vscode from 'vscode';
import * as AnkiConnect from './AnkiConnect';
import * as CodeView from './CodeView';

class VscodeCommand {
    constructor(
        protected readonly _ankiConnect: AnkiConnect.AnkiConnect,
        protected readonly ankiProvider: CodeView.AnkiBarViewProvider,
    ) { }

    protected _command = "ankibar.unknow";

    protected async callback() {
    }

    protected error(err: unknown) {
        vscode.window.showErrorMessage("ankibar: unknow error");
    }

    private _getDisposable() {
        return vscode.commands.registerCommand(this._command, async () => {
            try {
                await this.callback();
            }
            catch (err) {
                this.error(err);
            }
        });
    }

    public regist(context: vscode.ExtensionContext) {
        context.subscriptions.push(this._getDisposable());
    }
}

class MiscellaneousVersion extends VscodeCommand {
    protected _command = "ankibar.Miscellaneous.Version";

    protected error(err: unknown) {
        vscode.window.showInformationMessage('AnkiBar: AnkiConnect Ping Failed!');
    }

    protected async callback() {
        const version = await this._ankiConnect.api.miscellaneous.version();
        vscode.window.showInformationMessage('AnkiBar: AnkiConnect Version: ' + version.result);
    }
}

class MiscellaneousSync extends VscodeCommand {
    protected _command = "ankibar.Miscellaneous.Sync";

    protected error(err: unknown) {
        vscode.window.showInformationMessage('AnkiBar: AnkiConnect Sync Failed!');
    }

    protected async callback() {
        // todo: add tips here
        await this._ankiConnect.api.miscellaneous.sync();
    }
}

class SideviewShowQuestion extends VscodeCommand {
    protected _command = "ankibar.command.sideview.showQuestion";

    protected error(err: unknown) {
        // vscode.window.showInformationMessage('AnkiBar: AnkiConnect Sync Failed!');
    }

    protected async callback() {
        await this.ankiProvider.showQuestion();
    }
}

class SideviewShowAnswer extends VscodeCommand {
    protected _command = "ankibar.command.sideview.showAnswer";

    protected error(err: unknown) {
        // vscode.window.showInformationMessage('AnkiBar: AnkiConnect Sync Failed!');
    }

    protected async callback() {
        await this.ankiProvider.showAnswer();
    }
}

class SideviewAnswerCard extends VscodeCommand {
    protected _command = "ankibar.command.sideview.answerCard";

    protected error(err: unknown) {
    }

    protected async callback() {
        vscode.window.showInputBox({ "title": "Answer" }).then(
            (ease => { this.ankiProvider.answerCard(Number(ease)); })
        );
    }
}

let commandList = [
    // Miscellaneous
    MiscellaneousVersion,
    MiscellaneousSync,

    // sideview
    SideviewShowQuestion,
    SideviewShowAnswer,
    SideviewAnswerCard,
];

export function registCommand(ankiConnect: AnkiConnect.AnkiConnect, ankiProvider: CodeView.AnkiBarViewProvider, context: vscode.ExtensionContext) {
    commandList.forEach((vc) => { (new vc(ankiConnect, ankiProvider)).regist(context); });
}

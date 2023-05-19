import * as vscode from 'vscode';
import * as AnkiConnect from './AnkiConnect';
import * as CodeView from './CodeView';
import * as CodeBar from './CodeBar';

class VscodeCommand {
    constructor(
        protected readonly _ankiConnect: AnkiConnect.AnkiConnect,
        protected readonly ankiProvider: CodeView.AnkiViewViewProvider,
        protected readonly ankiCodeBar: CodeBar.CodeBar,
    ) { }

    protected _command = "ankiview.unknow";

    protected async callback() {
    }

    protected error(err: unknown) {
        vscode.window.showErrorMessage("ankiview: unknow error");
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
    protected _command = "ankiview.Miscellaneous.Version";

    protected error(err: unknown) {
        vscode.window.showInformationMessage('AnkiView: AnkiConnect Ping Failed!');
    }

    protected async callback() {
        const version = await this._ankiConnect.api.miscellaneous.version();
        vscode.window.showInformationMessage('AnkiView: AnkiConnect Version: ' + version.result);
    }
}

class MiscellaneousSync extends VscodeCommand {
    protected _command = "ankiview.Miscellaneous.Sync";

    protected error(err: unknown) {
        vscode.window.showInformationMessage('AnkiView: AnkiConnect Sync Failed!');
    }

    protected async callback() {
        // todo: add tips here
        await this._ankiConnect.api.miscellaneous.sync();
    }
}

class SideviewShowQuestion extends VscodeCommand {
    protected _command = "ankiview.command.sideview.showQuestion";

    protected error(err: unknown) {
        // vscode.window.showInformationMessage('AnkiView: AnkiConnect Sync Failed!');
    }

    protected async callback() {
        await this.ankiProvider.showQuestion();
        await this.ankiCodeBar.clear(30);
    }
}

class SideviewShowAnswer extends VscodeCommand {
    protected _command = "ankiview.command.sideview.showAnswer";

    protected error(err: unknown) {
        // vscode.window.showInformationMessage('AnkiView: AnkiConnect Sync Failed!');
    }

    protected async callback() {
        await this.ankiProvider.showAnswer();
    }
}

class SideviewAnswerCard extends VscodeCommand {
    protected _command = "ankiview.command.sideview.answerCard";

    protected error(err: unknown) {
    }

    protected async callback() {
        let ease = await vscode.window.showInputBox({ "title": "Answer" });
        if (! await this.ankiProvider.answerCard(Number(ease))) {
            vscode.window.showErrorMessage("Answer Value Not Correct.");
        }
        await this.ankiCodeBar.clear(30);
    }
}

class SideviewAnswerCardEaseX extends VscodeCommand {
    protected _command = "ankiview.command.sideview.answerCardEaseX";
    protected ease = -1;

    protected error(err: unknown) {
    }

    protected async callback() {
        if (! await this.ankiProvider.answerCard(Number(this.ease), true)) {
            vscode.window.showErrorMessage("AnswerCard Process Error.");
        }
        await this.ankiCodeBar.clear(30);
    }
}

class SideviewAnswerCardEase1 extends SideviewAnswerCardEaseX {
    protected _command = "ankiview.command.sideview.answerCardEase1";
    protected ease = 1;
}

class SideviewAnswerCardEase2 extends SideviewAnswerCardEaseX {
    protected _command = "ankiview.command.sideview.answerCardEase2";
    protected ease = 2;
}

class SideviewAnswerCardEase3 extends SideviewAnswerCardEaseX {
    protected _command = "ankiview.command.sideview.answerCardEase3";
    protected ease = 3;
}

class SideviewAnswerCardEase4 extends SideviewAnswerCardEaseX {
    protected _command = "ankiview.command.sideview.answerCardEase4";
    protected ease = 4;
}

class SideviewUndo extends VscodeCommand {
    protected _command = "ankiview.command.sideview.undo";

    protected error(err: unknown) {
    }

    protected async callback() {
        await this.ankiProvider.undo();
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
    SideviewAnswerCardEase1,
    SideviewAnswerCardEase2,
    SideviewAnswerCardEase3,
    SideviewAnswerCardEase4,
    SideviewUndo,
];

export function registCommand(ankiConnect: AnkiConnect.AnkiConnect,
    ankiProvider: CodeView.AnkiViewViewProvider,
    ankiCodeBar: CodeBar.CodeBar,
    context: vscode.ExtensionContext) {
    commandList.forEach((vc) => { (new vc(ankiConnect, ankiProvider, ankiCodeBar)).regist(context); });
}

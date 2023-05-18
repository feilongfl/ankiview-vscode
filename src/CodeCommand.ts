import * as vscode from 'vscode';
import * as AnkiConnect from './AnkiConnect';

class VscodeCommand {
    constructor(
		protected readonly _ankiConnect: AnkiConnect.AnkiConnect,
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
        const version = await this._ankiConnect.Api.Miscellaneous.Version();
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
        await this._ankiConnect.Api.Miscellaneous.Sync();
    }
}

let commandList = [
    // Miscellaneous
    MiscellaneousVersion,
    MiscellaneousSync,
];

export function registCommand(ankiConnect: AnkiConnect.AnkiConnect, context: vscode.ExtensionContext) {
    commandList.forEach((vc)=>{(new vc(ankiConnect)).regist(context);});
}

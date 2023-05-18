import * as vscode from 'vscode';
import * as AnkiConnect from './AnkiConnect';

class VscodeCommand {
    constructor(
		protected readonly _ankiConnect: AnkiConnect.AnkiConnect,
	) { }

    protected _command = "ankibar.unknow";

    public async callback() {
    }

    public error(err: unknown) {
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

export class MiscellaneousVersion extends VscodeCommand {
    protected _command = "ankibar.Miscellaneous.Version";

    public error(err: unknown) {
        vscode.window.showInformationMessage('AnkiBar: AnkiConnect Ping Failed!');
    }

    public async callback() {
        const version = await this._ankiConnect.Api.Miscellaneous.Version();
        vscode.window.showInformationMessage('AnkiBar: AnkiConnect Version: ' + version.result);
    }
}

export class MiscellaneousSync extends VscodeCommand {
    protected _command = "ankibar.Miscellaneous.Sync";

    public error(err: unknown) {
        vscode.window.showInformationMessage('AnkiBar: AnkiConnect Sync Failed!');
    }

    public async callback() {
        // todo: add tips here
        await this._ankiConnect.Api.Miscellaneous.Sync();
    }
}

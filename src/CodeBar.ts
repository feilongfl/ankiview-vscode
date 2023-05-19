import * as vscode from 'vscode';

class PeriodFunc {
    private _callback: any;
    private _period: number;
    private _max?: number;
    private _val: number = 0;

    private _periodHandler?: NodeJS.Timer;

    constructor(callback: any, period: number) {
        this._callback = callback;
        this._period = period;
    }

    private callback() {
        if (this._val < this._max!) {
            this._val++;
        }

        this._callback(this._val, this._max);
    }

    public start(max: number, peride?: number) {
        this._max = max;
        this._val = 0;
        if (peride !== undefined) {
            this._period = peride!;
        }
        if (this._periodHandler !== undefined) {
            this.stop();
        }

        this._periodHandler = setInterval(() => this.callback(), this._period);
    }

    public stop() {
        if (this._periodHandler !== undefined) {
            clearInterval(this._periodHandler);
        }
        this._periodHandler = undefined;
    }
}

export class TimeBar {
    constructor(context: vscode.ExtensionContext) {
        this._bar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
        this._bar.text = `$(clock) 0`;

        context.subscriptions.push(this._bar);
        this._bar.show();

        this._timer = new PeriodFunc((time: number, max: number) => this.updateBar(time, max), 1000);
    }

    private _bar: vscode.StatusBarItem;
    private _timer: PeriodFunc;
    private updateBar(time: number, max: number) {
        this._bar.text = `$(clock) ${time}`;
        if (time === max) {
            this._bar.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
        } else if (time > max / 3 * 2) {
            this._bar.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
        } else {
            this._bar.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');
        }
    }

    public clear(max: number) {
        this._timer.start(max);
        this._bar.text = `$(clock) 0`;
        this._bar.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');
    }
}

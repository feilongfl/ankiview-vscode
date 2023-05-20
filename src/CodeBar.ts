import * as vscode from 'vscode';

const ankiviewPluginId = "ankiview";

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

class TimeBar {
    constructor(context: vscode.ExtensionContext) {
        this._bar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
        this._bar.text = `$(clock) 0`;

        context.subscriptions.push(this._bar);

        let warnThreshold = vscode.workspace.getConfiguration(ankiviewPluginId).get<number>("TimeBar.warnThreshold", 0.66);
        this._timer = new PeriodFunc((time: number, max: number) => this.updateBar(time, warnThreshold * max, max), 1000);
    }

    private _bar: vscode.StatusBarItem;
    private _timer: PeriodFunc;
    private updateBar(time: number, warn: number, max: number) {
        this._bar.text = `$(clock) ${time}`;
        if (time === max) {
            this._bar.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
        } else if (time > warn) {
            this._bar.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
        } else {
            this._bar.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');
        }
    }

    public clear(max: number = 0) {
        if (max === 0) {
            this._bar.hide();
        } else {
            this._timer.start(max);
            this._bar.text = `$(clock) 0`;
            this._bar.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');
            this._bar.show();
        }
    }
}

class ReviewBar {
    constructor(context: vscode.ExtensionContext) {
        this._bar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
        this.update(0, 0, 0, false);

        context.subscriptions.push(this._bar);
    }
    private _bar: vscode.StatusBarItem;

    /**
     * update
     */
    public update(newCard: number, retryCard: number, reviewCard: number, show: boolean = true) {
        this._bar.text = `$(testing-queued-icon) ${newCard} $(testing-failed-icon) ${retryCard} $(testing-passed-icon) ${reviewCard}`;
        if (show) { this._bar.show(); } else { this._bar.hide(); }
    }
}

export class CodeBar {
    constructor(context: vscode.ExtensionContext) {
        this.timeBar = new TimeBar(context);
        this.reviewBar = new ReviewBar(context);
    }
    private timeBar: TimeBar;
    private reviewBar: ReviewBar;

    public clearTimer(max: number = 0) { this.timeBar.clear(max); };
    public updateReviewStatus(newCard: number, retryCard: number, reviewCard: number, show: boolean = true) { this.reviewBar.update(newCard, retryCard, reviewCard, show); };
}

(function () {
    const vscode = acquireVsCodeApi();

    const buttonMessageMatrix = {
        'click': {
            '#button-opendeck': {
                type: 'openDeck'
            },
            '#button-retry': {
                type: 'retry'
            },
        },
    };

    for (let event in buttonMessageMatrix) {
        for (let cls in buttonMessageMatrix[event]) {
            if (document.querySelector(cls) === null) { continue; }
            console.log("event add", cls, buttonMessageMatrix[event][cls]);
            document.querySelector(cls).addEventListener(event, () => {
                vscode.postMessage(buttonMessageMatrix[event][cls]);
            });
        }
    }
}());

function RegistButtonListener(vscode) {
    const buttonMessageMatrix = {
        'click': {
            '#button-opendeck': {
                type: 'command',
                command: 'ankiview.command.sideview.openDeck'
            },
            '#button-retry': {
                type: 'command',
                command: 'ankiview.command.sideview.showQuestion'
            },
            '#button-sync': {
                type: 'command',
                command: 'ankiview.Miscellaneous.Sync'
            },
            '#button-question-show': {
                type: 'command',
                command: 'ankiview.command.sideview.showAnswer'
            },
            '#button-answer-ease1': {
                type: 'command',
                command: 'ankiview.command.sideview.answerCardEase1'
            },
            '#button-answer-ease2': {
                type: 'command',
                command: 'ankiview.command.sideview.answerCardEase2'
            },
            '#button-answer-ease3': {
                type: 'command',
                command: 'ankiview.command.sideview.answerCardEase3'
            },
            '#button-answer-ease4': {
                type: 'command',
                command: 'ankiview.command.sideview.answerCardEase4'
            },
        },
    };

    for (let event in buttonMessageMatrix) {
        for (let cls in buttonMessageMatrix[event]) {
            let elm = document.querySelector(cls);
            if (elm === null) { continue; }
            elm.addEventListener(event, () => {
                vscode.postMessage(buttonMessageMatrix[event][cls]);
            });
        }
    }
}

function RegistKeyListener(vscode) {
    // maybe useful later
    // document.addEventListener('keydown', (e) => {
    //     vscode.postMessage({
    //         type: 'key',
    //         code: e.code,
    //         event: 'keydown',
    //     });
    // });
    // document.addEventListener('keypress', (e) => {
    //     vscode.postMessage({
    //         type: 'key',
    //         code: e.code,
    //         event: 'keypress',
    //     });
    // });
    document.addEventListener('keyup', (e) => {
        // console.log(e);
        vscode.postMessage({
            type: 'key',
            // code: e.code,
            key: e.key,
            // altKey: e.altKey,
            // ctrlKey: e.ctrlKey,
            // shiftKey: e.shiftKey,
            event: e.type,
        });
    });
}

(function () {
    const vscode = acquireVsCodeApi();

    RegistButtonListener(vscode);
    RegistKeyListener(vscode);
}());

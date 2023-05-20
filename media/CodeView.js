function RegistButtonListener(vscode) {
    const buttonMessageMatrix = {
        'click': {
            '#button-opendeck': {
                command: 'ankiview.command.sideview.openDeck'
            },
            '#button-retry': {
                command: 'ankiview.command.sideview.showQuestion'
            },
            '#button-sync': {
                command: 'ankiview.Miscellaneous.Sync'
            },
            '#button-question-show': {
                command: 'ankiview.command.sideview.showAnswer'
            },
            '#button-answer-ease1': {
                command: 'ankiview.command.sideview.answerCardEase1'
            },
            '#button-answer-ease2': {
                command: 'ankiview.command.sideview.answerCardEase2'
            },
            '#button-answer-ease3': {
                command: 'ankiview.command.sideview.answerCardEase3'
            },
            '#button-answer-ease4': {
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

(function () {
    const vscode = acquireVsCodeApi();

    RegistButtonListener(vscode);
}());

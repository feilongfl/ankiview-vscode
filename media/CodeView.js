(function () {
    const vscode = acquireVsCodeApi();

    document.querySelector('#button-opendeck').addEventListener('click', () => {
        vscode.postMessage({ type: 'openDeck' });
    });
}());

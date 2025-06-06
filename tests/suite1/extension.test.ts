import * as assert from 'assert';
import * as vscode from 'vscode';
import { getDocUri, waitForServerStartup } from './../helper';

suite('Extension tests', function () {
    this.timeout(0);

    test('Should start extension and Language Server', async () => {
        const smithyMainUri = getDocUri('suite1/main.smithy');
        const doc = await vscode.workspace.openTextDocument(smithyMainUri);
        const editor = await vscode.window.showTextDocument(doc);
        const ext = vscode.extensions.getExtension('smithy.smithy-vscode-extension');
        await waitForServerStartup();
        const diagnostics = vscode.languages.getDiagnostics(smithyMainUri);

        // Grab model file directly
        const modelFile = await vscode.workspace.openTextDocument(getDocUri('suite1/main.smithy'));
        const modelFileText = modelFile.getText();

        assert.match(modelFileText, /namespace example.weather/);

        assert.notEqual(doc, undefined);
        assert.notEqual(editor, undefined);
        assert.equal(ext.isActive, true);
        assert.deepStrictEqual(diagnostics, []);
    });

    test('Should register language', async () => {
        const languages = await vscode.languages.getLanguages();
        assert.equal(languages.includes('smithy'), true);
    });
});

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below


const { exec } = require('child_process');
const vscode = require('vscode');
console.log(vscode.Color)
var path = require("path");


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "awk" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let awkAWK = vscode.commands.registerCommand('awk.awk', makeHandler(arg => arg));
    let awkSimplePrint = vscode.commands.registerCommand('awk.simple_print', makeHandler(arg => `{print ${arg}}`))

    context.subscriptions.push(awkAWK);
    context.subscriptions.push(awkSimplePrint);
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}

module.exports = {
    activate,
    deactivate
}

function makeHandler(argAdapter) {
    return async function () {
        let argInput = vscode.window.createInputBox();
        let arg = await vscode.window.showInputBox({
            prompt: "Please input awk prog."
        });

        const editor = vscode.window.activeTextEditor;
        let range = new vscode.Range(editor.selection.start, editor.selection.end);
        if (editor.selection.isEmpty) {
            var firstLine = editor.document.lineAt(0);
            var lastLine = editor.document.lineAt(editor.document.lineCount - 1);
            range = new vscode.Range(firstLine.range.start, lastLine.range.end);
        }

        let output = await awk(editor.document.getText(range), argAdapter(arg));
        let out = await editor.edit(editBuilder => {
            editBuilder.replace(range, output)
        });

        //vscode.window.showInformationMessage(cmd);
    }
}

async function runCommand(cmd) {
    console.log(`command is: ${cmd}`)
    return new Promise(function (resolve, reject) {
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            } else {
                resolve(stdout);
            }
        })
    })
}

async function awk(input, arg) {
    let cmd = `echo '${input}' | awk '${arg}'`
    let output = await runCommand(cmd)
    if (output.length > 0 && output[output.length - 1] == "\n") {
        output = output.substr(0, output.length - 1)
    }

    return output
}
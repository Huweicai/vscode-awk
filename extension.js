// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { exec } = require('child_process');
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
	let disposable = vscode.commands.registerCommand('awk.awk', async function () {
		// The code you place here will be executed every time your command is executed
		let input = vscode.window.createInputBox();
		let arg = await vscode.window.showInputBox({
			prompt: "Please input awk prog."
		});

		var filePath = vscode.window.activeTextEditor.document.fileName;

		let cmd = 'awk \'' + arg + '\' ' + filePath
		exec(cmd, async (err, stdout, stderr) => {
			vscode.window.showInformationMessage(`stdout: ${stdout}`)

			if (err) {
				vscode.window.showInformationMessage(`result: ${stdout} ${stderr} ${err}`)
				return
			}

			const editor = vscode.window.activeTextEditor;

			var firstLine = editor.document.lineAt(0);
			var lastLine = editor.document.lineAt(editor.document.lineCount - 1);
			let out = await editor.edit(editBuilder => {
				editBuilder.delete(new vscode.Range(firstLine.range.start, lastLine.range.end));
			});

			out = await editor.edit(editBuilder => {
				editBuilder.insert(new vscode.Position(0, 0), stdout);
			})

			return;
		})

		// Display a message box to the user
		vscode.window.showInformationMessage(cmd);
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}

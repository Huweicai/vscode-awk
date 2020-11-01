const {exec} = require('child_process');

async function awk(input, arg) {

    let cmd = `echo '${input}' | awk '${arg}'`
    let output = await runCommand(cmd)
    console.log(`output is ${output}`)
}

async function runCommand(cmd) {
    console.log(`command is ${cmd}`)
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

awk(`1
3
2
4`, '{print $1}')

/*
               var firstLine = editor.document.lineAt(0);
                var lastLine = editor.document.lineAt(editor.document.lineCount - 1);
                let out = await editor.edit(editBuilder => {
                    editBuilder.delete(new vscode.Range(firstLine.range.start, lastLine.range.end));
                });

            out = await editor.edit(editBuilder => {
                editBuilder.insert(new vscode.Position(0, 0), stdout);
            })
*/
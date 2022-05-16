import * as fs from 'fs';

export class ReadFile {
    input
    constructor(public path) {
    }
    exists()
    {
        return fs.existsSync(this.path);
    }
    readLines(onReadLine) {
        this.input = fs.createReadStream(this.path);
        let promise = new Promise((resolve) => {
            var remaining = '';
            this.input.on('data', (data) => {
                remaining += data;
                var index = remaining.indexOf('\n');
                while (index > -1) {
                    var line = remaining.substring(0, index);
                    remaining = remaining.substring(index + 1);
                    onReadLine(line);
                    index = remaining.indexOf('\n');
                }
            });
        
            this.input.on('end', function() {
                resolve(true);
                if (remaining.length > 0) onReadLine(remaining);
            });
        })
        return promise;
    }
    readFileJSON()
    {
        let promise = new Promise((resolve, reject) => {
            fs.readFile(this.path, 'utf8', function readFileCallback(err, data){
                if(err) reject();
                else resolve(JSON.parse(data));
            });
        });
        return promise;
    }
    writeFileJSON(obj)
    {
        let promise = new Promise((resolve, reject) => {
            fs.writeFile(this.path, JSON.stringify(obj), 'utf8', (err) => {
                if(err) reject();
                else resolve(true);
            });
        });
        return promise;
    }
    
}
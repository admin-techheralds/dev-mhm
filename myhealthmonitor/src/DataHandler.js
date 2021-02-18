import { 
    isDirExists, 
    isFileExists,
    mkDir, 
    rmDir, 
    listFilesFromDir, 
    writeFile, 
    readFile, 
    deleteFile } from './FileUtils'


export class DataHandler {

    constructor(name, folderPath, filename) {
        this.name = name;
        this.folderPath = folderPath;
        this.filename = filename;
        this.file = this.folderPath + this.filename;
        this.error = "";
        this.init_data = {
            "name" : name,
            "created_at" : new Date().getTime(),
            "modified_at" : new Date().getTime(),
            "data" : []
        };
        // this.json = {}
    }
    
    setError(err) {
        console.log(err)
        this.error = err;
    }

    async init() {
        this.setError("")
        var jsonData = this.json
        if(! await isFileExists(this.folderPath, this.filename)) {
            console.log("Component:" + this.name + " data file doesnt exists. Creating now..")
            const r = await writeFile(this.folderPath, this.filename, JSON.stringify(this.init_data));
            if(! r) {
                this.setError("Failed to create the data file for the component:" + this.name)
                return;
            }
        } else {
            console.log("Component data file already exists");
        }

        this.load();
        
        // this.json = jsonData
        // console.log('after init...data is:' + JSON.stringify(jsonData));
    }

    async load() {
        try {
            this.json = JSON.parse((await readFile(this.folderPath, this.filename)).data);
            console.log('Load data is:', this.json);
        } catch(err) {
            this.setError("Error while reading the component data. Error:" + err);
        }
    }

    async add(datapart) {
        this.setError('')
        //Updating the ID
        if(! 'id' in datapart) {
            console.log('adding id as it is missing.')
            datapart['id'] = this.json.data.length + 1
        }
        this.json.data.push(datapart);       
        this.save();
    }

    async save() {
        this.setError('')
        this.json.modified_at = new Date().getTime();
        const r = await writeFile(this.folderPath, this.filename, JSON.stringify(this.json));
        if(r == undefined) {
            this.setError("Failed to save the data file for the component:" + this.name)
            return;
        }
    }

    isFieldValueExists = function(field, value) {
        var result = false;
        for(var i = 0; i < this.json.data.length; i++) {
            var item = this.json.data[i];
            if(item[field] == value) {
                result = true;
                break;
            }
        }
        return result;
    }
    
    getItemCount = function(field, value, ignoreList) {
        var count = 0;
        for(var i = 0; i < this.json.data.length; i++) {
            var item = this.json.data[i];
            if(ignoreList != undefined && ignoreList.indexOf(item[field]) == -1) {
                if(item[field] == value) {
                    count = count + 1;
                }
            }
        }
        return count;
    }

    updateItemByValue = function(field, valueToMatch, itemToReplace) {
        var result = false;
        for(var i = 0; i < this.json.data.length; i++) {
            var item = this.json.data[i];
            if(item[field] == valueToMatch) {
                this.json.data[i] = itemToReplace;
                result = true;
                break;
            }
        }
        this.save();
        return result;
    }
    
    deleteItemByValue = function(field, valueToMatch) {
        this.json.data = this.json.data.filter(item => item[field] !== valueToMatch)
        this.save();
        return true
    }

    getDataItemByName = function(field, value) {
        var result = undefined;
        for(var i = 0; i < this.json.data.length; i++) {
            var item = this.json.data[i];
            if(item[field] == value) {
                result = item;
                break;
            }
        }
        return result;
    }

    count() {
        return this.json.data.length
    }

    getData() {
        return this.json.data
    }
}
const fs = require('fs');
const request = require('request');

// Path Variables
const url = 'https://raw.githubusercontent.com/Arcensoth/mcdata/master/generated/reports/registries.json'
const folder = './' + 'generated'
const filePrefix = 'every_'
const fileSufix = '.json'

// request registries file
request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        const index = JSON.parse(body);
        registries = Object.keys(index)

        for (let i = 0; i < registries.length; i++) {

            const list = {values:[]}
            const current = registries[i].toString()
            const key = current.split(':')[1]
            const fileName = filePrefix + key + fileSufix
            const dir = `${folder}/${key}`
            const path = `${dir}/${fileName}`

            // build list
            for(registry in index[current]["entries"]){
                // I don't want air in tags '-'
                if(registry != "minecraft:air")
                    list.values.push(registry)
            }
            
            // Generate folders
            if (!fs.existsSync(folder)) fs.mkdirSync(folder);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir);
            // Write Json File
            fs.writeFileSync(path, JSON.stringify(list, null, '\t'))
            // Confirm Output
            console.log(`Generated "${key}" file with ${list.values.length} values.`)
        }
    }
})
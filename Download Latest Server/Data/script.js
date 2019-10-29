const download = require('download-file')
const request = require('request')
const fs = require('fs')
const manifest_URL = 'https://launchermeta.mojang.com/mc/game/version_manifest.json'

function find(array){
    const value = this.toString()
    return array.id === value
}


let urls = []


request(manifest_URL, function (error, response, body) {
   if(!error){
        const list = JSON.parse(body)
        let latest = list["latest"]
        latest.version = list["versions"][0]["id"].toString()
        
        for (const version in latest) {
            if(version === "version" || (version === "snapshot" && latest.version !== latest[version])) return
            console.log(`Latest ${version} found is ${latest[version]}\n`)

            let options = {
                directory: `./server/${latest[version]}/`,
                filename: `${latest[version]}.json`
            }

            let url = list["versions"].find(find,latest[version]).url

            console.log (`${latest[version]}: Locating JAR File..\n`)

            download(url,options, function(err){
                if(err){
                    console.log(`Error ${err}\n`)
                }
                else{
                     // Get Server URl From JSON File
                    json = require(`${options.directory}${options.filename}`)
                    url = json.downloads.server.url
                    console.log(`${latest[version]}: JAR File Located!\n`)
                    //Once Found, Delete JSON File
                    fs.unlinkSync(`${options.directory}${options.filename}`)
                    

                    console.log(`${latest[version]}: Starting download..\n`)
                    options.filename = `server.jar`

                    download(url,options,function(err){
                        if(err)
                            console.log(`Error ${err}\n`)
                        else
                            console.log (`${latest[version]}: Download Completed!\n`)
                    })
                }
            })
        }
    }
});


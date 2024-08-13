import {writeToFile, search, checkIfFileisPopulated} from "./utils"

export class InMemory {

    // takes in a id, longURL, shortURL: returns a HasMap, HashSet

    // setup cache later or bloom filter

    static async urlInMemoryCheck(longUrl: string){

        var res = ""

        const response = await this.searchBy(longUrl)

        res += response

        return  true ? res.includes(longUrl) : false
    }

    static saveToMemory(contents: any[]){

        /*
        - check if the file is populated, if not write to file
        - other than that , appendtoFile
        */
        
        if (checkIfFileisPopulated()) {
            writeToFile(contents, "append")
            return
        } 

        writeToFile(contents)

    }

    /*
        - look for the url in the file 
        - if it returns , 
    */

    static async searchBy(url: string){
        let res: string = "";

        // const res2 = await search("oac")
        const res2 = await search(url)

        res += res2[0]

        return res

    }
   

}
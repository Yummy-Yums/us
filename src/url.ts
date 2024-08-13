import {validateURL, checkWhetherURLExists, generateId, encode} from "../src/utils"
import { InMemory } from "./inmemory"
import {BloomFilter} from "./bloom_filter"

interface URLInterface {
    longURL: URL,
    shortURL: URL
}

export class UrlHandler implements URLInterface {

    longURL: URL;
    shortURL: URL;

    constructor(longURL: URL, shortURL?: string, ...args: any[]){

        //check whether it is in DB
        this.longURL = longURL
        this.shortURL = new URL(shortURL as string)

    }

    static parseURL(url: string): URL | string {

       const valid = validateURL(url)

       if (valid == false){

        return "Invalid URL, please check and try again"

       }

       return new URL(url)

    }

    static convertAndSave(longUrl: URL){

        const prefix   = "https://yumshortener/"

        const url      = longUrl.toString()

        const id       = generateId()

        const shortURL = encode(id)

        const contents = [id, shortURL, url]

        InMemory.saveToMemory(contents)

        return `${prefix}${shortURL}`

        /*
          - take in the longURL, generate an Id
          - take the id ,convert it to base 62  
          - append it to part of the prefix URL 
          - can inMemoryManager to save id, shortURL, longURL into file
        */

    }

    validateURLWell(url: string){

        const parsedURL = UrlHandler.parseURL(url) as URL

        const urlCheck = checkWhetherURLExists(parsedURL)

        urlCheck
            .then((value) => {
                if(typeof value == "boolean" ){
                    return true ? value == true : false
                } else if ( value instanceof Response){
                    return value.status
                }
            })
            
        // check in DB 
        return urlCheck
    
    }

}
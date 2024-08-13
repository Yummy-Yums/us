import {randomBytes} from 'crypto'
import { appendFile } from "node:fs/promises";
import { BloomFilter } from './bloom_filter';

type filterDataReturnType = { } | any

export function singletonBloomFilter() {
    return new BloomFilter()
}

export function filterData(data: {}, dataKey: string): filterDataReturnType {
    
    const keys = Object.entries(data)

    for(const [key, value] of keys){

        if(key == dataKey){
            var res = value
            
            return res        
        }

    }

    return {}
    
}

export function validateURL(url: string): boolean {

    const urlRegex = /^(https?:\/\/)?(www\.)?([a-z0-9]+([\-.][a-z0-9]+)*\.[a-z]{2,5})(:[0-9]{1,5})?(\/.*)?$/g;

    const output = url.match(urlRegex)

    return true ? output !== null : false
    
}
  
const response_arr: boolean[] = []
export async function checkWhetherURLExists(url: URL) {

    try{
        const response = await fetch(url.origin, {method: "HEAD"});

        response_arr.push(response.status == 200)
        // response_arr.push(true)
    } catch(error){
        response_arr.push(false)
        return new Response("something went wrong") 
    }
}

const runUrlExistsCheck = async () => {
   await checkWhetherURLExists(new URL("hts://google.com"))
   console.log(response_arr)
   return true

}

await runUrlExistsCheck()

// type generated_id = [string, number]

export function generateId(): number {

    const uuid = generateNumericUUID()

    // const url_uuid: generated_id = [url, uuid] 
    
    return uuid

}

function generateNumericUUID(): number {
    // Calculate the number of bytes required to generate a number with the specified length
    // const byteLength = Math.ceil(length * Math.log2(10) / 8);

    // Generate random bytes: 5
    const buffer = randomBytes(5);

    // Convert the buffer to a big integer
    const hexString   = buffer.toString('hex');
    const bigIntValue = BigInt(`0x${hexString}`);

  
    const numericUUID = bigIntValue.toString();

    const res = numericUUID.slice(0, 5).padStart(5, '0')

    // Ensure the string is of the correct length (padded if necessary)
    return parseInt(res);
}


const file_heading = 
`           ID |      SHORTURL | LONGURL
=========================================================================
`

export async function writeToFile(contents: any[], option?: string){

    try{

        // const path     = "./src/test.txt"
        const path = "/tmpfs-mount/test.txt";

        const file     = await Bun.file(path)

        const ID       = contents[0] as string
    
        const shortURL = contents[1]
    
        const longURL  = contents[2]

        const fullString = " ".repeat(8) + ID  + ' |' + " ".repeat(11) + shortURL  + ' | ' + longURL
        
        if(option === undefined){

            const data = file_heading + "\n" + fullString + "\n"
            
            await Bun.write(file, data)
            
        } else {
            await appendFile(path,  fullString + "\n")             
        }

        return true
        
    } catch(error) {
        return false
    }

    // return success of failure of operations

    /*
      - check whether directory exists, if not create it, create file 
      - other than that, just append contents to in a formatted manner
      - use text rather than streaming
    */

}

"use strict";

var CHARSET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function encode(int: number): string {
    if (int === 0) {
        return CHARSET[0];
    }

    var res = "";
    while (int > 0) {
        res = CHARSET[int % 62] + res;
        int = Math.floor(int / 62);
    }
    return res;
};

// not needed as shortURL is saved along with the longURL and Id
export function decode(str: string): number {
    var res = 0,
        length = str.length,
        i, char;
    for (i = 0; i < length; i++) {
        char = str.charCodeAt(i);
        if (char < 58) { // 0-9
            char = char - 48;
        } else if (char < 91) { // A-Z
            char = char - 29;
        } else { // a-z
            char = char - 87;
        }
        res += char * Math.pow(62, length - i - 1);
    }
    return res;
};

export function extractUrlData(incomingData: Record<string, any>[]): string[]{
   
    const res =  incomingData.flatMap((m) => {
    
        return m['jsonData']['url'] as string
    
      })

    return res
}

export async function search(url: string) {
    // const path = "./src/test.txt";
    const path = "/tmpfs-mount/test.txt";

    let res: string[] = [];
  
    try {
        const file = Bun.file(path);
        const stream = file.stream();
    
        const reader = stream.getReader();
        let decoder = new TextDecoder("utf-8");
        let partialChunk = "";
    
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
    
            const textChunk = decoder.decode(value, { stream: true });
            partialChunk += textChunk;

            let lines = partialChunk.split("\n");
    
            for (const line of lines) {
                if (line.includes("=") || line.trim() === "" || line.includes("ID")) continue; // Discard lines with '=' underline
        
                // Check for the matching string
                if (line.includes(url)) {
                    res.push(line);
                    break
                }
            }
        }
    } catch (error) {
        console.error("Error reading file:", error);
    }

    console.log(res)

    return res;
}

// top level await solves this 

export const checkIfFileisPopulated = () => {

    // const path = "./src/test.txt"
    const path = "/tmpfs-mount/test.txt";

    const file =  Bun.file(path)
    console.log(file.size)

    if(file.size > 120){
        console.log("file is populated")
        return true
    } 
    
    return false

}

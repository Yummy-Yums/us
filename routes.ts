import {filterData, extractUrlData} from "./src/utils"
import {UrlHandler} from "./src/url"
import { InMemory } from "./src/inmemory"
import {singletonBloomFilter} from "./src/utils"

import { BloomFilter } from "./src/bloom_filter"

interface IRouteHandler{
  
  handlePath: () => Response
  handleRequest: () => Response
  
}

export class RouteHandler implements IRouteHandler {

  path: string;
  request_method: string
  args: any[]

  jsonData: Record<string, any> = {}
  // formData: Record<string, any> = {}

  constructor(path: string, request_method: string, ...args: any[]){
      this.path = path;
      this.request_method = request_method
      this.args = args
  }

  handlePath(): Response {

    switch(this.path) {
      case "/":
        return new Response("Welcome")
      
      case "/abc":
        return new Response("Welcome abc") 

      case "/source":
        return new Response("Welcome source")  
      
      default:
        return new Response("Unknown path")
    }
      
  }

  handleRequest(url?:string): any { 
    const path_new: string = this.path.replace("/", "-")

    var keyToPassIn = this.request_method + path_new

    this.jsonData = this.args.filter((arg) => filterData(arg, "jsonData"))

    const handler = handlers[keyToPassIn]

    if (url != undefined){
      return handler ? handler(url) : new Response("Something went wrong")
    }

    return handler ? handler(this.jsonData) : new Response("Something went wrong")
  }

}

const handlers: {[key: string]: (jsonData: any) => any} = {
  
  "GET-form/post" : () => new Response("handled request successfully"),
  "POST-api/post": (jsonData: any) => handleformData(jsonData),
  "GET-api/geturl": (url: string) => getFormData(url),
  "GET-api/geturl/redirect": (url: string) => getRedirectFormData(url)

}

const bf = new BloomFilter()

function handleformData(incomingData: Record<string, any>[]): Response {

  var extractedUrl = extractUrlData(incomingData)

  console.log("-------")

  const result = UrlHandler.parseURL(extractedUrl[0]);

  if (result instanceof URL) {

    console.log("Valid URL:", result.href);
  } else {

    console.log("Invalid URL ... Response:", result);

    return new Response(result)
  }
  
  const result2 = UrlHandler.convertAndSave(result)

  const extractedShortedUrl = result2.split("/").filter(elem => elem != "")[2]

  bf.add(extractedShortedUrl)

  const response = bf.check(extractedShortedUrl)

  console.log(response)

  var msg = 
  `handled form data called and things went well. 
   URL -> ${result2}
  `

  return new Response(msg)
  
}

async function getFormData(url: string) {

    let outerres = ""

    const response = bf.check(url)

    if(response){
      await InMemory.searchBy(url).then((res) => {
        outerres += res
      })
    } else {
      outerres += "Short URL doesn't exist..maybe it's not in the bloom filter, checking the db"
    }

    return new Response(outerres)
    
}

async function getRedirectFormData(url: string){

  let outerres = ""

  const response = bf.check(url)

  if(response){
    await InMemory.searchBy(url).then((res) => {
      outerres += res
    })
  } else{
    outerres += "Short URL doesn't exist"
  }

  return outerres

}


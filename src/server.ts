import {RouteHandler} from "../routes"
import { InMemory } from "./inmemory";
import { UrlHandler } from "./url";
import {singletonBloomFilter} from "./utils"

const server = Bun.serve({
    async fetch(req) {
      const url =  new URL(req.url)
      const path = url.pathname
      const method = req.method 

      if(path == "/api/post"){
        const data = await req.json();
        
        console.log("Received JSON:", data);

        const urlPayload = {"jsonData": data}
        const incomingURL = data['url']

        console.log("this is the incoming url in POST" + incomingURL)

        // bloom_filter.add(incomingURL)

        // bloom filter eliminates this whole functionality
        var urlAlreadyExists =  await InMemory.urlInMemoryCheck(incomingURL)

        if (urlAlreadyExists){

          return new Response("URL already exists," , {
            status: 404,
          })

        }

        var routeHandled = new RouteHandler(path, method, urlPayload)

        return routeHandled.handleRequest()
      }

      if(method == "GET" && path == "/api/geturl"){

        const queryParams = new URLSearchParams(url.search);
        const urlParam = queryParams.get('url')    

        if(urlParam){
          console.log("Received URL parameter: ", urlParam)
        } else {
          return new Response("URL parameter is missing", { status: 400 });
        }

        // bloom filter eliminates this whole funcitonality
        const check = await InMemory.urlInMemoryCheck(urlParam as string)

        if (!check){
          return new Response("Short url not found in db", { status: 404 });
        }
        
        // handle response and redirect user 

        var routeHandled = new RouteHandler(path, method)

        const res = routeHandled.handleRequest(urlParam)

        console.log(")))" + res)

        return res
    
      }

      if(method == "GET" && path == "/api/geturl/redirect"){

        const queryParams = new URLSearchParams(url.search);
        const urlParam = queryParams.get('url')
        
        if(urlParam){
          console.log("Received URL parameter: ", urlParam)
        } else {
          return new Response("URL parameter is missing", { status: 400 });
        }
        
        const check = await InMemory.urlInMemoryCheck(urlParam as string)

        if (!check){
          return new Response("Short url not found in db", { status: 404 });
        }
        // handle response and redirect user 
  
        var routeHandled = new RouteHandler(path, method)

        const res = await routeHandled.handleRequest(urlParam)

        console.log(res)

        if(!(res.includes(urlParam))){
          return new Response("Not Found....", {
            status: 404, // or 302 for temporary redirect
          });
        }

        let res2 = `${res}`
        
        const resUrl = res2.split("|").map((elem) => elem.trim())[2];


        return new Response("Redirected....", {
          status: 308, // or 302 for temporary redirect
          headers: {
            "Location": resUrl,
          },
        });
    
      }

      return new Response(".....")

    }
  
  });
  
console.log(`Listening on ${server.url}`);
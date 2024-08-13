# Url-Shortener

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/server.ts
```

This project was created using `bun init` in bun v1.1.6. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## How to run
- Check out `package.json` on how to run in dev mode or test. Using the httpie cli tool ( or any one of your choice)
- endpoints below

    - Endpoint: `/api/post` 
        
        CMD: run `http localhost:3000/api/post url="https://github.com"`

        Response:

        ``` 
        HTTP/1.1 200 OK
        Content-Length: 85
        Date: Thu, 25 Jul 2024 12:05:51 GMT
        content-type: text/plain;charset=utf-8

        handled form data called and things went well. 
        URL -> https://yumshortener/nsL

    - Endpoint: `/api/geturl`

        CMD: run `http localhost:3000/api/geturl?url="j7o"`

        Response:

        ```
        HTTP/1.1 200 OK
        Content-Length: 49
        Date: Thu, 25 Jul 2024 15:11:34 GMT
        content-type: text/plain;charset=utf-8

        53942 |           e22 | https://warp.com/


    - Endpoint: `/api/geturl/redirect` 

        CMD: run `http localhost:8080/api/geturl/redirect?url="j7o"`

        Response:

        ```
        HTTP/1.1 308 Permanent Redirect
        Content-Length: 14
        Date: Thu, 25 Jul 2024 15:14:00 GMT
        Location: https://warp.com/
        content-type: text/plain;charset=utf-8

        Redirected....

TODO - implement Redis ...
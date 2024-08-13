# URL Shortener - Background

- US service given a URL creates an alias with a shorter length, clicks the alias, and redirects you to the original URL
- generates probably 10K a day,  as short as possible
- Shortened URLs can be a combination of numbers (0-9) and letters (A-Z)


# Basic Shortener
- Basic use-cases :
 a. shortening: given a long URL => return a much shorter URL
 b. redirecting: given a shorter URL => redirect to the original URL
 c. High availability, scalability, and fault tolerance considerations
- Kind of response: 302 redirect vs 301 redirect
    - 301 - the requested URL is _permanently_ moved to the long URL. Browser caches the response and subsequent requests for the same URL will not be sent to the service
    - 302 - The requested URL is _temporarily_ moved to the long URL. Subsequent requests for the same URL will be sent to the service first
    - Flow :
 a. A user clicks a short URL link: [﻿https://baseURL/](https://baseurl/) 
 b. The load balancer forwards the request to web servers
 c. If a _shortURL_ is already in the cache, return the longURL directly.
 d. If a shortURL is not in the cache, fetch the _longURL _from the database. If it is not in the database, a user likely entered an invalid shortURL.
 e. The longURL is returned to the user.


# Stack 
TS, BUN



## Domain
URL

longURL

shortURL

URL

## Reference 

System Design Interview by Alex Xu 

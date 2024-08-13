import { expect, test, describe, beforeEach, afterEach } from "bun:test"
import { filterData, generateId, validateURL } from "../src/utils"
import { fetchMock, callsPostUrl, callsGetRedirectUrl, callsGetUrl } from "./utilsforTesting"


/*
TO-DO 
implement test for bloom filter 
*/

describe("unit tests for utils#filterdata", () => {

    const res = filterData({"":""}, "NonExistentKey")
    const res2 = filterData({"key exists" : 23}, "key exists")
    const res3 = filterData({"":""}, "")

    test("filterdata for an empty key, an existent key", () => {

        expect(res).toEqual({})
        expect(res2).toEqual(23)
        expect(res3).toEqual("")
        
    })

})

describe("unit tests for utils#validateURL", () => {

    const validUrl = "https://facebook.com"
    const invalidUrl = "htt://fabook.com"

    const res  = validateURL(validUrl)
    const res2 = validateURL(invalidUrl)
    const res3 = validateURL("")

    test("whether url is valid", () => {

        expect(res).toEqual(true)
        expect(res2).toEqual(false)
        expect(res3).toBe(false)

    })

})

describe("unit tests for utils#generateId", () => {

    const res = generateId()

    test("whether id generated correctly", () => {

        expect(res.toString().length).toBe(5)
        expect(res.toString().length).toBeGreaterThan(4)
        expect(res).toBeTypeOf("number")
        
    })

})


beforeEach(() => {
    global.fetch = fetchMock
});

afterEach(() => {
    global.fetch = undefined
})

describe("api call tests for server#API Calls", () => {

    
    test("whether /api/post endpoint works as expected", async () => {
        
        const result = await callsPostUrl();

        expect(result['success']).toBe(true)
        
    })

    test("whether /api/geturl endpoint works as expected", async () => {

        const result = await callsGetUrl();

        expect(result['success']).toBe(true)

    })

    test("whether /api/geturl/redirect endpoint works as expected", async () => {

        const result = await callsGetRedirectUrl();

        expect(result['success']).toBe(true)

  
    })

})

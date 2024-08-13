/*

- function to create shorten a url
- function to get a url
- function to 
*/


export async function callsPostUrl(){

    const postData = JSON.stringify({"url": "https://whatsapp.com"})

    const res = await fetch(`localhost:3000/api/post`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: postData
    })

    if(!res.ok){
        throw new Error('Request not completed, please try again')
    }

    return res.json()

}

export async function callsGetUrl(){

    const shortURL = "hzd"
    const res = await fetch(`localhost:3000/api/geturl?url=fog`)

    if(!res.ok){
        throw new Error('Request not completed, please try again')
    }

    return res.json()

}

export async function callsGetRedirectUrl(){

    const shortURL = "fog"
    const res = await fetch(`localhost:3000/api/geturl/redirect?url=fog`);
   
    if(!res.ok){
        throw new Error('Request not completed, please try again')
    }

    return res.json()

}

// fetchMock.js
export const fetchMock = (url:any, options:any) => {

    const shortURL               = "fog"
    const requestPostUrl         = 'localhost:3000/api/post'
    const requestGetUrl          = `localhost:3000/api/geturl?url=${shortURL}`;
    const requestRedirectGetUrl  = `localhost:3000/api/geturl/redirect?url=${shortURL}`;

    const res = `
    handled form data called and things went well. 
    URL -> https://yumshortener/4ER
    `
    const res2 = `
            67531 |           hzd | https://gmail.com/
    `

    const res3 = `
    https://web.facebook.com/?_rdc=1&_rdr
    `

    if(url == requestPostUrl){
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({ success: true, text: res }),
      });
    }

    if(url == requestGetUrl){
        return Promise.resolve({
            ok: true,
            status: 200,
            json: async () => ({ success: true, text: res2 }),
        });

    }

    if(url == requestRedirectGetUrl){
        return Promise.resolve({
            ok: true,
            status: 200,
            json: async () => ({ success: true, text: res3 }),
        });

    }
  
    return Promise.reject(new Error('Unknown URL'));
};
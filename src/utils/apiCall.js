import 'isomorphic-fetch'
import 'es6-promise'
import config from '../config'
const {baseUrl} = config.api

export default (token, refreshToken) => async (url, method = 'GET', {params, type = null, base_url = baseUrl} = {}) => {
    // let token = this.token
    // let refreshToken = this.token
    let headers_data = {}
    let body = {}

    if(method == 'GET'||method == 'DELETE'){
        let i = 0
        let query = ''
        for(let name in params){
            if(!params[name]){
                continue;
            }
            query += `${i>0?'&':'?'}${name}=${params[name]}`
            i++
        }
        url += query
        params = undefined
    }

    switch (type){
        case 'form-data':
            body = params
            break
        default:
            headers_data = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
            body = JSON.stringify(params)
    }

    const headers = new Headers(headers_data)

    if(token){
        headers.append('Authorization', 'Bearer '+token)
    }

    try {
        const data = await fetch(`${base_url}${url}`, {method: method, headers: headers, body: body, mode: 'cors'})
        if(data.status >= 400){
            const {error} = await data.json()
            if(data.status == 401){
                if(refreshToken){
                    const refresh = await fetch(`${base_url}/token/refresh`, {method: 'POST', body: JSON.stringify({refreshToken: refreshToken})})
                    const {token: t, refreshToken: rt} = await refresh.json()
                    token=t
                    refreshToken=rt
                    headers.set('Authorization', `Bearer ${token}`)
                    const data = await fetch(`${base_url}${url}`, {method: method, headers: headers, body: body, mode: 'cors'})
                    return await data.json()
                }
            }
            throw new Error (error)
        }
        return await data.json()
    }
    catch (e){
        throw e
    }
}
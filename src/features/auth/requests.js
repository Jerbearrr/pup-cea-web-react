import axios from "axios";
import { reset, getUser } from './authSlice'
import jwt_decode from "jwt-decode";
let store

export const injectStorebook = _store => {
    store = _store
}

const checkIfExpired = () => {
    let accToken = store.getState().auth.user.accessToken
    var decoded = jwt_decode(accToken);
    var now = new Date();
    var time = now.getTime();
    var exp = new Date((decoded.exp * 1000) - (5 * 1000));
    if (time > exp) {

        return true

    } else {

        return false
    }
}

export const url = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://pup-weblibrary.herokuapp.com";
export const SSEURL = process.env.NODE_ENV === "development" ? "http://localhost:8080" : "https://pup-weblibrary.herokuapp.com";

export const verifyApi = url + "/verify";
export const api = url + "/users";
export const apibook = url + "/books";
export const apiDigitalCopy = url + '/digitalCopy';

export const verification = axios.create({
    baseURL: verifyApi,
    withCredentials: true,
    headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
})

export const apiClientBase = axios.create({

    baseURL: url,
    withCredentials: true,

    headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
});

apiClientBase.interceptors.request.use(async config => {

    let expirechecker = checkIfExpired()
    if (!expirechecker) {
        config.headers.authorization = `Bearer ${store.getState().auth.user.accessToken}`
        return config
    }

    const response = await store.dispatch(getUser())
    config.headers.authorization = `Bearer ${response.payload.accessToken}`
    return config
})

export const userApiWithCreds = axios.create({
    baseURL: api,
    withCredentials: true,

    headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
})

userApiWithCreds.interceptors.request.use(async config => {

    let expirechecker = checkIfExpired()
    if (!expirechecker) {
        config.headers.authorization = `Bearer ${store.getState().auth.user.accessToken}`
        return config
    }

    const response = await store.dispatch(getUser())
    config.headers.authorization = `Bearer ${response.payload.accessToken}`
    return config
})

export const apiClient = axios.create({

    baseURL: api,
    withCredentials: true,

    headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
});


export const apiClientBook = axios.create({

    baseURL: apibook,
    withCredentials: true,

    headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
});

export const apiClientBookPublic = axios.create({

    baseURL: apibook,
    withCredentials: true,

    headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
});

export const digitalCopyApi = axios.create({
    baseURL: apiDigitalCopy,
    withCredentials: true,
    headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
})


digitalCopyApi.interceptors.request.use(async config => {

    let expirechecker = checkIfExpired()
    if (!expirechecker) {
        config.headers.authorization = `Bearer ${store.getState().auth.user.accessToken}`
        return config
    }

    const response = await store.dispatch(getUser())
    config.headers.authorization = `Bearer ${response.payload.accessToken}`
    return config

    
})

apiClientBook.interceptors.request.use(async config => {
    let state = store.getState()

    let expirechecker = checkIfExpired()
    if (!expirechecker) {
        config.headers.authorization = `Bearer ${store.getState().auth.user.accessToken}`
        return config
    }

    const response = await store.dispatch(getUser())
    config.headers.authorization = `Bearer ${response.payload.accessToken}`
    return config
})

apiClientBookPublic.interceptors.request.use(config => {
    config.headers.authorization = `Bearer ${store.getState().auth.user.accessToken}`
    return config
})



export const fetchPosts = () => axios.get(apibook);
export const createPost = (newPost) => axios.post(apibook, newPost);
export const likebooks = (id) => apiClientBook.patch(`${apibook}/${id}/likeBook`);
export const updatePost = (id, updatedPost) => axios.patch(`${apibook}/${id}`, updatedPost);
export const deletePost = (id) => axios.delete(`${apibook}/${id}`);

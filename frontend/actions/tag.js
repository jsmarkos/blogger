
import fetch from 'isomorphic-fetch';
import {API} from '../config';


/// TAG///TAG//


// Tag oluşturma
export const create=(tag,token)=>{
    return fetch(`${API}/tag`,{
        method:'POST',
        headers:{
            Accept:'application/json',
            'Content-Type':'application/json',
            Authorization:`Bearer ${token}`
        },
        body:JSON.stringify(tag)
    })
        .then(response =>{
            return response.json()
        })
        .catch(err=>{
            console.log(err);
        
    })
}

// Tag okuma-gösterme
export const getTags=()=>{
    return fetch(`${API}/tags`,{
        method:'GET'
       
    })
        .then(response =>{
            return response.json()
        })
        .catch(err=>{
            console.log(err);
        
    })
}

// Tag bilgi gösterme
export const singleTag=(slug)=>{
    return fetch(`${API}/tag/${slug}`,{
        method:'GET'
       
    })
        .then(response =>{
            return response.json()
        })
        .catch(err=>{
            console.log(err);
        
    })
}

// Tag silme
export const removeTag=(slug,token)=>{
    return fetch(`${API}/tag/${slug}`,{
        method:'DELETE',
        headers:{
            Accept:'application/json',
            'Content-Type':'application/json',
            Authorization:`Bearer ${token}`
        }
    })
        .then(response =>{
            return response.json()
        })
        .catch(err=>{
            console.log(err);
        
    })
}
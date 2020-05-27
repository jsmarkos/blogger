import fetch from 'isomorphic-fetch';
import {API} from '../config';
import queryString from 'query-string';
import {isAuth} from '../actions/auth'

// Blog oluşturma
export const createBlog=(blog,token)=>{
// user write is blog
    let createBlogEndpoint;
    if(!isAuth() && isAuth().role===1){
      createBlogEndpoint= `${API}/blog`
    }else{
      if(isAuth() && isAuth().role===0){
        createBlogEndpoint=`${API}/user/blog`
      }
    }

    return fetch(`${createBlogEndpoint}`,{
        method:'POST',
        headers:{
            Accept:'application/json',
            // 'Content-Type':'application/json',
            Authorization:`Bearer ${token}`
        },
        body:blog
    })
        .then(response =>{
            return response.json()
        })
        .catch(err=>{
            console.log(err);

    })
}


// LIST BLOG


export const listBlogsCategoriesAndTags=(skip,limit)=>{

    const data = {
        limit,skip
    }
    return fetch(`${API}/blogs-categories-tags`,{
        method:'POST',
        headers:{
            Accept:'application/json',
            'Content-Type':'application/json',
            // Authorization:`Bearer ${token}`
        },
        body:JSON.stringify(data)
    })
        .then(response =>{
            return response.json()
        })
        .catch(err=>{
            console.log(err);

    })
};

export const singleBlog =(slug) =>{
    return fetch(`${API}/blog/${slug}`,{
        method:'GET'
    })
    .then(response =>{
        return response.json()
    })
    .catch(err => console.log(err));
};


export const listRelated=(blog)=>{


    return fetch(`${API}/blogs/related`,{
        method:'POST',
        headers:{
            Accept:'application/json',
            'Content-Type':'application/json',
            // Authorization:`Bearer ${token}`
        },
         body:JSON.stringify(blog)
    })
        .then(response =>{
            return response.json()
        })
        .catch(err=>{
            console.log(err);

    })
};
// LIST  // LIST // LIST // LIST  ADMIN
export const  list = () =>{
    return fetch(`${API}/blogs`,{
        method : 'GET'
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
}


// REMOVE // REMOVE // REMOVE // REMOVE ADMIN
export const removeBlog=(slug,token)=>{
    return fetch(`${API}/blog/${slug}`,{
        method:'DELETE',
        headers:{
            Accept:'application/json',
            'Content-Type':'application/json',
            Authorization:`Bearer ${token}`
        },
    })
        .then(response =>{
            return response.json()
        })
        .catch(err=>{
            console.log(err);

    })
}

// UPDATE // UPDATE // UPDATE // UPDATE

export const updateBlog=(blog,token,slug)=>{
    return fetch(`${API}/blog/${slug}`,{
        method:'PUT',
        headers:{
            Accept:'application/json',
            // 'Content-Type':'application/json',
            Authorization:`Bearer ${token}`
        },
        body:blog
    })
        .then(response =>{
            return response.json()
        })
        .catch(err=>{
            console.log(err);

    })
}


// SEARCH

export const  listSearch = (params) =>{
    console.log('search-params',params) // {search = {node}}
    // const parsed = queryString.parse(location.search);
    let query = queryString.stringify (params) // ?limit=100&pagination=10
    console.log('search-params',query)

    return fetch(`${API}/blogs/search?${query}`,{
        method : 'GET'
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
}

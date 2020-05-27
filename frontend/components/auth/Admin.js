import  {useEffect} from 'react'
import Router  from 'next/router'
import {isAuth} from '../../actions/auth'

const Admin = ({children}) =>{   
    useEffect(() =>{
        if(!isAuth()){ // giriş yapılmadıysa signi  page e yonlendır
            Router.push('/signin')
        }else if(isAuth().role !==1){ // giriş yapılıp rol  1 den farklı yani user ise anasayfaya at
            Router.push('/')
        }
    },[])
    return <React.Fragment>{children}</React.Fragment>
}

export default Admin;
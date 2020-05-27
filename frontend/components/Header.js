import {useState} from 'react'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText
} from 'reactstrap';

import Nprogress from 'nprogress'
import {APP_NAME} from '../config'
import Link from 'next/link';
import {signout,isAuth} from '../actions/auth'
import  Router  from 'next/router';
import '.././node_modules/nprogress/nprogress.css'
import Search from './blog/Search'

// Nprogress
Router.onRouteChangeStart = url => Nprogress.start()
Router.onRouteChangeComplete = url => Nprogress.done()
Router.onRouteChangeError = url => Nprogress.done()

const Header =() =>{
    const [isOpen,setIsOpen]=useState(false)

    const toggle = ()=>{
        setIsOpen(!isOpen)
    }
    return (
        <React.Fragment>
          <Navbar color="light" light expand="md">
            <Link href="/">
                <NavLink style={{cursor:'pointer'}} className="font-weight-bold">{APP_NAME}</NavLink>
            </Link>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
              <Nav className="ml-auto" navbar>

              <React.Fragment>
                <NavItem>
                    <Link href="/blogs">
                        <NavLink style={{cursor:'pointer'}}  >Blogs</NavLink>
                    </Link>
                </NavItem>
              </React.Fragment>


              {!isAuth() && <React.Fragment>
                <NavItem>
                    <Link href="/signin">
                        <NavLink  style={{cursor:'pointer'}}  >Signin</NavLink>
                    </Link>
                </NavItem>

                <NavItem>
                    <Link href="/signup">
                        <NavLink style={{cursor:'pointer'}} > Signup</NavLink>
                    </Link>
                </NavItem>

              </React.Fragment>}




               {isAuth() && isAuth().role === 0 &&(
                  <NavItem>
                        <Link href="/user">
                          <NavLink>
                          {`${isAuth().name}'s Dashboard`}
                          </NavLink>
                        </Link>
                </NavItem>
               )}


               {isAuth() && isAuth().role ===1 && (
                  <NavItem>
                        <Link href="/admin">
                          <NavLink>
                          {`${isAuth().name}'s Dashboard`}
                          </NavLink>
                        </Link>
                </NavItem>
               )}



               {isAuth() && (
                  <NavItem>
                        <NavLink style={{cursor:'pointer'}} onClick={()=>signout(() => Router.replace(`/signin`))}>Signout</NavLink>
                </NavItem>
               )}

               <NavItem>
                   <Link href="/user/crud/create">
                       <NavLink   className="btn btn-danger text-light" style={{cursor:'pointer'}}  >Write a blog</NavLink>
                   </Link>
               </NavItem>


              </Nav>
            </Collapse>
          </Navbar>
          <Search/>
        </React.Fragment>
      );
    };

export default Header;

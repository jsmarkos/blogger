import Layout from '../../components/Layout'
import Private from '../../components/auth/Private'
import Link from 'next/link'

const UserIndex=() =>{
    return (
        <Layout>
        <Private>
            <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 pb-5 pt-5"><h2>User dashboard</h2></div>                        
                        <div className="col-md-4">
                            

                            <ul class="list-group">
                                <li className="list-group-item">
                                    <Link  href="/user/crud/blog" >
                                        <a>Create Blog</a>
                                    </Link>
                                </li>
                            </ul>



                            <ul class="list-group">
                                <li className="list-group-item">
                                    <Link href="/user/crud/blogs">
                                        <a>Update/Delete Blog</a>
                                    </Link>
                                </li>
                            </ul>

                            <ul class="list-group">
                                <li className="list-group-item">
                                    <Link  href="/user/update" >
                                        <a>Update Profile</a>
                                    </Link>
                                </li>
                            </ul>




                        </div>
                        <div className="col-md-8">right</div>    
                    </div>
                </div>
                </Private>
        </Layout>
    )
}

export default UserIndex;
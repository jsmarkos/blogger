import Layout from '../../components/Layout'
import Link from 'next/link';
import Admin from '../../components/auth/Admin'


const AdminIndex=() =>{
    return (
        <Layout>
            <Admin>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 pb-5 pt-5"><h2>Admin dashboard</h2></div>
                        <div className="col-md-4">
                            <ul class="list-group">
                                <li className="list-group-item">
                                    <Link href="/admin/crud/category-tag">
                                        <a>Create Category</a>
                                    </Link>
                                </li>
                            </ul>


                            <ul class="list-group">
                                <li className="list-group-item">
                                    <Link href="/admin/crud/category-tag">
                                        <a>Create Tag</a>
                                    </Link>
                                </li>
                            </ul>

                            <ul class="list-group">
                                <li className="list-group-item">
                                    <Link  href="/admin/crud/blog" >
                                        <a>Create Blog</a>
                                    </Link>
                                </li>
                            </ul>



                            <ul class="list-group">
                                <li className="list-group-item">
                                    <Link href="/admin/crud/blogs">
                                        <a>Update/Delete Blog</a>
                                    </Link>
                                </li>
                            </ul>

                            <ul class="list-group">
                                <li className="list-group-item">
                                    <Link href="/user/update">
                                        <a>Update Profile</a>
                                    </Link>
                                </li>
                            </ul>





                        </div>
                        <div className="col-md-8">right</div>
                    </div>
                </div>
            </Admin>
        </Layout>
    )
}

export default AdminIndex;

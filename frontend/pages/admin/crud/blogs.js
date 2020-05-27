import Layout from '../../../components/Layout'
import Link from 'next/link';
import Admin from '../../../components/auth/Admin'
import BlogRead from '../../../components/crud/BlogRead'



const Blog=() =>{
    return (
        <Layout>
            <Admin>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 pb-5 pt-5"><h2>Manage blogs</h2></div>                        
                        <div className="col-md-12">
                           <BlogRead />
                        </div>

                    </div>
                </div>
            </Admin>            
        </Layout>
    )
}

export default Blog;
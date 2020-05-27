import Layout from '../../../components/Layout'
import Link from 'next/link';
import Admin from '../../../components/auth/Admin'
import BlogUpdate from '../../../components/crud/BlogUpdate'


const Blog=() =>{
    return (
        <Layout>
            <Admin>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 pb-5 pt-5"><h2>Update a blog</h2></div>                        
                        <div className="col-md-12">
                           <BlogUpdate/>
                        </div>
                    </div>
                </div>
            </Admin>            
        </Layout>
    )
}

export default Blog;
import Link from 'next/link';
import {useEffect,useState} from 'react'
import Router from 'next/router';
import dynamic from 'next/dynamic';
import {withRouter} from 'next/router';
import {getCookie,isAuth} from '../../actions/auth'
import {getCategories}  from '../../actions/category'       
import {getTags}  from '../../actions/tag'       
import {singleBlog,updateBlog}  from '../../actions/blog'
import {QuillModules,QuillFormats} from '../../helpers/quill'   
// import ReactQuill from 'react-quill'; // ES6
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import '../../node_modules/react-quill/dist/quill.snow.css';
import {API} from '../../config'
const {Quill} = ReactQuill


const BlogUpdate = ({router}) =>{

    // const [title,setTitle] = useState('');
    const [body,setBody] = useState('');

    const [categories,setCategories] = useState([])
    const [tags,setTags] = useState([]) 

    // categories and tag checked solution
    const [checked,setChecked]=useState([]) //categories
    const [checkedTag,setCheckedTag]=useState([]) //tags



    const [values,setValues]=useState({
        title:'',
        error:'',
        success:'',
        formData:'',
        title:'',
        body:''
    })

    const {error,success,formData,title} = values;
    const token = getCookie('token');

    useEffect(()=>{
        setValues({...values,formData:new FormData()})
        initBlog()
        initCategories()
        initTags()
    },[router])

const initBlog = () =>{
    if(router.query.slug){
        singleBlog(router.query.slug).then(data => {
            if(data.error){
                console.log(data.error);
            }else{
                setValues({...values,title:data.title})
                setBody(data.body)
                setCategoriesArray(data.categories)
                setTagsArray(data.tags)
            }
        })
    }
}

const setCategoriesArray = (blogCategories) =>{
    let ca= []
    blogCategories.map((c,i) =>{
        ca.push(c._id)
    })
    setChecked(ca)
}

const setTagsArray = (blogTags) =>{
    let ta = []
    blogTags.map((t,i) =>{
        ta.push(t._id)
    })
    setCheckedTag(ta)
}

const initCategories = () => {
    // başlangıc degerini getCategories den  alıyoruz
    getCategories().then(data => { // kategoriyi çektik
        if (data.error) {
            setValues({
                ...values,
                error: data.error
            })
        } else {
            setCategories(data)
        }
    })
}
    const initTags = () => {
    // başlangıc degerini getTags den  alıyoruz
    getTags().then(data => { // tag' ı çekip okuduk
        if (data.error) {
            setValues({
                ...values,
                error: data.error
            })
        } else {
            setTags(data)
        }
    })
}

//// TAG ----- FILTER ------ TAG ////
// tag seçimini yapıyoruz
const handleToogleTag = t => () =>{
    setValues({...values,error:''})

    const clickedTag = checkedTag.indexOf(t)
    const all = [...checkedTag]

    if(clickedTag===-1){
        all.push(t)
    }else{
        all.splice(clickedTag,1)
    }
    console.log(all);

        setCheckedTag(all)

        formData.set('tags',all)
}

// categori 
const handleToogle = (c) => ()=>{
    setValues({...values,error:''})
    
    // return the first index -1
    const clickedCategory = checked.indexOf(c)
    const all =[...checked] // kategorilerin hepsini seçiyoruz

    if(clickedCategory === -1){ // kategoriye tıklandımı
        all.push(c) // sectgimiz  indexi dizinin sonuna ekliyoruz.
    }else{
        all.splice(clickedCategory,1) // kategori unchecked yapınca siliyor.
    }

    console.log(all)
    setChecked(all)
     formData.set('categories',all)
}

const findOutCategory = (c) =>{
    const result = checked.indexOf(c)
    if(result !== -1){
       return true
    }else{
        return false
    }
}

const findOutTag= (t) =>{
    const result = checkedTag.indexOf(t)
    if(result !== -1){
       return true
    }else{
        return false
    }
}


// kategori seçimini yapıp gösteriyoruz
const showCategories = () =>{
    return(
        categories && categories.map((c,i) =>(
            <li className="list-unstyled">
                <input onChange={handleToogle(c._id)}
                checked={findOutCategory(c._id)} 
                type="checkbox" 
                className="mr-2"/>
                <label className="form-check-label">{c.name}</label>
            </li>
        ))
    )
}
// tag seçimi yapıp gösteriyoruz
    const showTags = () =>{
        return(
            tags && tags.map((t,i) =>(
                <li  key={i} className="list-unstyled">
                    <input onChange={handleToogleTag(t._id)} 
                    checked={findOutTag(t._id)} 
                    type="checkbox" 
                    className="mr-2"/>
                    <label className="form-check-label">{t.name}</label>
                </li>
            ))
        )
    }   



const handleChange = (name) => (e) =>{
    // console.log(event.target.value);
    const value = name === 'photo' ? e.target.files[0] : e.target.value 
    // name ın tuttugu deger  true ıse e.target.files[0] degerini false ise e.target.value değerini alır.
    formData.set(name,value);
    setValues({...values,[name]:value,formData,error:''})
}



const handleBody = e =>{
    setBody(e);
    formData.set('body',e)
}


const editBlog = (e) =>{
    e.preventDefault()
    updateBlog(formData,token,router.query.slug).then(data =>{
        if(data.error){
            setValues({...values,error:data.error})
        }else{
            setValues({...values,title:'',success:`Blog titled "${data.title}" is successfully updated!`})
            if(isAuth() && isAuth().role===1){
                // Router.replace(`/admin/crud/${router.query.slug}`)
                Router.replace(`/admin`)
            } else if (isAuth() && isAuth().role===0){
                // Router.replace(`/user/crud/${router.query.slug}`)
                Router.replace(`/user`)

            }
        }
    })
    // console.log('updated blog');
}
  // hata oluşunca

const showError = () =>(
    <div 
    className="alert alert-danger" 
    style={{display: error ? '' : 'none'}}>
    {error}
    </div>
)

// başarılı yayınlanınca
const showSuccess = () =>(
    <div 
    className="alert alert-success" 
    style={{display: success ? '' : 'none'}}>
    {success}
    </div>
)

const updateBlogForm = () => {
    return (
        <form onSubmit={editBlog}>
            <div className="form-group">
                <label className="text-muted">Title</label>
                <input type="text" className="form-control" value={title} onChange={handleChange('title')} />
            </div>

            <div className="form-group">
                <ReactQuill
                    modules={QuillModules}
                    formats={QuillFormats}
                    value={body}
                    placeholder="Write something amazing..."
                    onChange={handleBody}
                />
            </div>

            <div>
                <button type="submit" className="btn btn-primary">
                    Update
                </button>
            </div>
        </form>
    );
};
return (
    <div className="container-fluid pb-5">
        <div className="row">
            <div className="col-md-8">
                {updateBlogForm()}
                <div className="pt-3">
                    {/* <p>show success and error msg</p> */}
                    {showError()}
                    {showSuccess()}
                </div>

                {body &&(
                <img src={`${API}/blog/photo/${router.query.slug}`} alt={title} style={{width: '100%'}} />
                )}
            </div>

            <div className="col-md-4">
                <div>
                    <div className="form-group pb-2">
                        <h5>Featured image</h5>
                        <hr />

                        <small className="text-muted">Max size: 1mb</small>
                        <br />
                        <label className="btn btn-outline-info">
                            Upload featured image
                            <input onChange={handleChange('photo')} type="file" accept="image/*" hidden />
                        </label>
                    </div>
                </div>
                <div>
                    <h5>Categories</h5>
                    <hr />

                    <ul style={{ maxHeight: '200px', overflowY: 'scroll' }}>{showCategories()}</ul>
                </div>
                <div>
                    <h5>Tags</h5>
                    <hr />
                    <ul style={{ maxHeight: '200px', overflowY: 'scroll' }}>{showTags()}</ul>
                </div>
            </div>
        </div>
    </div>
);
};




export default withRouter(BlogUpdate)
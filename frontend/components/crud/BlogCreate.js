import Link from 'next/link';
import {useEffect,useState} from 'react'
import Router from 'next/router';
import dynamic from 'next/dynamic';
import {withRouter} from 'next/router';
import {getCookie,isAuth} from '../../actions/auth'
import {getCategories}  from '../../actions/category'
import {getTags}  from '../../actions/tag'
import {createBlog}  from '../../actions/blog'
import {QuillFormats,QuillModules} from '../../helpers/quill'
import '../../node_modules/react-quill/dist/quill.snow.css';




// forum text stil
const ReactQuill = dynamic(() => import ('react-quill'), {ssr: false}) // forum kutusu olusturuyoruz
const {Quill} = ReactQuill
import '../../node_modules/react-quill/dist/quill.snow.css'

const CreateBlog = ({router}) => {
    // ** Text de yazılan degerleri localstorage de tutuyor
    const blogFormLS = () => {
        if (typeof window === 'undefined') {
            return false
        }

        if (localStorage.getItem('blog')) {
            return JSON.parse(localStorage.getItem('blog'))
        } else {
            return false;
        }
    }

    // show categories and tags
    const [categories,setCategories] = useState([])
    const [tags,setTags] = useState([])

    // categories and tag checked solution
    const [checked,setChecked]=useState([]) //categories
    const [checkedTag,setCheckedTag]=useState([]) //tags

    // blog writing
    const [body,setBody]=useState(blogFormLS())
    const [values,setValues]=useState({
        error:'',
        sizeError:'',
        success:'',
        formData:'',
        title:'',
        hidePublishButton:false
    })


    const {error,sizeError,success,formData,title,hidePublishButton} = values;
    const token=getCookie('token') // -> publishing blog

    useEffect(() =>{
        setValues({...values,formData:new FormData()})
        initCategories()
        initTags()
    },[router]) // yönlendırme olunca calısacak


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

    const publishBlog = (e) =>{
        e.preventDefault()
        // console.log('ready to publishBlog');
        createBlog(formData,token).then(data =>{
            if(data.error){
                setValues({...values,error:data.error})
            }else{
                setValues({...values,title:'',error:'',success:`A new blog titled "${data.title}" is created.`})
                setBody('')
                setCategories([])
                setTags([])
            }
        })
    }

    const handleChange = (name) => (e) =>{
        // console.log(event.target.value);
        const value = name === 'photo' ? e.target.files[0] : e.target.value
        // name ın tuttugu deger  true ıse e.target.files[0] degerini false ise e.target.value değerini alır.
        formData.set(name,value);
        setValues({...values,[name]:value,formData,error:''})
    }

    const handleBody =  (e) =>{
        // console.log(event);,
        setBody(e)
        formData.set('body',e)

        if(typeof window !== 'undefined'){
            localStorage.setItem('blog',JSON.stringify(e))
        }
    };

    // CATEGORY ------- FILTER ------- CATEGORY !!!
    // kategori kontrolu yapıyoruz  || kategori seçimi yapıyoruz
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

    // kategori seçimini yapıp gösteriyoruz
    const showCategories = () =>{
        return(
            categories && categories.map((c,i) =>(
                <li className="list-unstyled">
                    <input onChange={handleToogle(c._id)} type="checkbox" className="mr-2"/>
                    <label className="form-check-label">{c.name}</label>
                </li>
            ))
        )
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

    // tag seçimi yapıp gösteriyoruz
    const showTags = () =>{
        return(
            tags && tags.map((t,i) =>(
                <li  key={i} className="list-unstyled">
                    <input onChange={handleToogleTag(t._id)} type="checkbox" className="mr-2"/>
                    <label className="form-check-label">{t.name}</label>
                </li>
            ))
        )
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


    ////


    // const FormWithToasts = () => {
    //     const { addToast } = useToasts()

    //     const publishBlog = async value => {
    //       const { error } = await dataPersistenceLayer(value)

    //       if (error) {
    //         addToast(error.message, { appearance: 'error' })
    //       } else {
    //         addToast('Saved Successfully', { appearance: 'success' })
    //       }
    //     }
    // }




    const createBlogForm = () =>{
        return(
            <form onSubmit={publishBlog}>
                <div>
                    <label className="text-muted">Title</label>
                    <input type="text" className="form-control" onChange={handleChange('title')}></input>
                </div>

                <div className="form-group">
                    <ReactQuill modules={QuillModules} formats={QuillFormats} value={body} placeholder="çılgınca birşeyler yaz..." onChange={handleBody}/>
                </div>

                <div>
                    <button type="submit" className="btn btn-primary">Publish</button>
                </div>

            </form>
        )
    }
    return (<div className="container-fluid pb-5">

                <div className="row">
                    <div className="col-md-8">
                        {createBlogForm()}

                        <div className="pt-3">
                            {showError()}
                            {showSuccess()}
                        </div>

                     </div>
                      <div className="col-md-4">

                      <div>
                          <div className="form-group pb-2">
                                <h5>Featured image</h5>
                                <hr/>
                            <div>
                            <medium className="text-muted" >MAX SIZE:1MB </medium>
                                    <label className="btn btn-outline-info">Upload image
                                    <input onChange={handleChange('photo')} type="file" accept="image/*" hidden></input>

                                </label>
                            </div>
                          </div>
                      </div>


                        <div>
                        <h5>Categories</h5>
                            <hr/>
                            <ul style={{maxHeight:"150px",overflowY:'scroll'}}>{showCategories()}</ul>
                        </div>


                        <div>
                        <h5>Tags</h5>
                             <hr/>
                             <ul style={{maxHeight:"150px",overflowY:'scroll'}}>{showTags()}</ul>
                        </div>
                    </div>
                </div>
    </div>)
}


// Quill editor system functions

export default withRouter(CreateBlog);

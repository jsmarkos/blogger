import {useState,useEffect} from 'react'
import { Link } from "next/link";
import Router from 'next/router';
import {isAuth,getCookie} from '../../actions/auth'
import {create,getCategories,removeCategory} from '../../actions/category';


const Category = () => {
    const [values,setValues] = useState({
        name:"",
        error:false,
        success:false,
        categories:[],
        removed:false,
        reload:false
    })

    const {name,error,success,categories,removed,reload} = values;
    const token=getCookie('token');

    useEffect(() =>{
        loadCategories()
    },[reload])

    // kategorileri yükleme
    const loadCategories = () =>{
        getCategories().then((data) =>{
            if(data.error){
                console.log(data.error);
            }else{
                setValues({...values,categories:data})
            }
        })
    }

    // kategorileri göster

    const showCategory = ()=>{
        return categories.map((x,i)=>{
            return (
            <button 
                onDoubleClick={() => deleteConfirm(x.slug)} 
                title="Double click to delete"key={i} 
                className="btn btn-outline-success mr-1 ml-1 mt-3">
                {x.name}
            </button>
            );
        })
    }

    const mouseMoveHandler = (e) =>{
        setValues({...values,error:false,success:false,removed:''})
    }

    // kategori silmez

    const deleteConfirm = (slug) =>{
        let answer = window.confirm('Are you sure you want to delete this category?')
        deleteCategory(slug)
    }

    const deleteCategory =(slug) =>{
        // console.log('delete',slug);
        removeCategory(slug,token).then((data)=>{
            if(data.error){
                console.log(data.error);
            }else{
                setValues({...values,error:false,success:false,name:'',removed:!removed,reload:!reload})
            }
        })
    }



    const clickSubmit = (e)=>{
        e.preventDefault()
        // console.log('create category',name);

        create({name},token).then((data) =>{
            if (data.error) 
            {setValues({ ...values, error: data.error, success: false });}
          else {
             setValues({ ...values, error: false, success: true, name: '' ,reload:!reload});
            }
        })
    }
        

    const handleChange = (e) =>{
        setValues({...values,name:e.target.value,error:false,success:false,removed:''})
    }

    const showSuccess = () =>{
        if(success){
            return <p className="alert alert-success">Category is created</p>
        }
    }
    const showError = () =>{
        if(error){
            return <p className="alert alert-warning">Category already exist</p>
        }
    }
    const showRemoved = () =>{
        if(removed){
            return <p className="alert alert-danger">Category is removed</p>
        }
    }

    const newCategoryForm= () =>(
        <form onSubmit={clickSubmit}>
            <div className="form-group">
                <label className="text-muted">Category Name</label>
                <input type="text" className="form-control" onChange={handleChange} value={name} required/>
            </div>

            <div>
                <button type="submit" className="btn btn-success">Create</button>

            </div>
        </form>
        
    )   

    return <React.Fragment>
    {showSuccess()}
    {showError()}
    {showRemoved()}
        
        <div onMouseMove={mouseMoveHandler}>{newCategoryForm()}
         {showCategory()}</div>
    </React.Fragment>

}



export default Category;
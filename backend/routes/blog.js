const express = require('express');
const router = express.Router();
const {requireSignin,adminMiddleware,authMiddleware,canUpdateDeleteBlog}=require('../controllers/auth')
const {create,list,
    listAllCategoriesTags,
    read,
    remove,
    update,
    photo,
    listRelated,
    listSearch,
    listByUser
}=require('../controllers/blog')

router.post('/blog',requireSignin,adminMiddleware,create);
router.get('/blogs',list); // blog list all show
router.get('/blog/:slug',read); // blog list all show
router.delete('/blog/:slug',requireSignin,adminMiddleware,remove); // blog list all show
router.post('/blogs-categories-tags',listAllCategoriesTags); // blog list all show
router.put('/blog/:slug',requireSignin,adminMiddleware,update); // blog list all show
router.get('/blog/photo/:slug',photo)
router.post('/blogs/related',listRelated)
router.get('/blogs/search',listSearch)


// auth user blog crud

router.post('/user/blog',requireSignin,authMiddleware,create);
router.delete('user/blog/:slug',requireSignin,authMiddleware,canUpdateDeleteBlog,remove); // blog list all show
router.put('/user/blog/:slug',requireSignin,authMiddleware,canUpdateDeleteBlog,update); // blog list all show
router.get('/username/blogs',listByUser); // blog list all show


module.exports=router;

  const Blog = require('../models/blog')
const Category = require('../models/category')
const Tag = require('../models/tag')
const User = require('../models/user')
const formidable = require('formidable') // geri bildirim içinde bulunan parametreler kullanılarak dosya okuma yapılır.
const slugify = require('slugify')
const stripHtml = require('string-strip-html')
const _ =require('lodash')
const {errorHandler} = require('../helpers/dbErrorHandler');
const fs =require('fs') // dosya okuma                         // fs.readFile(path [,options], callback); options= utf-8
const {smartTrim} = require('../helpers/blog') // - space ... characters function
//  image upload
exports.create=(req,res) =>{
    var form = new formidable.IncomingForm()
    form.keepExtensions=true;

    form.parse(req , (err,fields,files) =>{
        if(err){
            return res.status(400).json({
                error:'Image could not upload'
            })
        }

        const {title,body,categories,tags}=fields

        if(!body || !body.length){
            return res.status(400).json({
                error:'content is required'
            })
        }

        if(!title || !title.length){
            return res.status(400).json({
                error:'title is required'
            })
        }

        if(!categories || !categories.length===0){
            return res.status(400).json({
                error:'at least  one category is required'
            })
        }


        if(!tags || !tags.length===0){
            return res.status(400).json({
                error:'at least  one tag is required'
            })
        }


        let blog = new Blog()
        blog.title=title
        blog.body=body
        blog.excerpt=smartTrim(body,300,' ','...')
        blog.slug=slugify(title).toLowerCase()
        blog.mtitle= `${title} | ${process.env.APP_NAME}`
        blog.mdesc=stripHtml(body.substring(0,81))  // 0 ile 81 indeksi bize verir. substring !
        blog.postedBy=req.user._id


        // categories and tag

        let arrayOfCategories = categories && categories.split(',')
        let arrayOfTags = tags && tags.split(',')

        if(files.photo){
            if(files.photo.size>10000000){
                    return res.status(400).json({
                        error:'Image should be less then 1mb in size'
                    })
                }
                blog.photo.data=fs.readFileSync(files.photo.path)
                blog.photo.contentType=files.photo.type
        }

        blog.save((err,result) =>{
            if(err){
                return res.status(400).json({
                    error:errorHandler(err)
                })
            }
            Blog.findByIdAndUpdate(result._id,{$push:{categories:arrayOfCategories}},{new:true}).exec((err,result) =>{
            })
            if(err){
                return res.status(400).json({
                    err:errorHandler(err)
                })
            }else{
                Blog.findByIdAndUpdate(result._id,{$push:{tags:arrayOfTags}},{new:true}).exec((err,result) =>{
                    if(err){
                        return res.status(400).json({
                            err:errorHandler(err)
                        })
                    }else {
                        res.json(result)
                    }
                })
            }
            // res.json(result)

        })
    })
};

//       !!!!    list,listAllCategoriesTags,read,remove,update      !!!!!     /////
// ** bloglarımızı listeliyoruz
exports.list = (req,res) =>{
    Blog.find({})
    .populate('categories','_id name slug')
    .populate('tags','_id name slug')
    .populate('postedBy','_id name username')
    .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
    .exec((err,data) =>{
        if(err){
            return res.json({
                error:errorHandler(err)
            })
        }res.json(data)
           // blogs:data // data.blogs.blogs

    })
}
exports.listAllCategoriesTags = (req,res) =>{

    let limit = req.body.limit ? parseInt(req.body.limit): 10
    let skip  = req.body.skip  ? parseInt(req.body.skip) : 0

    let blogs;
    let categories;
    let tags;

    Blog.find({})
    .populate('categories','_id name slug')
    .populate('tags','_id name slug')
    .populate('postedBy','_id name username profile')
    .sort({createdAt:-1}) // alfabetik sıralama
    .skip(skip)
    .limit(limit)
    .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
    .exec ((err,data) =>{
        if(err){
             return res.json({
                 error:errorHandler(err)
             })
        }
        blogs=data // blogs
        // get all categories
        Category.find({}).exec((err, c) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            categories = c; // categories
            // get all tags
            Tag.find({}).exec((err, t) => {
                if (err) {
                    return res.json({
                        error: errorHandler(err)
                    });
                }
                tags = t;
                // return all blogs categories tags
                res.json({ blogs, categories, tags, size: blogs.length });
            });
        });
    });
};
exports.read = (req,res) =>{
    const slug = req.params.slug.toLowerCase()
    Blog.findOne({slug})
    // .select('-photo')
    .populate('categories','_id name slug')
    .populate('tags','_id name slug')
    .populate('postedBy','_id name username')
    .select('_id title body slug mtitle mdesc categories tags postedBy createdAt updatedAt')
    .exec((err,data) =>{
        if(err){
            return res.json({
                error:errorHandler(err)
            })
        }
        res.json(data)
    })
}
exports.remove = (req,res) =>{
    const slug = req.params.slug.toLowerCase();

    Blog.findOneAndRemove({slug})
    .exec((err,data) =>{
        if(err){
            return res.json({
                error:errorHandler(err)
            });
        }
        res.json({
            message:'Blog deleted successfuly'
        })
    })

}

// UPDATE !! //
// UPDATE !! //
// UPDATE !! //
// UPDATE !! //
// UPDATE !! //


exports.update=(req,res) =>{
    const slug = req.params.slug.toLowerCase();

    Blog.findOne({slug}).exec((err,oldBlog) =>{
        if(err){
            return res.status(400).json({
                error:errorHandler(err)
            })
        }

        var form = new formidable.IncomingForm()
        form.keepExtensions=true;

        form.parse(req , (err,fields,files) =>{
            if(err){
                return res.status(400).json({
                    error:'Image could not upload'
                })
            }


        // let // s
        // s-about-react

        let slugBeforeMerge = oldBlog.slug
        oldBlog= _.merge(oldBlog,fields)
        oldBlog.slug=slugBeforeMerge

        const {body,desc,categories,tags} =  fields


            // const {title,body,categories,tags}=fields

            if(body){
                oldBlog.excerpt=smartTrim(body,160,'','...')
                oldBlog.desc=stripHtml(body.substring(0,160))
            }

            if(categories){
                oldBlog.categories=categories.split(',')
            }

            if(tags){
                oldBlog.Tag=tags.split(',')
            }


            // categories and tag

            let arrayOfCategories = categories && categories.split(',')
            let arrayOfTags = tags && tags.split(',')

            if(files.photo){
                if(files.photo.size>10000000){
                        return res.status(400).json({
                            error:'Image should be less then 1mb in size'
                        })
                    }
                    oldBlog.photo.data=fs.readFileSync(files.photo.path)
                    oldBlog.photo.contentType=files.photo.type
            }

            oldBlog.save((err,result) =>{
                if(err){
                    return res.status(400).json({
                        error:errorHandler(err)
                    })
                }
                // result.photo=undefined
                res.json(result)
                // res.json(result)

            })
        })
});
}
// BLOG SHOW PHOTO
// BLOG SHOW PHOTO
// BLOG SHOW PHOTO
// BLOG SHOW PHOTO
// BLOG SHOW PHOTO
// BLOG SHOW PHOTO

exports.photo = (req,res) =>{
    const slug =req.params.slug.toLowerCase()
    Blog.findOne({slug})
    .select('photo')
    .exec((err,blog) =>{
        if(err || !blog){
            return res.status(400).json({
                error:errorHandler(err)
            })
        }
        res.set('Content-type',blog.photo.contentType)
        return res.send(blog.photo.data)
    })
};

exports.listRelated = (req,res) =>{
    let limit = req.body.limit ? parseInt(req.body.limit):3;
    const {_id, categories} = req.body.blog

    Blog.find({_id:{$ne: _id},categories:{$in: categories} })
    .limit(limit)
    .populate('postedBy','_id name username profile')
    .select('title slug excerpt postedBy createdAt updateAt')
    .exec((err,blogs)=>{
        if(err){
            return res.status(400).json({
                error:'Blogs not found'
            })
        }
        res.json(blogs)
    })
}



// SEARCH  SECTION,

exports.listSearch = (req,res) =>{
    console.log(req.query);
    const {search} = req.query
    if(search){
        Blog.find({
            $or:[{title:{$regex:search,$options:'i'}}, {body:{$regex:search,$options:'i'}}]
        },(err,blogs)=>{
            if(err){
            return res.status(400).json({
                error:errorHandler(err)
            })
        }
        res.json(blogs)
        }).select('-photo -body');
    }
}


//  WE BRING USERS
exports.listByUser = (req,res) =>{
  User.findOne({username:req.params.username}).exec((err,user) =>{
    if(err){
      return res.status(400).json({
        error:errorHandler(err)
      });
    }

    let userID=user._id
    Blog.find({postedBy:userID})
      .populate('categories','_id name slug')
      .populate('tags','_id name slug')
      .populate('postedBy','_id name username')
      .select('_id title slug excerpt createdAt updateAt')
      .exec((err,data) =>{
        if(err){
          return res.status(400).json({
            error:errorHandler(err)
          });
        }
        res.json(data)
      })
  })
}

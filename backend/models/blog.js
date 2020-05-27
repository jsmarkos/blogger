const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: true,
            max: 81,
            min:3,
            index: true,
        },
        slug: {
            type: String,
            unique: true,
            index: true
        },
        body: {
            type: {},
            required: true,
            max: 2000000,
            min:200,
        },
        excerpt: {
            type: String,
            max: 1000
        },
        mtitle: {
            type: String,
        },
        mdesc: {
            type: String,
        },
        
        role: {
            type: Number,
            default: 0
        },
        photo: {
            data: Buffer,
            contentType: String
        },
        categories:[{type:ObjectId,ref:'Category',required:true}],
        tags:[{type:ObjectId,ref:'Tag',required:true}],
        postedBy:{
            type:ObjectId,
            ref:'User'
        }
    },
    { timestamps: true }
);



module.exports = mongoose.model('Blog', blogSchema);
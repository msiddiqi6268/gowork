import mongoose from "mongoose"
import slugify from "slugify"
const BlogSchema = new mongoose.Schema({
    slug: String,
    title: {
        type: String,
        required: [true, "Please provide a title"],
        unique: true,
        minlength: [4, "Please provide a title least 4 characters "],
    },
    content: {
        type: String,
        required: [true, "Please a provide a content "],
        minlength: [10, "Please provide a content least 10 characters "],
    },
    readtime: {
        type: Number,
        default: 3
    },
}, { timestamps: true })


BlogSchema.pre("remove", async function (next) {

    const story= await Blog.findById(this._id)

})

BlogSchema.methods.makeSlug = function () {
    return slugify(this.title, {
        replacement: '-',
        remove: /[*+~.()'"!:@/?]/g,
        lower: true,
        strict: false,
        locale: 'tr',
        trim: true
    })

}

const Blog = mongoose.model("Blog", BlogSchema)

export default Blog
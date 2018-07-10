const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => console.error('Could not connect to MongoDB: ' + err))

const courseSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    category:{
        type: String,
        required: true,
        enum: ['web', 'mobile', 'server'],
        lowercase: true,
        trim: true
    },
    author: String,
    tags: {
        type: Array,
        validate: {
            //custom async validator
            isAsync: true,
            validator: function(value, callback){
                setTimeout(() => {
                    const result = value && value.length > 0
                    callback(result)
                }, 2000);
            },
            message: 'A course should have at least one tag.'
        }
    },
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: {
        type: Number,
        required: function() { return this.isPublished },
        min: 10,
        max: 200,
        get: value => Math.round(value),
        set: value => Math.round(value)
    }
})

const Course = mongoose.model('Course', courseSchema) //Course is a class

async function createCourse(){
    const course = new Course({
        name: 'Swift course',
        category: 'Mobile',
        author: 'Brian',
        tags: ['iOS'],
        isPublished: true,
        price: 15.8
    })
    
    try {
        //await course.validate()
        const result = await course.save()
        console.log(result)  
    }catch (ex){
        for (field in ex.errors){
            console.log(ex.errors[field].message)
        }
    } 
}

//createCourse()

async function getCourse(){
    //eq (equal)
    //ne (not equal)
    //gt (greater than)
    //gte (greater than or equal to)
    //lt (less than)
    //lte (less than or eqaul to)
    //in
    //nin (not in)

    const pageNumber = 2
    const pageSize = 10

    const courses = await Course
        .find({ _id: '5b399b5dd82e49682949150e' })
        // .find({ price: { $gt: 10, $lt: 20 } })  // 10 < price < 20
        // .find({ price: { $in: [10, 15, 20] } }) // price = 10 or 15 or 20
        // .find()
        // .or([ { author: 'Mosh'}, {isPublished: true} ])
        // .and([ { author: 'Mosh'}, {isPublished: true} ])
        // .find({ author: /^Mosh/ }) //author starts with Mosh (ex. Moshaaaaaaa)
        // .find({ author: /Mosh$/i}) //author ends with Mosh
        // .find({ author: /.*Mosh.*/i}) //author contains Mosh
        //.limit(10)
        // .skip( (pageNumber -1) * pageSize )
        // .limit(pageSize)
        .sort({ name: 1})  //1 indicates ascending order; -1 indicates descending order
        .select({ name: 1, tags: 1, price: 1})
        //.count()
    console.log(courses[0].price)
}

async function updateCourse(id) {

    const course = await Course.findByIdAndUpdate(id, {
        $set: {
            author: 'Voong',
            isPublished: false
        }
    }, { new: true })
    
    console.log(course)

    // const result = await Course.update({ _id: id}, {
    //     $set: {
    //         author: 'Brian',
    //         isPublished: true
    //     }
    // })
    // console.log(result)

    // const course = await Course.findById(id)
    // if (!course) { return }
    // course.author = 'Another Author'
    // course.isPublished = false

    // const result = await course.save()
    // console.log(result)
}

//updateCourse('5b35a3b13993ec360bc2745c')

async function removeCourse(id) {

    const course = await Course.findByIdAndRemove(id)
    console.log(course)
    // const result = await Course.deleteOne({ _id: id})
    // console.log(result)
}

// removeCourse('5b35a3b13993ec360bc2745c')
//createCourse()
getCourse()
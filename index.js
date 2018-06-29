const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => console.error('Could not connect to MongoDB: ' + err))

const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [String],
    date: { type: Date, default: Date.now },
    isPublished: Boolean
})

const Course = mongoose.model('Course', courseSchema) //Course is a class

async function createCourse(){
    const nodeCourse = new Course({
        name: 'Swift course',
        author: 'Mosh',
        tags: ['Swift', 'iOS', 'Mobile'],
        isPublished: true
    })
    
    //nodeCourse.save() return a promise
    const result = await nodeCourse.save()
    console.log(result) 
}

//createCourse()

async function getCourse(){
    const courses = await Course
        .find({ author: 'Mosh', isPublished: true})
        .limit(10)
        .sort({ name: 1})  //1 indicates ascending order; -1 indicates descending order
        .select({ name: 1, tags: 1})
    console.log(courses)
}

getCourse()
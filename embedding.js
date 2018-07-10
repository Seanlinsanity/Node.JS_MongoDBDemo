const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String
});

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  authors: {
    type: [authorSchema]
  }
}));

async function createCourse(name, authors) {
  const course = new Course({
    name, 
    authors
  }); 
  
  const result = await course.save();
  console.log(result);
}

async function listCourses() { 
  const courses = await Course.find();
  console.log(courses);
}

async function updateAuthor(courseId) {
  const course = await Course.update({ _id: courseId }, {
    $unset: {
      'author' : ''
    }
  })
}

async function addAuthor(courseId, author){
  const course = await Course.findById(courseId)
  course.authors.push(author)
  course.save()
}

async function removeAuthor(courseId, authorId){
  const course = await Course.findById(courseId)
  const author = course.authors.id(authorId)
  author.remove()
  course.save()
}

// createCourse('Node Course', [ 
//     new Author({ name: 'Klay' }),
//     new Author({ name: 'Sean' })
// ]);

// updateAuthor('5b441ca7eb4b199d1c5b50b8')

// addAuthor('5b441f8bd77f309da2490cb3', new Author({ name: 'Curry' }) )
removeAuthor('5b441f8bd77f309da2490cb3', '5b441f8bd77f309da2490cb2')
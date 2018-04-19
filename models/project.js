let mongoose = require('mongoose');

let AudioSchema = new mongoose.Schema();
AudioSchema.add({
  title:      String,
  filename:   String,
  parentId:   String
});

let NoteSchema = new mongoose.Schema();
NoteSchema.add({
  title:      String,
  content:    String,
  parentId:   String
});

let ImageSchema = new mongoose.Schema();
ImageSchema.add({
  title:      String,
  filename:   String,
  parentId:   String
});

let SongSchema = new mongoose.Schema();
SongSchema.add({
  title           : String,
  description     : String,
  lyrics          : String,
  audio           : [AudioSchema],
  notes           : [NoteSchema],
  images          : [ImageSchema],
  parentId        : String,
  idDeleted       : Boolean
});


let ProjectSchema = new mongoose.Schema();
ProjectSchema.add({

  name            : String,
  isDeleted       : Boolean

});

// ProjectSchema.plugin(tree);

// ProjectSchema.add({ subProjects: [ProjectSchema] });

let Audio = mongoose.model('Audio', AudioSchema);
let Note = mongoose.model('Note', NoteSchema);
let Image = mongoose.model('Image', ImageSchema);
let Song = mongoose.model('Song', SongSchema);
let Project = mongoose.model('Project', ProjectSchema);

mongoose.connect('mongodb://admin:audio2018ed@localhost/audiodb');

// otmarDB_adm2018
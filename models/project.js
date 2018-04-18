let mongoose = require('mongoose');

let NoteSchema = new mongoose.Schema();
NoteSchema.add({
  title:      String,
  content:    String,
  parentId:   String
});

let SongSchema = new mongoose.Schema();
SongSchema.add({
  title           : String,
  description     : String,
  lyrics          : String,
  tracks          : [String],
  notes           : [NoteSchema],
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

let Note = mongoose.model('Note', NoteSchema);
let Song = mongoose.model('Song', SongSchema);
let Project = mongoose.model('Project', ProjectSchema);

mongoose.connect('mongodb://admin:audio2018ed@localhost/audiodb');

// otmarDB_adm2018
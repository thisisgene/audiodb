var mongoose = require('mongoose');

var SongSchema = new mongoose.Schema();
SongSchema.add({
  title           : String,
  description     : String,
  parentId        : String,
  idDeleted       : Boolean
});


var ProjectSchema = new mongoose.Schema();
ProjectSchema.add({

  name            : String,
  isDeleted       : Boolean

});

// ProjectSchema.plugin(tree);

// ProjectSchema.add({ subProjects: [ProjectSchema] });

var Song = mongoose.model('Song', SongSchema);
var Project = mongoose.model('Project', ProjectSchema);

mongoose.connect('mongodb://admin:audio2018ed@localhost/audiodb');

// otmarDB_adm2018
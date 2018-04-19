const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });
const mongoose = require( 'mongoose' );
const Note= mongoose.model( 'Note' );
const Song = mongoose.model( 'Song' );
const Project  = mongoose.model( 'Project' );

async function fetchProjects(query) {
  return await Project.find(query);
}

/* GET home page. */
router.get('/', async function(req, res, next) {
  let projects = await fetchProjects({});
  res.render('index', {
    title: 'Eugene Delta Audio DB',
    projects: projects
  });
});

/////////////////////////////////////////////////////////////// PROJECTS

router.post('/create_project', function(req, res) {
  let name = req.body.name;
  let project = new Project({
    name: name
  });
  project.save(function(err){
    if (!err) {
      res.send('success');
    }
  })
});


router.get('/p/*/:id', async function(req, res) {
  let id = req.params.id;
  let projects = await fetchProjects({});
  let currentProject = await Project.findById(id);
  let songs = await Song.find({parentId: id});

  res.render('project', {
    projects: projects,
    currentProject: currentProject,
    songs: songs
  });

});

router.get('/delete_project/:id', async function(req, res) {
  let project = await Project.findById(req.params.id);
  project.isDeleted = true;
  project.save(function(err) {
    if (!err) {
      res.redirect('/');
    }
  })
});

/////////////////////////////////////////////////////////////// SONG VIEW

router.post('/create_song', function(req, res) {
  let body = req.body;
  let parentId = body.parentId;
  let title = body.title;

  let song = new Song({
    title: title,
    parentId: parentId
  });
  song.save(function(err) {
    if (!err) {
      res.send('success');
    }
  })
});

router.get('/s/*/:id', async function(req, res) {
  let id = req.params.id;
  let projects = await fetchProjects({});
  let currentSong = await Song.findById(id);
  let parentId = currentSong.parentId;
  let parent = await Project.findById(parentId);
  let songs = await Song.find({parentId: parentId});
  let notes = await Note.find({parentId: id});
  console.log(parentId);
  res.render('song', {
    projects: projects,
    currentSong: currentSong,
    parent: parent,
    songs: songs,
    notes: notes
  });

});

/////////////////////////////////////////////////////////////// FILE UPLOAD

router.post('/file_upload', upload.single('file'), async function(req, res) {
  let file = req.file;
  let mimetype = file.mimetype;
  mimetype = mimetype.substring(0, mimetype.indexOf('/'));
  console.log(mimetype);

  switch(mimetype) {
    case 'text':
      res.send('text');
      break;
    case 'audio':
      res.send('audio');
      break;
    case 'image':
      res.send('image');
      break;
    default:
      res.send('Not like that!');
  }
});

/////////////////////////////////////////////////////////////// LYRICS

router.post('/save_text', async function(req, res) {
  let body = req.body;
  let song = await Song.findById(body.songid);
  let type = body.type;
  switch (type) {
    case 'lyrics':
      song.lyrics = body.text;
      song.save(function(err) {
        if (!err) {
          res.send('success');
        }
      });
      break;
    case 'notes':
      let note = await Note.findById(body.noteId);
      note.content = body.text;
      note.save(function(err){
        if (!err) {
          res.send('success');
        }
      });
      break;
  }

});


/////////////////////////////////////////////////////////////// AUDIO TRACKS

router.post('/add_track', async function(req, res) {
  let body = req.body;
  let id = body.id;
  let track = body.track;
  let song = await Song.findById(id);

  if (!song.tracks) song.tracks = {};
  song.tracks.push(track);
  song.save(function(err) {
    if (!err) {
      res.send('success');
    }
  })
});

router.get('/remove_track/:id/:track', async function(req, res) {
  let params = req.params;
  let id = params.id;
  let trackToDelete = params.track;
  let song = await Song.findOne({tracks: trackToDelete});
  let tracks = await song.tracks;
  console.log(song.tracks);
  if (song) {
    for (let track of tracks) {
      if (track == trackToDelete) {
        song.tracks.pull(track);
        song.save(function(err) {
          if (!err) {
            res.send('success');
          }
        })
      }
    }
  }
});

////////////////////////////////////////////////////////////// NOTES


async function noteExists(song, title) {
  let notes = song.notes;
  for (let note of notes) {

    if (note.title == title) {
      return true;
    }
  }
  return(false);
}

router.post('/new_note', async function(req, res) {
  let body = req.body;
  let id = body.id;
  let title = body.title;


  let note = new Note ({
    title:  title,
    parentId: id
  });
  note.save(function(err){
    if (!err) {
      res.send('success');
    }
  })
});

router.get('/change_tab/:id', async function(req, res) {
  let note = await Note.findById(req.params.id);
  res.send(note.content);
});

module.exports = router;

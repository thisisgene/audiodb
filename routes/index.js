const express = require('express');
const router = express.Router();
const mongoose = require( 'mongoose' );
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
  console.log(currentSong.parentId);
  let parent = await Project.findById(currentSong.parentId);
  let songs = await Song.find({parentId: currentSong.parentId});
  console.log(parent);
  res.render('song', {
    projects: projects,
    currentSong: currentSong,
    parent: parent,
    songs: songs
  });

});


router.post('/save_lyrics', async function(req, res) {
  let body = req.body;
  let song = await Song.findById(body.songid);
  song.lyrics = body.text;
  song.save(function(err) {
    if (!err) {
      res.send('success');
    }
  })
});

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

module.exports = router;

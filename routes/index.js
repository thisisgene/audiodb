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

module.exports = router;

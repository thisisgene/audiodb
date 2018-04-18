let delay = (function(){
  let timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

function saveTextWhileTyping(e, type, note = '') {
  delay(function(){
    let $this = $(e.target);
    let songid = $('#song-container').data('songid');
    let $parent = $this.parent();
    let text = $this.val();
    let body = {
      songid: songid,
      text: text,
      type: type,
      noteId: note
    };
    console.log(text);
    $parent.addClass('is-loading');
    $.post('/save_text', body, function(msg) {
      if (msg=="success") {
        $parent.removeClass('is-loading');
        $this.addClass('is-success');
        delay(function() {
          $this.removeClass('is-success');
        }, 1000)
      }
    })
  }, 1000 );
}

$('#lyrics').on('keyup', function(e) {
  saveTextWhileTyping(e, 'lyrics');

});
$('#note-content').on('keyup', function(e) {
  let note = $(e.target).data('thisnote');
  saveTextWhileTyping(e, 'notes', note);

});

$('.note-link').on('click', function(e) {
  let $link = $(e.target);
  let $li = $link.parent();
  let id = $link.data('noteid');
  let $content = $('#note-content');
  $.get('/change_tab/'+id, function(content){
    console.log(content);
    $content.val(content);
    $content.data('thisnote', id);
    console.log($content.data('thisnote'));
    $li.siblings('.is-active').removeClass('is-active');
    $li.addClass('is-active');
  });
});

function closeModal() {
  $('.modal').removeClass('is-active');
}

function createProject() {
  let name = $('#name-input').val();
  if (name!='') {
    $.post('/create_project', {name: name}, function(msg) {
      if (msg=='success') {
        console.log(msg);
      }
    });
  }
}

function createSong(obj) {
  let title = $('#name-input').val();
  let parentId = $(obj).data('parentid');
  let body = {
    title: title,
    parentId: parentId
  };
  $.post('/create_song', body, function(msg) {
    if (msg=='success') {
      console.log(msg);
    }
  })
}

function addTrack() {
  let track = $('#audio-input').val();
  if (track != '') {
    let id = $('#song-container').data('songid');
    let body = {
      track: track,
      id: id
    };
    $.post('/add_track', body, function(msg) {
      if (msg=='success') {
        location.reload()
      }
    });
  }
}

function deleteTrack(track) {
  console.log(track);
  let id = $('#song-container').data('songid');
  $.get('/remove_track/' +id + '/' + track, function(msg) {
    if (msg=='success') {
      location.reload()
    }
  })
}

function addNote() {
  $('#new-note-msg').addClass('is-active');
  $('#note-title').focus();
}

function saveNote() {
  let title = $('#note-title').val();
  let id = $('#song-container').data('songid');
  if (title != '') {
    console.log(title);
    let body = {
      id: id,
      title: title
    };
    $.post('/new_note', body, function(msg) {
      console.log(msg);
      if (msg='success') {
        location.reload();
      }
    })
  }
}
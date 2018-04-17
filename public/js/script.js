let delay = (function(){
  let timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

$(document).ready(function() {

});

$('#lyrics').on('keyup', function(e) {
  delay(function(){
    let $this = $(e.target);
    let songid = $('#song-container').data('songid');
    let $parent = $this.parent();
    let text = $this.val();
    let body = {
      songid: songid,
      text: text
    };
    $parent.addClass('is-loading');
    $.post('/save_lyrics', body, function(msg) {
      if (msg=="success") {
        $parent.removeClass('is-loading');
        $this.addClass('is-success');
        delay(function() {
          $this.removeClass('is-success');
        }, 1000)
      }
    })
  }, 1000 );
});

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

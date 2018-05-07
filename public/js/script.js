//////////////////////// Dropzone

// $(document).ready(function() {
//   $('body').dropzone({ // Make the whole body a dropzone
//     url: "/file_upload", // Set the url
//     previewsContainer: "#previews", // Define the container to display the previews
//   });
// });

let dropZone = document.getElementById('dropzone');

Dropzone.options.dropzone = {

  maxFilesize: 10
};

function showDropZone() {
  dropZone.style.display = "block";
}
function hideDropZone() {
  dropZone.style.display = "none";
}

function allowDrag(e) {
  if (true) {  // Test that the item being dragged is a valid one
    e.dataTransfer.dropEffect = 'copy';
    e.preventDefault();
  }
}

function handleDrop(e) {
  e.preventDefault();
  // hideDropZone();

  // alert('Drop!');

}

// 1
window.addEventListener('dragenter', function(e) {
  showDropZone();
});

// 2
dropZone.addEventListener('dragenter', allowDrag);
dropZone.addEventListener('dragover', allowDrag);

// 3
dropZone.addEventListener('dragleave', function(e) {
  hideDropZone();
});

// 4
dropZone.addEventListener('drop', handleDrop);

/////////////////////// Delay

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
    $content.val(content);
    $content.data('thisnote', id);
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
    let body = {
      id: id,
      title: title
    };
    $.post('/new_note', body, function(msg) {
      if (msg='success') {
        location.reload();
      }
    })
  }
}
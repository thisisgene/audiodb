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
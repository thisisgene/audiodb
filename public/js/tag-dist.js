$("#note-content").mention({
  // emptyQuery: true,
  // typeaheadOpts: {
  //   items: 10 // Max number of items you want to show
  // },
  delimiter: '#',
  queryBy: ['name', 'username'],
  users: [{
    username: "bass",
    name: "Bass"
  }, {
    username: "drums",
    name: "Drums"
  }, {
    username: "vocals",
    name: "Vocals"
  }, {
    username: "synth",
    name: "Synthesizer"
  }, {
    username: "violin",
    name: "Violin"
  }]
});
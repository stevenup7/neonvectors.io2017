new Vue({
  el: '#blog-tags',
  data: {
    tags: {}
  },
  created: function () {
    fetch ('/blog/tags.json').then(
      (response) => {
        response.json().then( (data) => {
          console.log(data);
          this.tags = data;
        });
      });
  }
});

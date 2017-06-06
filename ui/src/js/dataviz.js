new Vue({
  el: '#vc',
  data: {
    pageData: pageData,
    counter: 0
  },
  created: function () {
    console.log(this.counter);
  },
  methods: {
    goNextPage: function () {
      console.log(pageData);
    }
  }
});

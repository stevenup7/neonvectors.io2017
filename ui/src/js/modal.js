console.log('bus created');

var bus = new Vue();

var modal = new Vue ({
  el: '#message-modal',
  data: {
    message: "test"
  },
  created: function () {
    bus.$on('showMessage', (data) => {
      this.$el.classList.add('is-active');
      this.message = data.message;
    });
  },
  methods: {
    hide: function () {
      this.$el.classList.remove('is-active');
    }
  }
});

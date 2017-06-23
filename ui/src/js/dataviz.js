function loadPage (src) {
  return fetch (src).then(
    (response) => {
      return response.text().then( (data) => {
        return data;
      });
    });
}

function loadJSON (src) {
  return fetch (src).then(
    (response) => {
      return response.json().then( (data) => {
        return data;
      });
    });
}


function removeTempScripts() {
  var elements = document.getElementsByClassName('temp-script');
  while(elements.length > 0){
    elements[0].parentNode.removeChild(elements[0]);
  }
}

function addTempScript( src ) {
  var s = document.createElement( 'script' );
  s.setAttribute( 'src', src );
  s.setAttribute( 'class', 'temp-script');
  document.body.appendChild( s );
}


// register
Vue.component('src-view', {
  props: ['src'],
  data: function () {
    return {
      srcStr: 'TODO: // I am a vue component'
    };
  },
  template: `
    <pre class="" v-html='srcStr'></pre>
  `,
  watch: {
    src : function () {
      this.loadSrc();
    }
  },
  methods: {
    loadSrc: function () {
      loadPage(this.src).then ((src) => {
        this.srcStr = src;
        // remove the prettyprinted class so it redoes the formatting
        this.$el.classList.remove('prettyprinted');
        this.$el.classList.add('prettyprint');
        // let the binding happen
        setTimeout(function () {
          PR.prettyPrint();
        }, 0);
      });
    }
  }
});


new Vue({
  el: '#vc',
  template: `
  <section id="viz-page-container" class="top-padded">
    <div id="loadedSrc" class="container" v-html="pageHTML">
    </div>

    <div class="container">
       <button id="goPrev" v-if="notFirstPage()" v-on:click="goPrevPage()">Previous Page {{currpage}}</button>
       <button id="goNext" v-if="notLastPage()" v-on:click="goNextPage()">Next Page {{currpage}}</button>
       <div>&nbsp;</div>
       {{srcFile}}
       <src-view v-bind:src='srcFile'></src-view>
    </div>
  </section>
  `,
  replace: false,
  data: {
    title: 'none',
    pageHTML: 'test',
    srcFile: null,
    currpage: 0
  },
  created: function () {
    this.title = pageData.pages[this.currpage].name;
    this.loadCurrPage();
  },

  methods: {
    loadCurrPage: function () {
      loadPage(pageData.id + '/' + pageData.pages[this.currpage].src).then((data) => {
        this.pageHTML = data;
        var tempScripts = document.getElementsByClassName('temp-script');
        removeTempScripts();
        addTempScript('/static/js/' + pageData.pages[this.currpage].scripts[0]);
        this.getSrc();
      });
    },
    getSrc: function () {
      this.srcFile =  '/static/js/' + pageData.pages[this.currpage].scripts[0];
    },
    notLastPage: function () {
      return this.currpage < pageData.pages.length - 1;
    },
    notFirstPage: function () {
      return this.currpage !== 0;
    },
    goNextPage: function () {
      this.currpage ++;
      this.loadCurrPage();
    },
    goPrevPage: function () {
      this.currpage --;
      this.loadCurrPage();
    }
  }
});

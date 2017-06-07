function loadPage (src) {
  return fetch (src).then(
    (response) => {
      return response.text().then( (data) => {
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

new Vue({
  el: '#vc',
  template: `
  <section id="viz-page-container" class="top-padded">
    <div id="loadedSrc" class="container" v-html="pageSrc">
    </div>

    <div class="container">
       <button id="goPrev" v-if="notFirstPage()" v-on:click="goPrevPage()">Previous Page {{currpage}}</button>
       <button id="goNext" v-if="notLastPage()" v-on:click="goNextPage()">Next Page {{currpage}}</button>
       <div>&nbsp;</div>
       <pre class="prettyprint">TODO: // make me a vue component</pre>
    </div>
  </section>
  `,
  replace: false,
  data: {
    title: 'none',
    pageSrc: 'test',
    currpage: 0
  },
  created: function () {
    this.title = pageData.pages[this.currpage].name;
    this.loadCurrPage();
  },

  methods: {
    loadCurrPage: function () {
      loadPage(pageData.id + '/' + pageData.pages[this.currpage].src).then((data) => {
        this.pageSrc = data;
        var tempScripts = document.getElementsByClassName('temp-script');
        removeTempScripts();
        addTempScript('/static/js/' + pageData.pages[this.currpage].scripts[0]);
      });
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

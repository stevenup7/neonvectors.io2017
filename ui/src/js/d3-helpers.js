
class D3VizHelper {

  constructor (wrapperEl, width, height, margins) {

    this.wrapperEl = wrapperEl;
    this.width = width;
    this.height = height;
    this.margins = margins;

    this.availableHeight = this.height - this.margins.top  - this.margins.bottom;
    this.availableWidth  = this.width  - this.margins.left - this.margins.right;
    /* **DEVBLOCK BEGIN ** */
    if (this.wrapperEl.indexOf('#') !== 0) {
      throw ('Wrapper element must be an id selector');
    }
    /* **DEVBLOCK END** */

    this.makeCanvasElement();

  }

  makeCanvasElement () {
    // if width is unset then use the width of the element
    if (typeof this.width === 'undefined' || this.width === 0) {
      this.width = document.getElementById(this.wrapperEl.replace('#', '')).offsetWidth;
    }

    this.canvas =  d3.select(this.wrapperEl).append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

  }

  addAxis () {

  }


  nvcolors10 () {
    var idx = 0;
    return function (i) {
      var pallet = [
        'F25EED',
        '77DEFD',
        '00BFB2',
        'DBD56E',
        'F06449',
        'DADAD9',
        '9EB25D',
        '6457A6',
        '5C2751',
        'DB5461'
      ];
      console.log(idx, i);
      if (typeof i === 'undefined') {
        i = idx % pallet.length;
      }
      idx ++;
      return pallet[i];
    };
  }
}



function get1SigFig (num) {
  var f = 1;
  var x;

  // there must be a better way to do this but I'm tired now
  while(f < num) {
    f = f * 10;
  }
  f = f / 10;

  x = Math.floor(num / f);

  //console.log(num, x, x * f);
  return x * f;

}

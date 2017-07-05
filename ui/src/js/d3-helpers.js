
class D3VizHelper {
  constructor (wrapperEl, width, height, margins) {
    this.wrapperEl = wrapperEl;
    this.width = width;
    this.height = height;
    this.margins = margins;
    this.scales = {};
    /* **DEVBLOCK BEGIN ** */
    if (this.wrapperEl.indexOf('#') !== 0) {
      throw ('Wrapper element must be an id selector');
    }
    /* **DEVBLOCK END** */
    this.makeCanvasElement();
    this.availableHeight = this.height - this.margins.top  - this.margins.bottom;
    this.availableWidth  = this.width  - this.margins.left - this.margins.right;

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

  setXScale (scale) {
    this.scales.x = scale;
  }

  setYScale (scale) {
    this.scales.y = scale;
  }

  addYAxis (axisName, scale) {
    if (scale) {
      this.scales.y = scale;
    }
    this.canvas.append('g')
      .attr("class", axisName)
      .attr("transform", "translate(" + this.margins.left + ", 0)")
      .call(d3.axisLeft(this.scales.y).tickSizeOuter(0));
  }

  addXAxis (axisName, scale) {
    this.canvas.append('g')
      .attr("class", axisName)
      .attr("transform", "translate(0, " + this.scales.y(0) + " )")
      .call(d3.axisBottom(scale));
  }

  nvcolors10 () {
    var idx = 0;
    return function (i) {
      var pallet = [
        '#F25EED',
        '#77DEFD',
        '#F06449',
        '#00BFB2',
        '#6457A6',
        '#DBD56E',
        '#DADAD9',
        '#9EB25D',
        '#5C2751',
        '#DB5461'
      ];
      if (typeof i === 'undefined') {
        i = idx % pallet.length;
      } else {
        i = i % pallet.length;
      }
      idx ++;
      return pallet[i];
    };
  }
}


class D3VizKey {
  constructor (wrapperEl) {
    /* **DEVBLOCK BEGIN ** */
    if (wrapperEl.indexOf('#') !== 0) {
      throw ('Wrapper element must be an id selector');
    }
    /* **DEVBLOCK END** */
    this.$el = document.getElementById(wrapperEl.replace('#', ''));
  }

  addLine (name, color, strokeWidth=1) {
    // todo: add some clever function for mouse over to hightlight if wanted
    var wrapper = document.createElement('div');
    wrapper.classList.add('key-row');
    var key = document.createElement('div');
    key.classList.add('key-line');
    key.style.cssText = 'border-bottom: ' + strokeWidth + 'px solid ' + color + '; width: 10px; height: 13px; float: left; margin-right: 5px;' ;
    var nameEl = document.createElement('span');
    nameEl.appendChild(document.createTextNode(' ' + name));
    wrapper.appendChild(key);
    wrapper.appendChild(nameEl);
    this.$el.appendChild(wrapper);
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

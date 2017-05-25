
class D3VizHelper {

  constructor (wrapperEl, width, height, margins) {

    this.wrapperEl = wrapperEl;
    this.width = width;
    this.height = height;
    this.margins = margins;

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

}

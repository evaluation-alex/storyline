import { Storyline } from './storyline'
import { lib } from './lib'
import { DataFactory } from './data'

var GUI = function() {
  //self.storyline = new Storyline()
  this.storyline = {elem: document.querySelector('#Storyline')}
  this.data = new DataFactory();
  this.config = {
    data: {
      url: undefined,
      data_column_name: undefined,
      datetime_format: undefined,
      datetime_column_name: undefined,
    },
    chart: {
      datetime_format: undefined,
      y_axis_label: undefined
    }
  }
}

GUI.prototype = {
  /**
   *
   *
   * @param {String} template name
   * @param {Object} columns
   * @returns {undefined}
   */
  createTemplate: function(template, columns) {
  var mustache = require('mustache');
  var columns  = columns ? columns : ''

  const MUSTACHE_TEMPLATES = {
        "urlBuilder":
          "<div class='data-nav'>" +
           "<input placeholder>" +
           "<button class='load-btn'>Load Data</button>" +
          "</div>",
        "columnBuilder":
          "<div class='flyout data-nav'>" +
           "<a href='#'>Columns</a>" +
           "<ul class='flyout-content data-nav stacked'>" +
            "{{#columns}}" +
             "<li>" +
              "<a href='#'>" +
               "{{ . }}" +
              "</a>" +
             "</li>" +
            "{{/columns}}" +
           "</ul>" +
          "</div>"
        }
  var rendered = mustache.render(MUSTACHE_TEMPLATES[template], {columns: columns}),
      parser = new DOMParser(),
      doc = parser.parseFromString(rendered, "text/html")

    return doc.body.children[0];
  },

  bindEvents: function(elem, handler) {
    var self = this;
    elem.onclick = function(){
      self.config.data.url = event.target.previousElementSibling.value
      self.callHandler(handler)
    }
  },

  callHandler: function(handler) {
    handler(this.config, this.data).then(function(dataObj) {
      //read headers//
      var tmpl = this.createTemplate('columnBuilder', dataObj.headers)
      this.appendTemplate('#Storyline', tmpl)
    }.bind(this))
  },

  appendTemplate: function(selector, template) {
    document.querySelector(selector).appendChild(template)
    var loader = document.querySelector('.load-btn')
    this.bindEvents(loader, this.data.fetchSheetData)
    return;
  }
}

module.exports = {
  GUI: GUI
}

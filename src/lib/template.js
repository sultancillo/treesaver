treesaver = treesaver || {};
treesaver.template = treesaver.template || {};


require('./dom');



  /**
   * @param {!Element} container
   * @param {!string} template
   * @param {!Object} view
   * @param {Object=} partials
   * @param {function(!string)=} send_fun
   */
  treesaver.template.expand = function (container, template, view, partials, send_fun) {
    container.innerHTML = Mustache.to_html(template, view, partials, send_fun);

    treesaver.dom.querySelectorAll('img[data-src], iframe[data-src], video[data-src]', container).forEach(function(e) {
      e.setAttribute('src', e.getAttribute('data-src'));
    });
    treesaver.dom.querySelectorAll('a[data-href]', container).forEach(function(e) {
      e.setAttribute('href', e.getAttribute('data-href'));
    });
  };


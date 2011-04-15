
//
//
//
//
// @version 0.00


if( typeof jQuery == "undefined" ) {
  alert("This script require jQuery Framework. Please load it.");
  return false;
}
if( typeof head == "undefined" ) {
  alert("This script require head.js Framework. Please load it.");
  return false;
}

var debug = false;
var loaded_packes_overall = [];

function Widget(packages, callback) {
  this.libpath = libpath;

  this.bind("load", callback);
  this.load(packages);
}

Widget.load = function(packages, callback) {
  return new Widget(packages, callback);
}

Widget.prototype = {
  libpath: null,
  loaded_packes: loaded_packes_overall,
  JsPackage: null,
  readyJsPackage: 0,
  packages: {
    // Basic Packages
    // javascripts
    'oauth' : {
      javascripts : ['oauth']
    },
    'jplayer' : {
      javascripts : ['jplayer']
    },
    'progressbar_js' : {
      javascripts : ['aupeo.progressbar']
    },
    'menu_js' : {
      stylesheets : ['aupeo.navigation']
    },
    // stylesheets
    'aupeo.grid' : {
      stylesheets : ['aupeo.grid']
    },
    'grid_development' : {
      stylesheets : ['grid_development']
    },
    'progressbar_css' : {
      stylesheets : ['aupeo.progressbar']
    },
    'header_css' : {
      stylesheets : ['aupeo.header']
    },
    'menu_css' : {
      stylesheets : ['aupeo.navigation']
    },

    // Custom Packages
    'aupeo.tables' : {
      stylesheets: ['aupeo.grid', 'aupeo.tables'],
      javascripts: ['jquery.scrollTo-min', 'aupeo.slideshow', 'aupeo.tables']
    },
    'aupeo.content' : {
      stylesheets: ['aupeo.content']
    },
    'header' : {
      stylesheets: ['aupeo.grid', 'aupeo.header']
    },
    'progressBar' : {
      dependencies: [],
      stylesheets: ['aupeo.grid', 'aupeo.progressbar'],
      javascripts: ['aupeo.progressbar']
    },
    'navigation' : {
      dependencies: [],
      stylesheets: ['aupeo.grid', 'aupeo.navigation'],
      javascripts: ['aupeo.navigation']
    },
    'footer' : {
      stylesheets: ['aupeo.grid', 'aupeo.footer']
    },
    'slideshow' : {
      dependencies: [],
      stylesheets: ['aupeo.grid', 'aupeo.slideshow'],
      javascripts: ['jquery.scrollTo-min', 'aupeo.slideshow']
    },
    'buttons' : {
      dependencies: [],
      stylesheets: ['aupeo.grid', 'aupeo.buttons'],
      javascripts: ['jquery.prettyCheckboxes', 'aupeo.buttons']
    },
    'text' : {
      dependencies: [],
      stylesheets: ['aupeo.grid', 'aupeo.text']
    },
    'aupeo.popup' : {
      dependencies: [],
      stylesheets: ['aupeo.grid', 'aupeo.popup'],
      javascripts: ['aupeo.popup']
    }
  },

  verifyConfiguration: function() {
    if( !this.libpath ) {
      this.error("Please specify a path to the library!");
      return false;
    }
  },

  load: function(array, trigger) {
    var self = this;

    this.verifyConfiguration();

    $(array).each(function(key, value) {
      var _package = self.packages[value];
      if(_package == undefined) {
        self.error("Undefined package.");
        return false;
      };

      self._load_package(_package);
    });
  },

  _load_package: function(_package) {
    var self = this;
    var allReadyLoaded = false;
    var dependencies = _package['dependencies'];
    var stylesheets = _package['stylesheets'];
    var javascripts = _package['javascripts'];
    if(javascripts) {
      self.JsPackage = _package['javascripts'].length;
    }

    if(dependencies) {
      this.debug("Loading dependencies");
      self.load(dependencies, false);
    }

    if(javascripts) {
      $(javascripts).each(function(index, value) {
        $(self.loaded_packes).each(function(index, valuePackages) {
          if (self.loaded_packes[index] == value) {
            self.debug("Allready loaded: " + self.loaded_packes[index]);
            allReadyLoaded = true;
            return false;
          } else {
            allReadyLoaded = false;
          };
        });
        if(allReadyLoaded == false) {
          self._load_javascript_file(value);
        }
      });
    }

    if(stylesheets) {
      $(stylesheets).each(function(index, value) {
        $(self.loaded_packes).each(function(index, valuePackages) {
          if (self.loaded_packes[index] == value) {
            self.debug("Allready loaded: " + self.loaded_packes[index]);
            allReadyLoaded = true;
            return false;
          } else {
            allReadyLoaded = false;
          };
        });
        if(allReadyLoaded == false) {
          self._load_stylesheet_file(value);
        };
      });
    };
  },

  error: function(message) {
    if(debug==true) {
      this.debug("Error: " + message)
    } else {
      alert(message);
    };
  },

  debug: function(message) {
    if(debug==true) {
      window.console.log("[Widget Loader] " + message);
    }
  },

  _load_javascript_file: function(source) {
    var self = this;

    $(self).bind("widget.javascript.load", function() {
      self.readyJsPackage = self.readyJsPackage + 1;

      if(self.readyJsPackage == self.JsPackage) {
        $(self).trigger('widget.load');
      };

    });
    head.js(self.libpath + "javascripts/" + source + ".js", function() {
      self.debug("Loaded Script: " + self.libpath + "javascripts/" + source + ".js");
      self._refreshLoadedPackes(source);
      $(self).trigger('widget.javascript.load');
    });
  },

  _load_stylesheet_file: function(source) {
    var self = this;

    var newlink = document.createElement("link");
        newlink.setAttribute("rel", "stylesheet");
        newlink.setAttribute("type", "text/css");
        newlink.setAttribute("href", this.libpath + "stylesheets/css/" + source + ".css");
    document.getElementsByTagName("head")[0].appendChild(newlink);

    self.debug("Loaded Script: " + this.libpath + "stylesheets/css/" + source + ".css");
    self._refreshLoadedPackes(source);

  },

  _refreshLoadedPackes: function(source) {
    this.loaded_packes.push(source);

    this.debug("Adding Source to list (" + this.loaded_packes + ").");
  },

  bind: function(eventName, callback) {
    if( !callback ) {
      callback = function() {
        this.debug("Completed script.");
      }
    }
    $(this).bind("widget." + eventName, callback);
  }
}
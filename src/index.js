/**
 *
 *  Devify Starter Kit
 *  Copyright 2016 Devify Platform. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
'use strict';

/**
 * Setup
 */

var app = app || {};

/**
 * Modules
 */
var Automation = require('automationjs');
var Backbone = require('backbone');
var _ = require('underscore');

/**
 * MODELS
 **/

app.Container = Backbone.Model.extend({
  url: function() {
    return '/';
  },
  wsUrl: function() {
    return 'ws://' + this.attributes.endpoint + '/object/' + this.attributes.name + '/viewer';
  },
  defaults: {
    name: '',
    endpoint: '',
    key: '',

    data: '',
    cid: 0
  },
  // AutomationJS plugins
  parseJSON: function() {
    // remove internal properties from model
    var objCopy = function(object) {
      var o = {};
      for (var p in object) {
        if (object.hasOwnProperty(p)) {
          // AutomationJS:
          // don't copy internal properties
          if (p === 'name' || p === 'data' || p === 'cid') {
              continue;
          }
          o[p] = object[p];
        }
      }
      return o;
    };

    var o = objCopy(this.attributes);

    this.set('data', JSON.stringify(o));
    this.trigger('sync');
  },
  // Y-Axis getter
  getY: function() {
    var key = this.get('key');
    var y = this.get(key);

    return (typeof y === 'undefined') ? 0 : y;
  }
});

/**
 * VIEWS
 **/

app.ContainerView = Backbone.View.extend({
  el: '#container',
  template: _.template( $('#tmpl-data').html() ),
  data: [],
  maximum: 0,
  series: [],
  name: '',
  endpoint: '',
  key: '',
  id: '',
  initialize: function() {
    app.id = app.id + 1;
    this.id = 'flot-line-chart-moving-' + app.id;

    this.$el.append('<div class="flot-chart" id="' + this.id + '">');
    this.$elm = this.$el.find('#' + this.id);

    this.component = new Automation({
      el: this.$elm,
      model: app.Container,
      template: this.template
    });
  },
  render: function() {
    var self = this;

    this.model = this.component.add({
      name: self.name,
      endpoint: self.endpoint,
      key: self.key
    });
    this.listenTo(this.model, 'sync', this.draw);
  },
  syncUp: function(name, endpoint, key) {
    this.name = name || 'testman';
    this.endpoint = endpoint || 'wot.city';
    this.key = key || 'temperature';

    this.update();
    this.render();
  },
  update: function() {
    // Determine how many data points to keep based on the placeholder's initial size;
    // this gives us a nice high-res plot while avoiding more than one point per pixel.
    this.maximum = this.$el.outerWidth() / 2 || 300;

    while (this.data.length <= this.maximum) {
        this.data.push(10);
    }

    // zip the generated y values with the x values
    var res = [];
    for (var i = 0; i < this.data.length; ++i) {
        res.push([i, this.data[i]]);
    }

    this.series = [{
        data: res,
        lines: {
            fill: true
        }
    }];

    this.plot = $.plot(this.$elm, this.series, {
      grid: {
        borderWidth: 1,
        minBorderMargin: 20,
        labelMargin: 10,
        backgroundColor: {
          colors: ['#fff', '#e4f4f4']
        },
        margin: {
          top: 38,
          bottom: 20,
          left: 20
        },
        markings: function(axes) {
          var markings = [];
          var xaxis = axes.xaxis;
          for (var x = Math.floor(xaxis.min); x < xaxis.max; x += xaxis.tickSize * 2) {
            markings.push({
              xaxis: {
                from: x,
                to: x + xaxis.tickSize
              },
              color: 'rgba(232, 232, 255, 0.2)'
            });
          }
          return markings;
        }
      },
      xaxis: {
        tickFormatter: function() {
          return '';
        }
      },
      yaxis: {
        min: 0,
        max: 100
      },
      legend: {
        show: true
      }
    });
  },
  draw: function() {
    // get data
    var y = this.model.getY();
    this.data.push(y);

    while (this.data.length > this.maximum) {
        this.data = this.data.slice(1);
    }

    // zip the generated y values with the x values
    var res = [];
    for (var i = 0; i < this.data.length; ++i) {
        res.push([i, this.data[i]]);
    }

    this.series[0].data = res;

    this.plot.setData(this.series);
    this.plot.draw();
  }
});

/*
 * ROUTES
 */

app.AppRoutes = Backbone.Router.extend({
  routes: {
    ':name': 'app',
    ':name/:endpoint': 'app2',
    ':name/:endpoint/:key': 'app3'
  },
  app: function(name) {
    app.containerView = new app.ContainerView();
    app.containerView.syncUp(name);
  },
  app2: function(name, endpoint) {
    app.containerView = new app.ContainerView();
    app.containerView.syncUp(name, endpoint);
  },
  app3: function(name, endpoint, key) {
    app.containerView = new app.ContainerView();
    app.containerView.syncUp(name, endpoint, key);
  }
});

/**
 * BOOTUP
 **/

$(function() {
  app.id = 0;
  app.appRoutes = new app.AppRoutes();
  Backbone.history.start();
});

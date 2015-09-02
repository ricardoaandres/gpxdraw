+function (window) {
  var GPXDraw = function (options) {
    if (!options.file) {
      throw new Error('GPXDraw: Missing file option');
    }

    if (!options.map) {
      throw new Error('GPXDraw: Missing map option');
    }

    this.options = options;

    this.options.color = this.options.color || '#f0a';
    this.options.opacity = this.options.opacity || 1;
    this.options.weight = this.options.weight || 6;

    this.loadFile();
  };

  GPXDraw.prototype.draw = function () {
    var polyline = new google.maps.Polyline({
      path: this.points,
      strokeColor: this.options.color,
      strokeOpacity: this.options.opacity,
      strokeWeight: this.options.weight
    });

    polyline.setMap(this.options.map);
    this.options.map.fitBounds(this.bounds);
  };

  GPXDraw.prototype.loadFile = function () {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', this.options.file, true);

    xhr.onload = function (response) {
      var xmlParser = new DOMParser(),
          gpx = xmlParser.parseFromString(response.target.responseText, 'text/xml');

      this.gpx = gpx.documentElement;
      this.preparePolyline();
    }.bind(this);

    xhr.send();
  };

  GPXDraw.prototype.preparePolyline = function () {
    var points = [],
        bounds = new google.maps.LatLngBounds();

    if (!this.gpx) {
      throw new Error('GPXDraw: Missing gpx file');
    }

    Array.prototype.forEach.call(this.gpx.querySelectorAll('trkpt'), function (position) {
      var latitude = position.getAttribute('lat'),
          longitude = position.getAttribute('lon'),
          point = new google.maps.LatLng(latitude, longitude);

      points.push(point);
      bounds.extend(point);
    });

    this.points = points;
    this.bounds = bounds;
    this.draw();
  };

  window.GPXDraw = GPXDraw;
}(window);

# boxer.js
A little framework for [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js/api/)


## Install

### Manually

After downloading le library in your project directory, include the following assets in your HTML:

```html
<!-- add the mapbox assets -->
<link href='https://api.tiles.mapbox.com/mapbox-gl-js/v0.12.1/mapbox-gl.css' rel='stylesheet' />
<script src='https://api.tiles.mapbox.com/mapbox-gl-js/v0.12.1/mapbox-gl.js'></script>

<!-- add the mapbox assets -->
<script src='assets/raphhh/boxer-0.0.0/dist/boxer.min.js'></script>

```

## Install dev

 1. `$ git clone https://github.com/Raphhh/boxer.git`
 2. `$ npm install`


## Examples

### Display a map

```javascript
mapboxgl.accessToken = 'pk.eyJ1IjoicmFwaGhoIiwiYSI6ImNpaTZiajRxdTAxbmlzd2txbnFzOHJhZGQifQ.fazKIAAlHZWCM2RTSjU86w';

var application = new Boxer.Application();

application.on('map.ready', function(){
    alert('your map is ready :)')
});

application.register('map.init', new Boxer.Map.MapProvider(
        mapboxgl,
        {
            container: 'map', // container id
            style: 'mapbox://styles/mapbox/streets-v8', //stylesheet location
            center: [-74.50, 40], // starting position
            zoom: 9 // starting zoom
        }
))();
```

See the [demo](demo/01-display-map.html).


### Watch GeoLocation

```javascript
application.on('geo.success', function(geoPosition) {
    if(this.services.geoManager){
        this.services.geoManager.put('me', new Boxer.GeoJson.GeoPoint(geoPosition));
    }else{
        console.error('application.services.geoManager not initialized');
    }
});

application.register('geo.init', new Boxer.GeoLocation.WatcherProvider(navigator))();
```

See the [demo](demo/02-watch-geolocation.html).

### Sync position with socket.io

```javascript
application.on('geo.success', function(geoPosition) {
    if(application.services.socket){
        console.log('emit to socket', geoPosition);
        application.services.socket.emit('geo', geoPosition);
    }else{
        console.error('application.services.socket not initialized');
    }
});

application.register('socket.init', new Boxer.Socket.SocketProvider(io, 'http://localhost:8080'))();
```

See the [demo](demo/03-socket.html).

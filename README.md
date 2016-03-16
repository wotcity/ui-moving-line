# UI-Moving-Line

## Usage

The URL format is as ```index.html#<DeviceID>/<Endpoint>/<Y-Axis-Key>```.

Examples:

* ```index.html#testman/wot.city``` is for testing, try it!
* ```index.html#f837aab/devify.azurewebsites.net/quality```
 * **f837aab** is the device ID
 * **devify.azurewebsites.net** is the endpoint server
 * **quality** is the key of the air quality value sent from the ESP8266 device

## Developer

If you need to modify the source code:

1. Install

```
$ npm install
```

2. Modify ```src/index..js``` which is the main application

3. Browserify

```
$ gulp apps
```

## License

Apache License

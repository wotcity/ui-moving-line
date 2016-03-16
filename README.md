# UI-Moving-Line

## Usage

The URL format is as ```index.html#<DeviceID>/<Endpoint>/<Y-Axis-Key>```.

Examples:

* ```index.html#testman/wot.city/temperature``` is for testing, try it!
* ```index.html#f837aab/devify.azurewebsites.net/quality```
 * **f837aab** is the device ID
 * **devify.azurewebsites.net** is the endpoint server
 * **quality** is the key of the air quality value sent from the ESP8266 device

## Developer

If you need to modify the source code, please run ```$ npm install``` to install dependencies before editing the code.

Please open the main file ```src/index.js``` and modify the code. When finish it, please compile ```src/index.js``` with browserify.

```
$ gulp apps
```

The output file is ```dist/index.js```.

## License

Apache License

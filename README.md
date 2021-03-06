# node-red-contrib-ssafy-data-formatter

This module provides two sets of nodes of node-RED that have convenience in interworking with users' cloud storage and using Chart.js library.

This module helps users process data using various statistical functions and create charts regardless of the data source and format.

Users who are not familiar with Chart.js can also customize charts easily for some options.

In addition to open APIs and local directories, data sources in the cloud are available.

This module supports GUI environments so that any user of Node-RED can easily create a chart.

These nodes require Node.js version 14.17.0 and Node-RED 2.0.6.



## Node

- Data formatter: A node that converts various data sources into json data for using Html-out Node(Chart.js) of Samsung Automation Studio.
- Chart Config: A node capable of setting various options of Html-out Node(Chart.js) of Samsung Automation Studio.
- File Cloud: A node with file read, upload, and download functions by linking the cloud.



## Pre-requisites

This module requires [Node-RED](https://nodered.org/) to be installed.



## Install

To install the stable version use the `Menu - Manage palette` option and search for `node-red-contrib-ssafy-data-formatter`, or run the following command in your Node-RED user directory - typically `~/.node-red`:

```bash
npm i node-red-contrib-ssafy-data-formatter
```



## Authors

[sotaeji in SSAFY(Samsung Software Academy for Youth)](https://github.com/SOTAEJI)



## Copyright and License

Copyright Samsung Automation Studio Team under [the Apache 2.0 license](https://www.apache.org/licenses/LICENSE-2.0).


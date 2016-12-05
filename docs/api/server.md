Server
===

## new Server(transport [, root])
Create a server intance. The server object has methods for routing IPC messages as if they were HTTP requests with an API similar to what [Express](https://github.com/expressjs/express) offers.
```javascript
const Server = require('peranta/server')
const server = new Server(transport)
```

## Methods

### server.[GET|POST|PUT|DELETE|ALL]

### server.use([path,] callback [, callback...])
```javascript
server.use(query)
```
### server.debug([json])

```javascript
server.debug()
```

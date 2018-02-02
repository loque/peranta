# Peranta

Handling IPC messages can be a pain if you are building an app with a very active communication between processes.
Instead of reinventing the wheel `Peranta` aims to reduce the learning curve by reimplementing well known patterns such as those used for routing in [Express](https://github.com/expressjs/express) on the server side and a `Promise`-based API on the client side.

This is the core package of `peranta` which provides IPC and routing management. In order to use it, instead of this package you will have to install an adapter depending on the scenario.

These are the adapters currently available:
* [peranta-electron](https://github.com/loque/peranta-electron) for handling IPC between the main process and the renderer process.
* [perante-worker](https://github.com/loque/peranta-worker) for handling IPC between a web worker and the main thread.

## Documentation
* [Server](docs/api/server.md)
* [Client](docs/api/client.md)
* [Routing](docs/api/routing.md)
* [Request](docs/api/request.md)
* [Response](docs/api/response.md)

## License

  [MIT](LICENSE)

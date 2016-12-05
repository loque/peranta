Client
===

## new Client(transport)
Create a client instance. The client object has methods for sending IPC messages handling it's responses with promises.
```javascript
const Client = require('peranta/client')
const client = new Client(transport)
```

## Methods

### client.get(path)
```javascript
client.get('/home')
.then(response =>
{
    console.log(`home's body`, response.body)
})
.catch(error =>
{
    console.error(error)
})
```

### client.post(path [, body])
```javascript
client.post('/users', { name: 'Jack Danger' })
.then(response =>
{
    console.log(`user's name`, response.body.id) // id = 0
})
.catch(error =>
{
    console.error(error)
})
```

### client.put(path [, body])
```javascript
client.put('/users/0', { name: 'Jack Donger' })
.then(response =>
{
    console.log(`updated user's name`, response.body.name)
})
.catch(error =>
{
    console.error(`error`, error)
})
```
> Notice path parameter are being used to capture values from the path. For more information, see [Routing](routing.md).

### client.delete(path)
```javascript
client.delete('/users/0')
.then(response =>
{
    console.log(`deleted user ${response.body.name}`)
})
.catch(error =>
{
    console.error(`error`, error)
})
```
> Notice path parameter are being used to capture values from the path. For more information, see [Routing](routing.md).

### client.on(channel, listener)
Listen to events from a specific channel. These listeners will be called when the server emits an event, not when using http verbs.
```javascript
client.on('users-list-update', data =>
{
    console.log(`users`, data)
})
```

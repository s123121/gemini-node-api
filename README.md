# Gemini Node.js API

Node.js library for [Gemini](https://docs.gemini.com/).

## Installation

```bash
npm install gemini-node-api
```

## Usage

### PublicClient

```javascript
const { PublicClient } = require('gemini-node-api');
const publicClient = new PublicClient();
```

- `get`

```javascript
publicClient
  .request({ uri: 'v1/auction/zecbtc' })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });
```

- `request`

```javascript
const method = 'GET';
const uri = 'v1/pubticker/zecbtc';
publicClient
  .request({ method, uri })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });
```

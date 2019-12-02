# Gemini Node.js API [![CircleCI](https://circleci.com/gh/vansergen/gemini-node-api.svg?style=svg)](https://circleci.com/gh/vansergen/gemini-node-api) [![GitHub version](https://badge.fury.io/gh/vansergen%2Fgemini-node-api.svg)](https://github.com/vansergen/gemini-node-api/releases/latest) [![npm version](https://badge.fury.io/js/gemini-node-api.svg)](https://www.npmjs.com/package/gemini-node-api/v/latest) [![languages](https://img.shields.io/github/languages/top/vansergen/gemini-node-api.svg)](https://github.com/vansergen/gemini-node-api) [![dependency status](https://img.shields.io/librariesio/github/vansergen/gemini-node-api.svg)](https://github.com/vansergen/gemini-node-api) [![repo size](https://img.shields.io/github/repo-size/vansergen/gemini-node-api.svg)](https://github.com/vansergen/gemini-node-api) [![npm downloads](https://img.shields.io/npm/dt/gemini-node-api.svg)](https://www.npmjs.com/package/gemini-node-api) [![license](https://img.shields.io/github/license/vansergen/gemini-node-api.svg)](https://github.com/vansergen/gemini-node-api/blob/master/LICENSE)

Node.js library for [Gemini](https://docs.gemini.com/).

## Installation

```bash
npm install gemini-node-api
```

## Usage

### PublicClient

```typescript
import { PublicClient } from "gemini-node-api";
const client = new PublicClient();
```

- [`getSymbols`](https://docs.gemini.com/rest-api/#symbols)

```typescript
const symbols = await client.getSymbols();
```

- [`getTicker`](https://docs.gemini.com/rest-api/#ticker)

```typescript
const symbol = "zecltc";
const ticker = await client.getTicker({ symbol });
/**
 * for V2
 * @see https://docs.gemini.com/rest-api/#ticker-v2
 */
const v = "v2";
const tickerV2 = await client.getTicker({ symbol, v });
```

- [`getCandles`](https://docs.gemini.com/rest-api/#candles)

```typescript
const symbol = "zecltc";
const time_frame = "30m";
const candles = await client.getCandles({ symbol, time_frame });
```

- [`getOrderBook`](https://docs.gemini.com/rest-api/#current-order-book)

```typescript
const symbol = "zecltc";
const limit_bids = 25;
const limit_asks = 20;
const book = await client.getOrderBook({
  symbol,
  limit_bids,
  limit_asks
});
```

- [`getTradeHistory`](https://docs.gemini.com/rest-api/#trade-history)

```typescript
const symbol = "zecltc";
const timestamp = 1547146811;
const limit_trades = 100;
const include_breaks = true;
const trades = await client.getTradeHistory({
  symbol,
  timestamp,
  limit_trades,
  include_breaks
});
```

- [`getCurrentAuction`](https://docs.gemini.com/rest-api/#current-auction)

```typescript
const symbol = "zecltc";
const auction = await client.getCurrentAuction({ symbol });
```

- [`getAuctionHistory`](https://docs.gemini.com/rest-api/#auction-history)

```typescript
const symbol = "zecltc";
const timestamp = 1547146811;
const limit_auction_results = 100;
const include_indicative = true;
const history = await client.getAuctionHistory({
  symbol,
  timestamp,
  limit_auction_results,
  include_indicative
});
```

### AuthenticatedClient

```typescript
import { AuthenticatedClient } from "gemini-node-api";
const key = "gemini-api-key";
const secret = "gemini-api-secret";
const client = new AuthenticatedClient({ key, secret });
```

- [`newOrder`](https://docs.gemini.com/rest-api/#new-order)

```javascript
const order = await authClient.newOrder({
  symbol: "zecltc",
  client_order_id: "d0c5340b-6d6c-49d9-b567-48c4bfca13d2",
  amount: 1,
  price: 0.9,
  side: "buy",
  moc: true, // maker-or-cancel
  ioc: false, // immediate-or-cancel
  fok: false, // fill-or-kill
  ao: false, // auction-only
  ioi: false // indication-of-interest
});
```

- [`buy`](https://docs.gemini.com/rest-api/#new-order)

```javascript
const symbol = "zecltc";
const amount = 1;
const price = 0.9;
const order = await authClient.buy({ symbol, amount, price });
```

- [`sell`](https://docs.gemini.com/rest-api/#new-order)

```javascript
const symbol = "zecltc";
const amount = 0.99;
const price = 0.99;
const order = await authClient.sell({ symbol, amount, price });
```

- [`cancelOrder`](https://docs.gemini.com/rest-api/#cancel-order)

```javascript
const order_id = 106817811;
const order = await authClient.cancelOrder({ order_id });
```

- [`cancelSession`](https://docs.gemini.com/rest-api/#cancel-all-session-orders)

```javascript
const response = await authClient.cancelSession();
```

- [`cancelAll`](https://docs.gemini.com/rest-api/#cancel-all-active-orders)

```javascript
const response = await authClient.cancelAll();
```

- [`getOrderStatus`](https://docs.gemini.com/rest-api/#order-status)

```javascript
const order_id = 44375901;
const order = await authClient.getOrderStatus({ order_id });
```

- [`getActiveOrders`](https://docs.gemini.com/rest-api/#get-active-orders)

```javascript
const orders = await authClient.getActiveOrders();
```

- [`getPastTrades`](https://docs.gemini.com/rest-api/#get-past-trades)

```javascript
const symbol = "bcheth";
const limit_trades = 10;
const timestamp = 1547232911;
const trades = await authClient.getPastTrades({
  symbol,
  limit_trades,
  timestamp
});
```

- [`getNotionalVolume`](https://docs.gemini.com/rest-api/#get-notional-volume)

```javascript
const volume = await authClient.getNotionalVolume();
```

- [`getTradeVolume`](https://docs.gemini.com/rest-api/#get-trade-volume)

```javascript
const volume = await authClient.getTradeVolume();
```

- [`newClearingOrder`](https://docs.gemini.com/rest-api/#new-clearing-order)

```javascript
const counterparty_id = "OM9VNL1G";
const expires_in_hrs = 24;
const symbol = "btcusd";
const amount = 100;
const price = 9500;
const side = "buy";
const order = await authClient.newClearingOrder({
  counterparty_id,
  expires_in_hrs,
  symbol,
  amount,
  price,
  side
});
```

- [`getClearingOrderStatus`](https://docs.gemini.com/rest-api/#clearing-order-status)

```javascript
const clearing_id = "OM9VNL1G";
const order = await authClient.getClearingOrderStatus({ clearing_id });
```

- [`cancelClearingOrder`](https://docs.gemini.com/rest-api/#cancel-clearing-order)

```javascript
const clearing_id = "OM9VNL1G";
const order = await authClient.cancelClearingOrder({ clearing_id });
```

- [`confirmClearingOrder`](https://docs.gemini.com/rest-api/#confirm-clearing-order)

```javascript
const clearing_id = "OM9VNL1G";
const symbol = "btcusd";
const amount = 100;
const price = 9500;
const side = "sell";
const order = await authClient.confirmClearingOrder({
  clearing_id,
  symbol,
  amount,
  price,
  side
});
```

- [`getAvailableBalances`](https://docs.gemini.com/rest-api/#get-available-balances)

```typescript
const account = "primary";
const balances = await client.getAvailableBalances({ account });
```

- [`getTransfers`](https://docs.gemini.com/rest-api/#transfers)

```typescript
const timestamp = 1495127793;
const limit_transfers = 12;
const account = "primary";
const transfers = await client.getTransfers({
  timestamp,
  limit_transfers,
  account
});
```

- [`getNewAddress`](https://docs.gemini.com/rest-api/#new-deposit-address)

```typescript
const currency = "ltc";
const label = "New LTC deposit address";
const legacy = true;
const account = "primary";
const address = await client.getNewAddress({
  currency,
  label,
  legacy,
  account
});
```

- [`withdrawCrypto`](https://docs.gemini.com/rest-api/#withdraw-crypto-funds-to-whitelisted-address)

```typescript
const currency = "btc";
const address = "mi98Z9brJ3TgaKsmvXatuRahbFRUFKRUdR";
const amount = 10;
const account = "primary";
const withdrawal = await client.withdrawCrypto({
  currency,
  address,
  account,
  amount
});
```

- [`internalTransfer`](https://docs.gemini.com/rest-api/#internal-transfers)

```typescript
const currency = "btc";
const sourceAccount = "primary";
const targetAccount = "secondary";
const amount = "100";
const transfer = await client.internalTransfer({
  currency,
  sourceAccount,
  targetAccount,
  amount
});
```

- [`createAccount`](https://docs.gemini.com/rest-api/#create-account)

```typescript
const name = "My Secondary Account";
const type = "custody";
const result = await client.createAccount({ name, type });
```

- [`getAccounts`](https://docs.gemini.com/rest-api/#get-accounts-in-master-group)

```typescript
const accounts = await client.getAccounts();
```

- [`withdrawGUSD`](https://docs.gemini.com/rest-api/#withdraw-usd-as-gusd)

```typescript
const address = "0x0F2B20Acb2fD7EEbC0ABc3AEe0b00d57533b6bD1";
const amount = "500";
const account = "primary";
const withdrawal = await client.withdrawGUSD({ address, amount, account });
```

- [`heartbeat`](https://docs.gemini.com/rest-api/#heartbeat)

```typescript
const heartbeat = await client.heartbeat();
```

### WebsocketClient

```javascript
const { WebsocketClient } = require("gemini-node-api");
const key = "gemini-api-key";
const secret = "gemini-api-secret";
const websocket = new WebsocketClient({ key, secret });
websocket.on("error", (error, market) => {
  console.error(error);
});
websocket.on("open", market => {
  console.log("Open connection: ", market);
});
websocket.on("close", market => {
  console.log("Closed connection: ", market);
});
websocket.on("message", (message, market) => {
  console.info(message);
});
```

- [`connectMarket`](https://docs.gemini.com/websocket-api/#market-data)

```javascript
const heartbeat = true;
const top_of_book = false;
const bids = true;
const offers = true;
const trades = true;
const auctions = false;
const symbol = "zecltc";
websocket.on("open", market => console.log("Open:", market));
websocket.connectMarket({
  symbol,
  heartbeat,
  top_of_book,
  bids,
  offers,
  trades,
  auctions
});
websocket.connectMarket({ symbol: "btcusd" });
```

- [`disconnectMarket`](https://docs.gemini.com/websocket-api/#market-data)

```javascript
const symbol = "zecltc";
websocket.once("close", market => console.log("Closed:", market));
websocket.disconnectMarket({ symbol });
```

- [`connect`](https://docs.gemini.com/websocket-api/#market-data-version-2)

```javascript
websocket.on("open", market => console.log("Open:", market));
websocket.connect();
```

- [`disconnect`](https://docs.gemini.com/websocket-api/#market-data-version-2)

```javascript
websocket.once("close", market => console.log("Closed:", market));
websocket.disconnect();
```

- [`subscribe`](https://docs.gemini.com/websocket-api/#level-2-data)

```javascript
const subscriptions = [
  { name: "l2", symbols: ["BTCUSD", "ETHUSD"] },
  { name: "candles_1m", symbols: ["BTCUSD"] }
];
websocket.on("open", market => {
  if (market === "v2") {
    websocket.subscribe(subscriptions);
  }
});
```

- [`unsubscribe`](https://docs.gemini.com/websocket-api/#unsubscribe)

```javascript
const subscription = { name: "l2", symbols: ["BTCUSD", "ETHUSD"] };
websocket.unsubscribe(subscription);
```

- [`connectOrders`](https://docs.gemini.com/websocket-api/#order-events)

```javascript
const symbolFilter = "zecltc";
const apiSessionFilter = "UI";
const eventTypeFilter = ["accepted", "rejected"];
websocket.on("message", (message, market) => {
  if (market === "orders") {
    console.log("New message:", message);
  }
});
websocket.connectOrders({ symbolFilter, apiSessionFilter, eventTypeFilter });
```

- [`disconnectOrders`](https://docs.gemini.com/websocket-api/#order-events)

```javascript
websocket.once("close", market => {
  if (market === "orders") {
    console.log("Closed");
  }
});
websocket.disconnectOrders();
```

### Test

```bash
npm test
```

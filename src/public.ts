import { FetchClient, UnsuccessfulFetch } from "rpc-request";

export const ApiLimit = 500;
export const DefaultSymbol = "btcusd";
export const DefaultCurrency = "usd";
export const ApiUri = "https://api.gemini.com";
export const SandboxApiUri = "https://api.sandbox.gemini.com";
export const Headers = {
  "User-Agent": "gemini-node-api",
  "Content-Type": "text/plain",
  Accept: "application/json",
  "Content-Length": "0",
  "Cache-Control": "no-cache",
};

export interface SymbolFilter {
  symbol?: string;
}

export interface TickerFilter extends SymbolFilter {
  v?: "v1" | "v2";
}

export interface CandlesFilter extends SymbolFilter {
  time_frame?: "1m" | "5m" | "15m" | "30m" | "1hr" | "6hr" | "1day";
}

export interface BookFilter extends SymbolFilter {
  limit_bids?: number;
  limit_asks?: number;
}

export interface TradeHistoryFilter extends SymbolFilter {
  timestamp?: number;
  limit_trades?: number;
  include_breaks?: boolean;
}

export interface AuctionHistoryFilter extends SymbolFilter {
  timestamp?: number;
  limit_auction_results?: number;
  include_indicative?: boolean;
}

export interface ISymbol {
  symbol: string;
  base_currency: string;
  quote_currency: string;
  tick_size: number;
  quote_increment: number;
  min_order_size: string;
  status: "open" | "closed" | "cancel_only" | "post_only" | "limit_only";
}

export interface TickerV1 {
  bid: string;
  ask: string;
  last: string;
  volume: { [key: string]: string | number };
}

export interface TickerV2 {
  symbol: string;
  open: string;
  high: string;
  low: string;
  close: string;
  changes: string[];
  bid: string;
  ask: string;
}

export type Ticker = TickerV1 | TickerV2;

export type Candle = [number, number, number, number, number, number];

export interface BookEntry {
  price: string;
  amount: string;
  timestamp: string;
}

export interface OrderBook {
  bids: BookEntry[];
  asks: BookEntry[];
}

export interface Trade {
  timestamp: number;
  timestampms: number;
  tid: number;
  price: string;
  amount: string;
  exchange: "gemini";
  type: "buy" | "sell" | "auction" | "block";
  broken?: boolean;
}

export interface AuctionInfo {
  closed_until_ms?: number;
  last_auction_eid?: number;
  last_auction_price?: string;
  last_auction_quantity?: string;
  last_highest_bid_price?: string;
  last_lowest_ask_price?: string;
  last_collar_price?: string;
  most_recent_indicative_price?: string;
  most_recent_indicative_quantity?: string;
  most_recent_highest_bid_price?: string;
  most_recent_lowest_ask_price?: string;
  most_recent_collar_price?: string;
  next_update_ms?: number;
  next_auction_ms?: number;
}

export interface AuctionHistory {
  timestamp: number;
  timestampms: number;
  auction_id: number;
  eid: number;
  event_type: "indicative" | "auction";
  auction_result: "success" | "failure";
  auction_price?: string;
  auction_quantity?: string;
  highest_bid_price?: string;
  lowest_ask_price?: string;
  collar_price?: string;
  unmatched_collar_quantity?: string;
}

export interface PriceFeedItem {
  pair: string;
  price: string;
  percentChange24h: string;
}

export interface PublicClientOptions {
  symbol?: string;
  sandbox?: boolean;
  apiUri?: string;
}

export class PublicClient extends FetchClient<unknown> {
  public readonly symbol: string;
  public readonly apiUri: string;

  public constructor({
    symbol = DefaultSymbol,
    sandbox = false,
    apiUri = sandbox ? SandboxApiUri : ApiUri,
  }: PublicClientOptions = {}) {
    super({ headers: { ...Headers } }, { transform: "json", baseUrl: apiUri });
    this.apiUri = apiUri;
    this.symbol = symbol;
  }

  public get<T = unknown>(path: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      super
        .get(path)
        .then((data) => {
          resolve(data as T);
        })
        .catch((error) => {
          if (error instanceof UnsuccessfulFetch) {
            error.response
              .json()
              .then((data) => {
                const { reason, message } = data as {
                  reason: string;
                  message?: string;
                };
                reject(new Error(message ?? reason));
              })
              .catch(reject);
          } else {
            reject(error);
          }
        });
    });
  }

  /**
   * Get all available symbols for trading.
   */
  public getSymbols(): Promise<string[]> {
    return this.get<string[]>("v1/symbols");
  }

  /**
   * Get extra details about the symbol.
   */
  public getSymbol({ symbol }: { symbol: string }): Promise<ISymbol> {
    return this.get<ISymbol>(`v1/symbols/details/${symbol}`);
  }

  /**
   * Get information about recent trading activity for the symbol.
   */
  public getTicker(options: { symbol?: string; v: "v2" }): Promise<TickerV2>;
  public getTicker(options?: { symbol?: string; v?: "v1" }): Promise<TickerV1>;
  public getTicker({
    symbol = this.symbol,
    v = "v1",
  }: TickerFilter = {}): Promise<Ticker> {
    if (v === "v2") {
      return this.get<TickerV2>(`/${v}/ticker/${symbol}`);
    }
    return this.get<TickerV1>(`/${v}/pubticker/${symbol}`);
  }

  /** Get time-intervaled data for the provided symbol. */
  public getCandles({
    symbol = this.symbol,
    time_frame = "1day",
  }: CandlesFilter = {}): Promise<Candle[]> {
    return this.get<Candle[]>(`/v2/candles/${symbol}/${time_frame}`);
  }

  /** Get the current order book. */
  public getOrderBook({
    symbol = this.symbol,
    ...qs
  }: BookFilter = {}): Promise<OrderBook> {
    const url = new URL(`/v1/book/${symbol}`, this.apiUri);
    PublicClient.#addOptions(url, { ...qs });
    return this.get<OrderBook>(url.toString());
  }

  /** Get the trades that have executed since the specified timestamp. */
  public getTradeHistory({
    symbol = this.symbol,
    limit_trades = ApiLimit,
    ...qs
  }: TradeHistoryFilter = {}): Promise<Trade[]> {
    const url = new URL(`/v1/trades/${symbol}`, this.apiUri);
    PublicClient.#addOptions(url, { limit_trades, ...qs });
    return this.get<Trade[]>(url.toString());
  }

  /** Get current auction information. */
  public getCurrentAuction({
    symbol = this.symbol,
  }: SymbolFilter = {}): Promise<AuctionInfo> {
    return this.get<AuctionInfo>(`v1/auction/${symbol}`);
  }

  /** Get the auction events. */
  public getAuctionHistory({
    symbol = this.symbol,
    limit_auction_results = ApiLimit,
    ...qs
  }: AuctionHistoryFilter = {}): Promise<AuctionHistory[]> {
    const url = new URL(`/v1/auction/${symbol}/history`, this.apiUri);
    PublicClient.#addOptions(url, { limit_auction_results, ...qs });
    return this.get<AuctionHistory[]>(url.toString());
  }

  /** Get the price feed. */
  public getPriceFeed(): Promise<PriceFeedItem[]> {
    return this.get<PriceFeedItem[]>("v1/pricefeed");
  }

  static #addOptions(
    target: URL,
    data: Record<string, string | number | boolean | undefined>
  ): void {
    for (const key in data) {
      const value = data[key];
      if (typeof value !== "undefined") {
        target.searchParams.append(key, value.toString());
      }
    }
  }
}

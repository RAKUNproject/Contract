
# Rakun Public Contract

## コントラクト

- *RakunCoin*   
ERC20トークン


## セットアップ(Local環境)

※ Node.jsが必要です。

#### EthereumClientをインストール
下記EthereumClientアプリケーションのganacheをインストールする

https://truffleframework.com/ganache

install後、ganacheを起動する

#### コントラクトのデプロイ(ganache)
※ EthereumClient環境の起動が必要です。

```
cd RAKUN_BC_PUBLIC_CONTRACT
npm install
./node_modules/.bin/truffle migrate
```

#### テスト
※ EthereumClient環境の起動が必要です。

```
npm run test
```

#### カバレッジ
※ EthereumClient環境の起動が必要です。

```
npm run coverage
```


## デプロイ(Mainnet環境)

#### 接続環境の変更
EthereumのMainnet接続先を準備し、`truffle.js`の`host`と`port`を変更
```
mainnet: {
  host: "127.0.0.1",
  port: 8545,
  network_id: 1,
  gasPrice: 20000000000
}
```

#### コントラクトのデプロイ(Mainnet)
```
./node_modules/.bin/truffle migrate --network mainnet
```

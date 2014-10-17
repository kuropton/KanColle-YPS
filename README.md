# 艦これ余所見プレイ支援 KanColle-YPS
* 開発サイト: https://github.com/hkuno9000/KanColle-YPS
* 公開サイト: http://hkuno9000.github.io/KanColle-YPS

## 開発コンセプト
* 艦これの画面から目を離していても、ゲーム進行状況をすべて把握することが目的です。
* 遠征終了時刻や任務遂行状況を記録し、メモがわりに使えるようにします。

## インストール方法
Flash PlayerはChrome内蔵のほうを使用してください

1. ソースコード一式をダウンロードする
1. Google Chromeの拡張機能設定ページを開く(右肩の三本線→設定→左列の拡張機能)
1. [デベロッパー モード]にチェックを入れる
1. [パッケージ化されていない拡張機能を読み込む]ボタンを押して、ダウンロードしてきたソースコード一式が含まれるディレクトリを指定する(これで拡張機能がインストールされる)

## 使い方
1. Google Chromeの[開発/管理]メニューから[デベロッパー ツール]を起動する
  * **デベロッパーツールを起動させておかないと動作しません**
  * Windows版は F12 キーを押しても起動します。
1. Google Chromeで艦これにログインすると、画面右側に「艦これ余所見プレイ支援」と表示されます。
1. 母港画面では、画面右側に「未ロック艦一覧、ロック装備一覧、任務、艦隊１～４」の各メニューが表示されます。
1. メニューの[+]ボタンをクリックすると詳細が表示されます。
  * 表示が画面下部に被る場合は「運営電文」を開いて画面を縦に伸ばしておくと良いでしょう。
1. 艦隊１～４の Cond 値は49が平常で50以上がキラキラです。
1. あ号任務についてはその内訳（出撃数、ボス勝利、ボス到達、S勝利）を表示します。
1. 戦闘画面では、画面右側に敵味方艦隊のダメージ(撃沈、大破、中破、小破)と戦果を表示します。
1. 戦闘後や遠征帰還後の資材増減を記録して表示します。

## 注意事項
* 表示する装備保有数は、装備保有艦娘のロストによる装備減少に対応していないので、実際より多く表示される場合があります。
* 修復要員、修復女神の装備表示は、修復発動後の変動に対応していない可能性があるので、表示を鵜呑みにすると危険です。大破進撃は自己責任でお願いします。

## 仕組みなど
元々Google Chromeにあるネットワークをモニタリングする機能を使って、サーバから送られてくる各種情報を拾って、ゲーム画面の右端にテキスト表示します。
完全にパッシブ動作で、ゲームサーバへのリクエスト送信はしません。自動実行機能もありません。
仕組み上、ゲーム画面の演出進行と、こちらの表示更新のタイミングが合いません。先に結果が見えてしまいますがご容赦ください。

## 参考プロジェクト
下記を元にして自分が欲しい機能を付け足しました。
* 本家 https://github.com/kageroh/cond_checker
* 一部機能をマージ https://github.com/t-f-m/cond_checker_mod

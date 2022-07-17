# dataディレクトリ

## 概要

宇都宮市のオープンソースデータを.geojsonに書き換えます

## データ内容

```md
data
├── csv_data
│  ├── tmp_park.csv // 一時避難場所の公園csvデータ
│  └── wide_park.csv // 広域避難場所の公園csvデータ
├── geojson_data
│  ├── make_geojson.ipynb // csvデータからgeojsonを作るためのjupyternotebook
│  ├── tmp_park.geojson // 一時避難場所の公園geojsonデータ
│  └── wide_park.geojson // 一時避難場所の公園geojsonデータ
├── hello.html// 可視化された公園データ
└── README.md //このファイル
```
## 仕様モジュール

pandas
geopandas

let utsunomiyaLat = 36.558852; // JR宇都宮駅の緯度
let utsunomiyaLng= 139.898126; // JR宇都宮駅の経度
let zoom = 16; // ズームレベル

let map = L.map("map"); // 地図の生成
map.setView([utsunomiyaLat, utsunomiyaLng], zoom); // 緯度経度、ズームレベルを設定する

// タイルレイヤを生成し、地図に追加する
// 今回はOpenStreetMapを表示する
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    // 著作権の表示
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
).addTo(map);

//一時避難所のアイコン追加
var tmpEvacuationParkIcon = L.icon({
  iconUrl: './icon/tmporaly_evacuation_site.png', // アイコン画像のURL
  iconSize:     [40, 40], // アイコンのサイズをピクセルで指定
  iconAnchor:   [25, 50], // アイコンの先端の座標（右上からの相対座標）
  popupAnchor:  [0, -50] // ポップアップが開く点の座標（iconAnchorが基準）
});

//広域避難場所のアイコン追加
var wideEvacuationParkIcon = L.icon({
  iconUrl: './icon/wide_area_evacuation_site.png', // アイコン画像のURL
  iconSize:     [40, 40], // アイコンのサイズをピクセルで指定
  iconAnchor:   [25, 50], // アイコンの先端の座標（右上からの相対座標）
  popupAnchor:  [0, -50] // ポップアップが開く点の座標（iconAnchorが基準）
});

// leafletに追加するリストを定義
let parkLocationList = [];

//一時避難所のデータ
var tmpEvacuationParkUrl = './data/geojson_data/tmp_park.geojson';
// jquery を使わずにデータ処理したい
fetch(tmpEvacuationParkUrl)
  .then(response => response.json())
  // GeoJSONを地図に追加する
  .then(data => {
    parkLocationList.push(L.geoJSON(data,{
       // カスタムアイコンを設定する
      pointToLayer: function(feature, latlng) {
        return L.marker(latlng, {icon: tmpEvacuationParkIcon});
      },
      // ポップアップを表示する
      onEachFeature: function (feature, layer) {
        // 建物の名前を取り出す(改行<br>)
        let name = feature.properties.title + '<br>';
        // ポップアップに名前を表示する
        layer.bindPopup(name);
      }
    }));
    console.log('could get tmp json',data);
    
    //広域避難所のデータ
    var wideEvacuationParkUrl = './data/geojson_data/wide_park.geojson';
    fetch(wideEvacuationParkUrl)
      .then(response => response.json())
      // GeoJSONを地図に追加する
      .then(data => {
        parkLocationList.push(L.geoJSON(data, {
          // カスタムアイコンを設定する
          pointToLayer: function(feature, latlng) {
          return L.marker(latlng, {icon: wideEvacuationParkIcon});
        },
          // ポップアップを表示する
          onEachFeature: function(feature, layer){
          // 建物の名前を取り出す(改行<br>)
          let name = feature.properties.title+'<br>';
          // ポップアップに名前を表示する
          layer.bindPopup(name);
      }
      }));
        console.log('Could get wide json',L.geoJSON(data));
        let group = L.layerGroup(parkLocationList);
        console.log(group);
        group.addTo(map);
      });
  });


// L.geoJSON(data).addTo(map);

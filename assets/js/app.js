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

// leafletに追加するリストを定義
let parkLocationList = [];

//一時避難所のデータ
var tmpEvacuationParkUrl = './data/geojson_data/tmp_park.geojson';
// jquery を使わずにデータ処理したい
fetch(tmpEvacuationParkUrl)
  .then(response => response.json())
  // GeoJSONを地図に追加する
  .then(data => {
    parkLocationList[parkLocationList.length] = L.geoJSON(data);
    console.log('Could get tmp json');
  });

//広域避難所のデータ
var wideEvacuationParkUrl = './data/geojson_data/wide_park.geojson';
fetch(tmpEvacuationParkUrl)
  .then(response => response.json())
  // GeoJSONを地図に追加する
  .then(data => {
    parkLocationList[parkLocationList.length] = L.geoJSON(data);
    console.log('Could get wide json');
  });


let group = L.layerGroup(parkLocationList);
group.addTo(map);
// L.geoJSON(data).addTo(map);

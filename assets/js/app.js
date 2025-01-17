let utsunomiyaLat = 36.558852; // JR宇都宮駅の緯度
let utsunomiyaLng = 139.898126; // JR宇都宮駅の経度
let zoom = 14; // ズームレベル

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
  iconSize: [40, 40], // アイコンのサイズをピクセルで指定
  iconAnchor: [25, 50], // アイコンの先端の座標（右上からの相対座標）
  popupAnchor: [0, -50] // ポップアップが開く点の座標（iconAnchorが基準）
});

//広域避難場所のアイコン追加
var wideEvacuationParkIcon = L.icon({
  iconUrl: './icon/wide_area_evacuation_site.png', // アイコン画像のURL
  iconSize: [40, 40], // アイコンのサイズをピクセルで指定
  iconAnchor: [25, 50], // アイコンの先端の座標（右上からの相対座標）
  popupAnchor: [0, -50] // ポップアップが開く点の座標（iconAnchorが基準）
});

//一時避難場所のデータについてfetch処理まで書いとく
function getTmpParkLocation() {
  const url = './data/geojson_data/tmp_park.geojson';
  return fetch(url).then(response => response.json())
}
//広域避難場所のデータについてfetch処理まで書いとく
function getWidthParkLocation() {
  const url = './data/geojson_data/wide_park.geojson';
  return fetch(url).then(response => response.json())
}

const facilityList = ['防災トイレ', 'ソーラー発電の公園灯', '揚水ポンプ', '防火水槽', '応急給水槽', 'ヘリコプター臨時離着陸場', 'かまどベンチ', '防災あずまや', '防災備蓄庫'];

/*ここでpopupのスタイルを整形して表示したい*/
function generatePopUpMessage(feature) {

  var message = '';
  message += `<img src="${feature.properties.image_url}" class="leaflet-popup-thumbnail"/>`
  message += '<ol class="mapExplanation"><li>名称</li>' + feature.properties.title;
  message += '<li>住所</li>' + '栃木県宇都宮市' + feature.properties.city;
  message += '<li>電話番号</li>' + feature.properties.Tel;
  message += '<li>設備情報</li><ul class="pl-1">';
  message += facilityList.map(function (value) {
    // .jsonのfacilityの中身をforで回す
    var resultText
    if (feature.properties[value]) {
      resultText = '<li>⭕' + value + '</li>'
    } else {
      resultText = '<li>❌' + value + '</li>'
    }
    return resultText;
  }).join('');
  message += '</ul>'
  // '<li><a href="">html</a></li><li><a href="">css</a></li><li><a href="">javacrip</a></li></ol></li><li><a href="">Site map</a></li><li><a href="">Mail</a></li></ol>';
  return message
}

//定義された関数を呼び出すことでfetchをpromise.allがいっぺんに処理する
Promise.all([getTmpParkLocation(), getWidthParkLocation()]).then(values => {
  console.log(values);
  // 呼び出した順に値が返ってくる
  // 今回は [一時避難場所, 広域避難場所] の順
  const [tmpParkLocationData, widthParkLocationData] = values;
  // leafletに追加するリストを定義
  const layerGroupList = [
    //一時避難場所
    L.geoJSON(tmpParkLocationData, {
      // カスタムアイコンを設定する
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: tmpEvacuationParkIcon });
      },
      // ポップアップを表示する
      onEachFeature: function (feature, layer) {
        // 建物の情報を表示用に成形
        var featureExplanation = generatePopUpMessage(feature);
        // 表示に挿入
        layer.bindPopup(featureExplanation);
      }
    }),

    //広域避難場所
    L.geoJSON(widthParkLocationData, {
      // カスタムアイコンを設定する
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: wideEvacuationParkIcon });
      },
      // ポップアップを表示する
      onEachFeature: function (feature, layer) {
        // 建物の情報を表示用に成形
        var featureExplanation = generatePopUpMessage(feature);
        // 表示に挿入
        layer.bindPopup(featureExplanation);
      }
    }),
  ];
  //maplayerにリストを追加
  const layerGroup = L.layerGroup(layerGroupList);
  //表示
  layerGroup.addTo(map);
})

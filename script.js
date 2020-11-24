//import { Cropper } from "../node_modules/cropperjs/dist/cropper.js"

var image = new Image();
var size = "";
var name = "";
var w = 0;
var h = 0;

function size_decide(){//1. サイズ決定
  // form要素を取得
  var element = document.getElementById("size");
  // form要素内のラジオボタングループ(name="trigger")を取得
  var radioNodeList = element.trigger;
  // 選択状態の値(value)を取得
  size = radioNodeList.value;

  radioNodeList.forEach(radio => {
    radio.disabled = true
  });

};

document.addEventListener("DOMContentLoaded", function(){
  document.getElementById('select').addEventListener('change', function(e) {//2. 画像選択
    // 1枚だけ表示する
    var file = e.target.files[0];
    if(file == null){
      //画像が選択されていない
    }else{
      //画像が選択されている
      var fileReader = new FileReader();
      fileReader.onload = function() {
          var dataUri = this.result;
          image.src = dataUri;
          name = baseName( file.name ) + "_nwg.png";
          size_decide()
          image_decide()
          //button.disabled = false
          //console.log("Selected")
      }
      fileReader.readAsDataURL(file);
    };
  });
}, false);

function image_decide(){//3. クロップ
  document.getElementById('select').disabled = true;

  var generate = document.getElementById('generatebutton');
  //解像度（画面サイズ）設定
  switch(size){
    case "nn_ss"://5.4Inch 12 Mini
      w = 1170;
      h = 2532;
      break;
    case "nn_s"://5.8Inch X,XS,11 Pro
      w = 1125;
      h = 2436;
      break;
    case "nn_m"://6.1 Inch XR,11
      w = 828;
      h = 1792;
      break;
    case "nn_mn"://6.1Inch(New) 12,12 Pro
      w = 1170;
      h = 2532;
      break;
    case "nn_l"://6.7Inch XS Max,11 Pro Max
      w = 1242;
      h = 2688;
      break;
    case "nn_ln"://6.7Inch(New) 12 Pro Max
      w = 1284;
      h = 2778;
      break;
    case "n_s"://4.0Inch 5,5s,5c,SE1
      w = 640;
      h = 1136;
      break;
    case "n_m"://4.7Inch 6,6s,7,8,SE2
      w = 750;
      h = 1334;
      break;
    case "n_l"://5.5Inch Plus Series
      w = 1080;
      h = 1920;
      break;
    default:
      console.log("Size Error");
      break;
  };
  //クロッパー
  var cropperImg = document.getElementById('cropper-img');
  cropperImg.src = image.src;
  var cropper = new Cropper(cropperImg, {aspectRatio: w / h,viewMode:1,autoCropArea:1});
  generate.disabled = false;

  document.getElementById('generatebutton').addEventListener('click', function () {//生成処理
    var download = document.getElementById('downloadbutton');
    var pixel = document.getElementById('pixel');

    var canvas = document.getElementById('result');
    var ctx = canvas.getContext('2d');
    canvas.width = w;
    canvas.height = h;
    pixel.innerHTML = w + "×" + h　+ " / " + size + " / " + name;

    var resultImgUrl = cropper.getCroppedCanvas().toDataURL();
    var bg = new Image();
    bg.src = resultImgUrl;
    bg.onload = (function () {
      //背景を描画
      ctx.drawImage(bg, 0, 0 , w , h);
      var notch = new Image();
      notch.src = "images/" + size + ".png";
      notch.onload = (function () {
        //ノッチ描画
        ctx.drawImage(notch, 0, 0);

        //ダウンロードリンク生成
        if (canvas.toBlob){
          canvas.toBlob(function (blob) {
            var url = (window.URL || window.webkitURL);
            // ダウンロード用のURL作成
            var dataUrl = url.createObjectURL(blob);
            download.href = dataUrl;
            download.download = name;
            download.disabled = false;
          });
        }else if (canvas.msToBlob) { //for IE
          //base64からblob
      		var blob = canvas.msToBlob();
      		window.navigator.msSaveBlob(blob, name);
      	} else { //for Others
          //base64取得
          var base64 = canvas.toDataURL(imageType);
          //base64からblob
          var blob = Base64toBlob(base64);
          var url = (window.URL || window.webkitURL);
          // ダウンロード用のURL作成
          var dataUrl = url.createObjectURL(blob);
          download.href = dataUrl;
          download.download = name;
          download.disabled = false;
    	  };
      });
    });

  });
};





// Base64データをBlobデータに変換
function Base64toBlob(base64){
    // カンマで分割して以下のようにデータを分ける
    // tmp[0] : データ形式（data:image/png;base64）
    // tmp[1] : base64データ（iVBORw0k～）
    var tmp = base64.split(',');
    // base64データの文字列をデコード
    var data = atob(tmp[1]);
    // tmp[0]の文字列（data:image/png;base64）からコンテンツタイプ（image/png）部分を取得
	var mime = tmp[0].split(':')[1].split(';')[0];
    //  1文字ごとにUTF-16コードを表す 0から65535 の整数を取得
	var buf = new Uint8Array(data.length);
	for (var i = 0; i < data.length; i++) {
        buf[i] = data.charCodeAt(i);
    }
    // blobデータを作成
	var blob = new Blob([buf], { type: mime });
    return blob;
}

//拡張子はずす
function baseName(str){
   var base = new String(str).substring(str.lastIndexOf('/') + 1);
    if(base.lastIndexOf(".") != -1)
        base = base.substring(0, base.lastIndexOf("."));
   return base;
}

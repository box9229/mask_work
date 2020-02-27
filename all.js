ㄧ
const xhr = new XMLHttpRequest();
xhr.open(`GET`, `https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json`, true);
xhr.send();
xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
        if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
            data = JSON.parse(this.responseText).features;
            // console.log(data);
            initMap();
        } else {
            console.log(`NOT FOUND`);
        }
    }
    
}
xhr.onload = function () {
    // var response = JSON.parse(xhr.responseText);
    // data = response.features;
    data = opentime(data);
    callit(event);    
  
  
};

function callit(e){ // (e)為要表示的事件
	var searchvalue = search.value; //給搜尋的值一個名稱為：searchvalue
	var searchnewlist = []; //要第一次篩選過後的值有地方收起來，給他一個空陣列
	var searchfinal = [];//讓第二次篩選的值有地方可以放，再給他一個空陣列
	var list= document.querySelector('.pharmacyinfo'); //讓篩選出來的東西帶入原本寫好的list裡
	var str = '';
	var resoure = search.value; //因為不知道要輸入的值為何，先給一個名稱為resoure=search的值

	if(e.type === 'click' && e.keyCode ==13){  //防呆機制,便是點擊或是按鍵,若事件類型嚴格相等於click’和‘按鍵keycode＝enter按鍵
			let resoure = search.value.trim();//（撇除空值）如果以搜尋的值為空值的話
	}
	if(e.type === 'keydown' && e.keyCode !==13){
			return;
	}

	if(resoure == ''){//如果resoure是字串
			return; //就不繼續進行; 這裡做兩次判斷。1:空值 2:字串
	};

	for(var i=0;i<data.length;i++){
		var pharmacy = data[i];
		if (data[i].properties.address.indexOf(resoure) != -1 || data[i].properties.name.indexOf(resoure) != -1 ){ //！！！！！！！選取data下的address＝-1或是name=-1時;indexOf() 方法會回傳給定元素於陣列中第一個被找到之索引，若不存在於陣列中則回傳 -1。
			searchnewlist.push(data[i]); //將取出的數據塞回：searchlist   //塞資料到ul框內
			str += 
			'<li class="pharmacy">'+
				'<div class="pharmacy-detail">'+
					'<h3 class="name">'+data[i].properties.name +'</h3>'+
					'<p class="address">'+data[i].properties.address+'</p>'+
					'<p class="phone">'+data[i].properties.phone+'</p>'+
					'<p class="open-time">營業時間'+' '+data[i].properties.available.open[d] + '</p>'+
				'</div>'+
				'<div class="maskboth">'+
				'<div class="mask_adult">'+
					'<div class="adult">成人口罩'+'</div>'+
					'<div class="number">'+data[i].properties.mask_adult+'</div>'+
				'</div>'+
				'<div class="mask_child">'+
					'<div class="child">兒童口罩'+'</div>'+
					'<div class="number">'+data[i].properties.mask_child+'</div>'+
				'</div>'+
				'</div>'+
			'</li>';
		}
	}
	list.innerHTML = str; //最後印出來
	var searchList = document.querySelectorAll('.pharmacy');
	searchList.forEach(function(item, i) { 
		item.addEventListener('click', function(){ //監聽點擊ul的時候會實現飛到地圖上的圖示
			flyTo(searchnewlist[i]); //打開物件內容
		});
	});
	maskcolor();
};

function flyTo({ geometry, properties }) {  // 飛到地圖的資料
	const geo = geometry.coordinates; //取個地圖路徑為geo 
	const id = properties.id;  //取地圖的id
  pharmacyMarker[id].addTo(map).openPopup(); // 取每筆資料的id,加入地圖中打開地圖圖標
	map.flyTo([geo[1], geo[0]], 12); //圖標效果：位置經緯度,zoom大小
}
// 設定地圖＋圖標
function initMap(){
	map = L.map('map', {
		center: [22.671188, 120.485712],
		zoom: 12
	});

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	// markers = new L.MarkerClusterGroup({disableClusteringAtZoom: 16}).addTo(map);
	markers = L.markerClusterGroup({disableClusteringAtZoom: 16});
  // 設定 pulsingIcon
  //須先html載入套件連結
	var pulsingIcon = L.icon.pulse({iconSize: [20, 20], color: '#FFA573', fillColor: '#FFA573'});

	var greenIcon = new L.Icon({
		iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
		shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41]
	});
	var redIcon = new L.Icon({
		iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
		shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41]
	});

	for(let i =0;data.length>i;i++){
        let mask;
		let jsmask_Adult;
		let jsmask_Child;
		let A_mask = data[i].properties.mask_adult;
		let C_mask = data[i].properties.mask_child;

    //座標標籤顏色判斷
    //pulsingIcon加入判斷中
    //皆大於100時會出現跳動圖示
		if (data[i].properties.mask_adult == 0) {
			mask = redIcon;
		} else if (A_mask >= 100 && C_mask >=100) {
			mask = pulsingIcon;
		} else {
			mask = greenIcon;
		}
		//口罩數量顏色判斷
		if(A_mask > 0){
			jsmask_Adult = 'blue';
		}else{
			jsmask_Adult = 'gray';
		}
		
		if(C_mask > 0){
			jsmask_Child = 'orange';
		}else{
			jsmask_Child = 'gray';
		}  
		
		let marker = L.marker([data[i].geometry.coordinates[1],data[i].geometry.coordinates[0]], {icon: mask});
		//將 marker 放到 pharmacyMarker 物件
		pharmacyMarker[data[i].properties.id] = marker;
		marker.bindPopup(
			`<div id="js_marker_detail">
				<h3 id="name">${data[i].properties.name}</h3>
				<p id="address">${data[i].properties.address}</p>
				<p id="phone">${data[i].properties.phone}</p>                
			</div>
			<div class="maskboth">
				<div class="jsmask_adult ${jsmask_Adult}">
					<div class="adult">成人口罩</div>
					<div class="number">${data[i].properties.mask_adult}</div>
				</div>
				<div class="jsmask_child ${jsmask_Child}">
					<div class="child">兒童口罩</div>
					<div class="number">${data[i].properties.mask_child}</div>
				</div>
			</div>`
		);
		markers.addLayer(marker);
	}
	map.addLayer(markers);
}
//從數據內取大人與兒童口罩的資料
function maskcolor(){
    let mask_adult = document.querySelectorAll(`.mask_adult`);
    let mask_child =  document.querySelectorAll(`.mask_child`);
    // console.log(mask_adult);
    
    //設定>0,==0時成人兒童口罩的背景色更換
    for (let i =0; i<mask_adult.length;i++){
        let tmp = mask_adult[i].innerText.slice(4);
        if(tmp > 0){
            mask_adult[i].className = 'mask blue';
        }else if(tmp == 0){  
            mask_adult[i].className = 'mask gray';
        }
    }
    for (let i =0; i<mask_child.length;i++){
        let abc = mask_child[i].innerText.slice(4) ;
        if(abc > 0){
            mask_child[i].className = 'mask orange';
        }else if(abc == 0){
            mask_child[i].className = 'mask gray';
        }
    }
}

//取得當下日期
function today(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1
    var yyyy = today.getFullYear();
    var day = today.getDay();
    today = yyyy+'-'+mm+'-'+dd;
    //console.log(today);
    document.getElementById("today1").textContent = today;
}
today();

//取得當下"星期"
function week1 (){
    var day_list = ['日', '一', '二', '三', '四', '五', '六'];
    var date = new Date();
    var day  = date.getDay(); // or "new Date().getDay()";
    var weekday = '星期' + day_list[day];
    document.getElementById("week1").textContent = weekday ;

}
week1();//////////叫他出來


//依照日期顯示尾數不同的人能購買口罩
function idfinal(){
    var date = new Date();
    var day  = date.getDay(); // or "new Date().getDay()";
    var single = '1'+'.'+'3'+'.'+'5'+'.'+'7'+'.'+'9';
    var plural = '2'+'.'+'4'+'.'+'6'+'.'+'8'+'.'+'0';
    if (day == 1|| day == 3|| day == 5|| day==0){
        // console.log(day);
        var idfinal = single;
        
    } else{
        // console.log(day)
        var idfinal = plural;
    }

    document.getElementsByClassName("idfinal")[0].textContent = idfinal 
    //getElementsByClassName,加s取的會是陣列,可取用數個同名的class[<><><>]
    // getElementById 取用id,表唯一
}
idfinal();

//營業時間篩選
function opentime (data) {
    data.forEach(v=>{
        let timeObj = {};
        let dayArr = v.properties.available.split(`、`);
        let open = dayArr.filter(v=>v.search(`看診`) != -1);
        open = getDate(open);
        let close = dayArr.filter(v=>v.search(`休診`) != -1);
        // close = banana(close);
        timeObj.open = open;
        timeObj.close = close;
        v.properties.available = timeObj;
    });
    //console.log(data);
    // console.log(arr);
    return data
}

    function getDate(data) {
    let obj = {};
    function getToday(data2, day) {
        let unMatch = [];
        let match = data2.filter(v=>{
            if (v.search(day) == -1) {
                unMatch.push(v);
            }
            return v.search(day) != -1
        });
        data = unMatch;
        return match
    }
    let Mon = getToday(data, `星期一`);
    Mon = gatDay(Mon);
    let Tue = getToday(data, `星期二`);
    Tue = gatDay(Tue);
    let Wen = getToday(data, `星期三`);
    Wen = gatDay(Wen);
    let Tur = getToday(data, `星期四`);
    Tur = gatDay(Tur);
    let Fri = getToday(data, `星期五`);
    Fri = gatDay(Fri);
    let Sat = getToday(data, `星期六`);
    Sat = gatDay(Sat);
    let Sun = getToday(data, `星期日`);
    Sun = gatDay(Sun);
    obj.mon = Mon;
    obj.tue = Tue;
    obj.wen = Wen;
    obj.tur = Tur;
    obj.fri = Fri;
    obj.sat = Sat;
    obj.sun = Sun;
    // console.log(obj)
    return obj
    // // console.log(obj)
    }

    function gatDay(day){
        let arr = day.map(v=>{
            return v.substr(3,2);
        })
        return arr.join(`,`);
    }
    
    let d = new Date();
        d = d.getDay();
        switch (d) {
            case 1:
                d = 'mon';
                break
            case 2:
                d = 'tue';
                break
            case 3:
                d = 'wen';
                break
            case 4:
                d = 'tur';
                break
            case 5:
                d = 'fri';
                break
            case 6:
                d = 'sat';
                break
            case 7:
                d = 'sun';
                break
        }
// console.log(d);

//Loading效果
$(document).ready(function(){
  $(window).load(function(){  //load函数
      // $("#loading").hide();
      // $("#loading").show();
  });
});

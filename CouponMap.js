
//map DOM & 中心座標
var map = L.map('mapid', {
    center: [24.793314, 121.014016],
    zoom: 16
});

//底層圖資
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {
    foo: 'bar', attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
}).addTo(map);



//Marker Icon顏色調整
  function getColor(color){
    return (new L.Icon({
        iconUrl: `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      }))
  }
//匯入Cluster功能
let markers = new L.MarkerClusterGroup().addTo(map);
let Coupon;

//AJAX取得口罩資料
let Cities = document.querySelector('.Cities');
let list = document.querySelector('.list');



axios.get('https://3000.gov.tw/hpgapi-openmap/api/getPostData')
    .then((res)=>{
        Coupon = res.data;
        console.log(Coupon);
        let rawArea =[];
        //加上Marker
        for(let i=0; i<Coupon.length; i++){
            // Area2.add(Coupon[i].hsnNm)
            rawArea.push(Coupon[i].hsnNm);
            let color;
            if(Coupon[i].total == 0){color = 'red'}else{color = 'green'}
            markers.addLayer(L.marker([Coupon[i].latitude,Coupon[i].longitude],{ icon: getColor(color)})
            .bindPopup(`
            <p>分局代號:${Coupon[i].storeCd}</p>
            <p>地址:${Coupon[i].addr}</p>
            <p>電話:${Coupon[i].tel}</p>
            <p class="coupword bg-warning p-2 w-75 text-center">振興券存量:${Coupon[i].total}</p>
            </li>
            `)
            .openPopup());
        } 
        map.addLayer(markers);
        //取得所有地區(不重複)
        let Area = [];
        rawArea.forEach((item)=>{
            if(Area.indexOf(item)==-1 && item!==""){
                Area.push(item);
            }
        })
        console.log(Area);
        for(let i=0; i<Area.length; i++){
            Cities.innerHTML += 
            `<option value="${Area[i]}">${Area[i]}</option>`;
        }
        Cities.addEventListener('change',(e)=>{
            console.log(e.target.value)
            let location = '';
            str = '';
            Coupon.forEach((item)=>{
                if(item.hsnNm == e.target.value){
                    location = [item.latitude,item.longitude];        
                    str +=
                    `<li>
                    <p>分局代號:${item.storeCd}</p>
                    <p>地址:${item.addr}</p>
                    <p>電話:${item.tel}</p>
                    <p class="coupword bg-warning p-2 w-50 text-center">振興券存量:${item.total}</p>
                    </li>`
                }
            })
            map.panTo(location, 12)
            list.innerHTML = str;
        })
    })
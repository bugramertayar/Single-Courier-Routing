class Request {

    get(url){ // Get Request
        return new Promise((resolve,reject)=>{
            fetch(url)
            .then(response => response.json())
            .then(data => resolve(data))
            .catch(err => reject(err));

        })

        
    }
    post(url,data){

        return new Promise((resolve,reject) => {
            fetch(url,{
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    "accept": "application/json",
                    "Content-type": "application/json; charset=UTF-8",
                }
            })
            .then(response => response.json())
            .then(data => resolve(data))
            .catch(err => reject(err));


        })
        

    }


}

const request = new Request();



const distanceResult=document.getElementById("distanceResult");
const outputUrl=document.getElementById("urlLink");
const roads=document.getElementById("roads");
const mainDiv=document.getElementById("main");


const button=document.getElementById("calculate");
button.addEventListener("click",calculateRoute);


        const startLocation=document.getElementById("startLocation");
        const firstLocation=document.getElementById("firstLocation");
        const secondLocation=document.getElementById("secondLocation");
        const thirdLocation=document.getElementById("thirdLocation");
        const forthLocation=document.getElementById("forthLocation");
        const fifthLocation=document.getElementById("fifthLocation");


let payload;

 function getValuesFromUI(){

       

        let depotLat=parseFloat((startLocation.options[startLocation.selectedIndex].value).split(",")[0]);
        let depotLon=parseFloat((startLocation.options[startLocation.selectedIndex].value).split(",")[1]);
        let firstLat= parseFloat((firstLocation.options[firstLocation.selectedIndex].value).split(",")[0]);
        let firstLon=parseFloat((firstLocation.options[firstLocation.selectedIndex].value).split(",")[1]);
        let secondLat=parseFloat((secondLocation.options[secondLocation.selectedIndex].value).split(",")[0]);
        let secondLon=parseFloat((secondLocation.options[secondLocation.selectedIndex].value).split(",")[1]);
        let thirdLat=parseFloat((thirdLocation.options[thirdLocation.selectedIndex].value).split(",")[0]);
        let thirdLon=parseFloat((thirdLocation.options[thirdLocation.selectedIndex].value).split(",")[1]);
        let fourthLat=parseFloat((forthLocation.options[forthLocation.selectedIndex].value).split(",")[0]);
        let fourthLon= parseFloat((forthLocation.options[forthLocation.selectedIndex].value).split(",")[1]);
        let fifthLat=parseFloat((fifthLocation.options[fifthLocation.selectedIndex].value).split(",")[0]);
        let fifthLon=parseFloat((fifthLocation.options[fifthLocation.selectedIndex].value).split(",")[1]);

        payload = {
            'depot': {'id': 0, 'time_window': '07:00-23:59', 'point': {'lat':depotLat , 'lon':depotLon} },
            'locations': [
                {'id': 1, 'time_window': '09:00-20:00', 'point': {'lat':firstLat , 'lon':firstLon }},
                {'id': 2, 'time_window': '15:00-20:00', 'point': {'lat': secondLat, 'lon':secondLon }},
                {'id': 3, 'time_window': '12:00-15:00', 'point': {'lat': thirdLat, 'lon': thirdLon}},
                {'id': 4, 'time_window': '09:00-15:00', 'point': {'lat':fourthLat , 'lon':fourthLon}},
                {'id': 5, 'time_window': '15:00-20:00', 'point': {'lat': fifthLat, 'lon': fifthLon}},
            ],
            'vehicle': {'id': 0},
            'options': {'time_zone': 3}
        };

}





function calculateRoute(){
    getValuesFromUI();
    request.post("https://cors-anywhere.herokuapp.com/https://courier.common.yandex.ru/vrs/api/v1/add/svrp?apikey=f52307fd-ad00-4284-acdf-cf5c38ec6c0b",payload)
    .then(newAlbum => request.get(`https://cors-anywhere.herokuapp.com/https://courier.common.yandex.ru/vrs/api/v1/result/svrp/${newAlbum.id}`))
    .then(data1=>request.get(`https://cors-anywhere.herokuapp.com/https://courier.common.yandex.ru/vrs/api/v1/result/svrp/${data1.id}`) )
    .then(data2=>{
        for (route of data2.result.routes) {
            let distance_km =
                (route.metrics.total_transit_distance_m / 1000).toFixed(2)
            // console.log(`Vehicle ${route.vehicle_id} route: ${distance_km}km`);
    
            distanceResult.value=distance_km+" km";
    
             for (waypoint of route.route) {
                    let type = waypoint.node.type;
                    let id = waypoint.node.value.id;
                    let eta = new Date(waypoint.arrival_time_s * 1000).toISOString().substr(11, 8);
                    let distance_km = (waypoint.transit_distance_m / 1000).toFixed(2);
                    
                    let p=document.createElement("p");
                    p.textContent=`  ${type} ${id} at ${eta}, ${distance_km}km driving `;
                    roads.appendChild(p);

                    console.log(`  ${type} ${id} at ${eta}, ${distance_km}km driving `);
                }
        
                // Returns the route link in Yandex.Maps.
                let yamaps_url = 'https://yandex.ru/maps/?mode=routes&rtext='
                for (waypoint of route.route) {
                    let point = waypoint.node.value.point;
                    yamaps_url += `${point.lat}%2c${point.lon}~`;
                }
        
                // console.log('\nSee route on Yandex.Maps:\n', yamaps_url)
                outputUrl.textContent=yamaps_url;
                outputUrl.href=yamaps_url;
        }
    
    }).catch(err=>{
        let alertDanger=document.createElement("div");
        alertDanger.className="alert alert-info";
        alertDanger.role="alert";
        alertDanger.textContent="An error occurred... Try again";
        mainDiv.appendChild(alertDanger);
    });
}


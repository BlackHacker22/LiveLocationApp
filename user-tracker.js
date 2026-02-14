let userMarker;

function requestLocationPermission() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(()=>{}, ()=>alert("Allow location."));
    }
}

function startAutoTracking(username) {
    requestLocationPermission();
    if(navigator.geolocation){
        navigator.geolocation.watchPosition((pos)=>{
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            firebase.database().ref("locations/" + username).set({
                lat, lng, timestamp: Date.now()
            });

            if(window.map){
                if(userMarker) userMarker.setPosition({lat,lng});
                else{
                    userMarker = new google.maps.Marker({
                        position:{lat,lng},
                        map: map,
                        title: username,
                        icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                    });
                    map.setCenter({lat,lng});
                }
            }
        }, (err)=>console.error(err), {enableHighAccuracy:true});
    }
}

function initMap(){
    window.map = new google.maps.Map(document.getElementById('map'), {
        center:{lat:23.8103,lng:90.4125}, zoom:12
    });
}

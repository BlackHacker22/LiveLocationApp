let userMarker;

function requestLocationPermission() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => console.log("Location permission granted"),
            (error) => {
                console.error("Location permission denied", error);
                alert("Please allow location access to track your position.");
            }
        );
    } else {
        alert("Geolocation not supported by this browser.");
    }
}

function startAutoTracking(username) {
    requestLocationPermission();

    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                firebase.database().ref("locations/" + username).set({
                    lat: lat,
                    lng: lng,
                    timestamp: Date.now()
                });

                if(window.map){
                    if(userMarker){
                        userMarker.setPosition({lat, lng});
                    } else {
                        userMarker = new google.maps.Marker({
                            position: {lat, lng},
                            map: map,
                            title: username,
                            icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                        });
                        map.setCenter({lat, lng});
                    }
                }
            },
            (error) => console.error(error),
            { enableHighAccuracy: true, maximumAge: 10000 }
        );
    } else {
        alert("Geolocation not supported by browser");
    }
}

function initMap() {
    window.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 23.8103, lng: 90.4125},
        zoom: 12
    });
}

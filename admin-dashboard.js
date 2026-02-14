let userMarkers = [];

function initAdminMap() {
    initMap();
}

function listenAllUsersLocation() {
    const userListDiv = document.getElementById("userList");
    firebase.database().ref("locations").on("value", snapshot => {
        const locations = snapshot.val();
        userListDiv.innerHTML = "";

        userMarkers.forEach(m => m.setMap(null));
        userMarkers = [];

        for(const user in locations){
            const loc = locations[user];
            const marker = new google.maps.Marker({
                position: {lat: loc.lat, lng: loc.lng},
                map: map,
                title: user,
                icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
            });
            userMarkers.push(marker);

            userListDiv.innerHTML += `<p>${user}: ${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}</p>`;
        }
    });
}

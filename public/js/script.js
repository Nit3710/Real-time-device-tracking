const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (pos) => {
            const { latitude, longitude } = pos.coords;

            // Send the user's location to the server
            socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
            console.error("Geolocation error:", error);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000,
        }
    );
}

// Initialize the map
const map = L.map("map").setView([0, 0], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "OpenStreetMap contributors",
}).addTo(map);

// Object to store markers for users
const markers = {};

// Listen for location updates from other users
socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;

    // Check if a marker for this user already exists
    if (markers[id]) {
        // Update the existing marker's position
        markers[id].setLatLng([latitude, longitude]);
    } else {
        // Create a new marker for the user
        markers[id] = L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup(`User ${id}`)
            .openPopup();
    }

    // Optionally set the map's view to the latest location
    map.setView([latitude, longitude], 15);
});

socket.on("user-disconnected", (id) => {
    // Remove the marker for the disconnected user
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
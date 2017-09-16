/* global jQuery, google, initial_markers */
'use strict';

var map;
var markers = [];

/*
 * Callback function that initialize the google maps with initial markers and sets click listener
 */
function initMap() {
    var initialCenter = {lat: 47.3769, lng: 8.5417}; // Zürich Coordinates :)
    map = new google.maps.Map(document.getElementById('map'), {
        center: initialCenter,
        zoom: 9
    });

    window.geocoder = new google.maps.Geocoder();
    initial_markers.forEach(function (marker) {
        addMarker(marker.location, marker.title);
    });
    showMarkers();

    connect_address_click_listener(map);
}

function addMarker(location, title) {
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        title: title
    });
    markers.push(marker);
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAll(null);
}
// Shows any markers currently in the array.
function showMarkers() {
    setMapOnAll(map);
}
// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    markers = [];
}

// Function that adds click listener to map and (valid) addresses to fusion table and db
function connect_address_click_listener(map) {
    google.maps.event.addListener(map, 'click', function (event) {
        $('.spinner').spin();
        geocoder.geocode({
            'latLng': event.latLng
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results.length < 1) {
                    $('.spinner').spin(false);
                    return;
                }

                var location_type = results[0].geometry.location_type;
                if (location_type !== 'ROOFTOP' && location_type !== 'GEOMETRIC_CENTER') {
                    $('.spinner').spin(false);
                    alert('Not a valid address');
                    return;
                }

                var location = results[0].geometry.location;
                var address = results[0].formatted_address;
                $.ajax({
                    dataType: 'json',
                    url: 'addresses/create',
                    data: {
                        'lat': location.lat(),
                        'lng': location.lng(),
                        'address': address
                    },
                    success: function (data) {
                        if (data.result === 'ok') {
                            map.setCenter(location);
                            addMarker(location, address);
                            $('.visited-addresses').append('<li><span>' + address + ' - (' + location.lat() + ', ' +
                                location.lng() +')</span></li>');
                            $('.spinner').spin(false);
                        } else {
                            $('.spinner').spin(false);
                            alert(data.result);
                        }
                    }
                });
            } else {
                alert('Not a valid address');
            }
        });

    });
}

(function ($) {
    $(document).ready(function () {
        $('button').on('click', function (ev) {
            ev.preventDefault();
            $('.spinner').spin();
            deleteMarkers();
            $.ajax({
                dataType: 'json',
                url: 'addresses/remove_all',
                success: function () {
                    $('.visited-addresses').empty();
                    $('.spinner').spin(false);
                }
            });
        });
        initMap(); // Just to make sure that map loads on a first try (without reload)
    });
})(jQuery);

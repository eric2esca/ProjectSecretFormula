// Initialize Firebase
// 1. Initialize Firebase
  var config = {
    apiKey: "AIzaSyCBmdSwWMcDk9m6lolLxaLvPLXd7_k2QPY",
    authDomain: "recipe-website-e376f.firebaseapp.com",
    databaseURL: "https://recipe-website-e376f.firebaseio.com",
    projectId: "recipe-website-e376f",
    storageBucket: "",
    messagingSenderId: "310605823696"
  };
  firebase.initializeApp(config);

  var database = firebase.database();
  //----------------------------------------------------------------
  var recipes = [];
$("#search-box").submit(function(event) {
	// Get the search data from the form
	var searchText = $("#search").val().trim();
  var maxResults = 15;
	// Debugging, log what we are looking for
	// console.log("Searching for " + searchText);

	// Performing GET requests to the recipe API and logging the responses to the console    
	$.ajax({
			url: "https://api.edamam.com/search?q=" + searchText + "&to=" + maxResults + "&app_id=a5adb2d9&app_key=bbbb6d6a60ed99b20528ac9c372c5a9c",
			method: "GET"
	}).done(function(response) {
			// console.log(response);

			// Storing the data from the AJAX request in the results variable
			var results = response.hits;
			recipes = response.hits;
			results.forEach( function(recipe) {
				console.log(recipe)
				var columnDiv = $("<div>").addClass("grid col-lg-4 col-md-6");
				var cardDiv = $("<div>").addClass("card");
				var image = $("<img>").attr("src", recipe.recipe.image);
				image.addClass("card-img-top");
				var cardTitle = $("<h3>").text(recipe.recipe.label).addClass("card-title");
				var list = $("<ul>").addClass("list-group list-group-flush");
				recipe.recipe.ingredientLines.forEach(function(line) {
					var il = $("<il>").text(line).addClass("list-group-item");
					list.append(il);
				});
				var btn = $("<a></a>").addClass("btn btn-primary").attr("href", recipe.recipe.url).attr("target", "_blank").text("more details");
				var btn2 = $("<a></a>").addClass("btn btn-primary bookmark").text("bookmark");

				//2. Button for adding BOOKMARK
  				$(".bookmark").on("click", function(event)
  				{
  					event.preventDefault();

  					//grabs api inputs
  					var recipeImage = image;
  					var recipeLabel = cardTitle;
  					var recipeingredients = list;
  					var recipeurl = btn;

  					//creates a local temporary object for holding recipe data
					var info = 
					{
						recipeImage: recipeImage,
						recipeLabel: recipeLabel,
						recipeingredients: recipeingredients,
						recipeurl: btn
					};

					//uploads recipe data to the database
					database.ref().push(info);

					//logs everything to the console
					console.log(info.recipeImage);
					console.log(info.recipeLabel);
					console.log(info.recipeingredients);
					console.log(info.recipeurl);

					//test alert to see if this is working
					alert("firebase is alive");

					//3. Create Firebase event for bookmarks
					database.ref().on("child_added", function(childSnapshot, prevChildKey) 
					{
						console.log(childSnapshot.val());

						//store everything into variables
						//var  = childSnapshot.val().


					});


				cardDiv.append(image).append(cardTitle).append(list).append(btn).append(btn2);
				columnDiv.append(cardDiv);
				$("#recipe-here").prepend(columnDiv);
				//$("#recipe-here").append('<div class="btn btn-default">Book Mark</div');
			});

			

			// for (var i = 0; i < results.length; i++) {

			// 		// Creating and storing a div tag
			// 		var recipeDiv = $("<div>");

			// 		// Creating and storing an image tag
			// 		var recipeImage = $("<img>");

			// 		// Setting the src attribute of the image to a property pulled off the result item
			// 		recipeImage.attr("src", results[i].recipe.image);

			// 		// Creating and storing recipe in a paragraph
			// 		var recipeList = $("<p>").text("Recipe: " + results[i].recipe.label);

			// 		// Creating and storing nutrient list in a paragraph
			// 		var nutrientList = $("<p>").text(results[i].recipe.healthLabels);

			// 		//Prep instructions
			// 		var prepInstructions = $("<p>").text(results[i].recipe.url);


			// 		// Appending the paragraph and image tag to the recipeDiv
			// 		recipeDiv.append(recipeList);
			// 		recipeDiv.append(prepInstructions);
			// 		recipeDiv.append(nutrientList);
			// 		recipeDiv.append(recipeImage);

			// 		// Creating element for ingredients
			// 		var ingredientInfo = results[i].recipe.ingredientLines;
			// 		for (var j = 0; j < ingredientInfo.length; j++) {
			// 				recipeDiv.append($("<p>").text(ingredientInfo[j]));
			// 		}



			// 		// Prependng the recipe to the HTML page in the "#recipe-here" div
			// 		$("#recipe-here").prepend(recipeDiv);
			// }

	});

	// Prevents the page from reloading after the AJAX call.
	event.preventDefault();
});
});

var map;
var infowindow;
var restaurants = [];

var restaurantName;
var restaurantAddress;
var restaurantRating;
var restaurantPrice;

var groupName;
var groupDate;
var groupParticipants;
var groupTime;
var groupTheme;




$(".overlay").hide();

function initMap() {
	var pyrmont = { lat: 41.896294, lng: -87.618799 };

	map = new google.maps.Map(document.getElementById('map'), {
			center: pyrmont,
			zoom: 15
	});

	infowindow = new google.maps.InfoWindow();
	var service = new google.maps.places.PlacesService(map);
	service.nearbySearch({
			location: pyrmont,
			radius: 800,
			type: ['restaurant']
	}, callback);
}

function callback(results, status) {
	if (status === google.maps.places.PlacesServiceStatus.OK) {
			for (var i = 0; i < results.length; i++) {
					var label0 = i + 1;
					var label = label0.toString();
					var id = "restaurant" + label;

					createMarker(results[i], label);

					$("#well").append(
							"<h2>" + label + ": " + results[i].name + "</h2>" +
							"<p><strong>Rating: </strong>" + results[i].rating + "</p>" +
							"<p><strong>Price Level: </strong>" + results[i].price_level + "</p>" +
							"<p><strong>Address: </strong>" + results[i].vicinity + "</p>" +
							"<button id='" + id + "'>Select Restaurant</button>" +
							"<br>");

					createClickEvent(id, i);

					updateRestaurantsList(results[i]);
			}
	}
}

function createMarker(place, label) {
	var placeLoc = place.geometry.location;
	var marker = new google.maps.Marker({
			map: map,
			position: place.geometry.location,
			label: label
	});

	google.maps.event.addListener(marker, 'click', function() {
			infowindow.setContent(place.name);
			infowindow.open(map, this);
	});
}

function createClickEvent(id, i) {
	$("#" + id).on("click", function() {
			$(".overlay").show();

			restaurantName = restaurants[i].name;
			restaurantAddress = restaurants[i].address;
			restaurantRating = restaurants[i].rating;
			restaurantPrice = restaurants[i].price;

			console.log(restaurantName, restaurantAddress, restaurantRating, restaurantPrice);

	});
}


function updateRestaurantsList(results) {
	restaurants.push({
			"name": results.name,
			"rating": results.rating,
			"price": results.price_level,
			"address": results.vicinity
	});
}


$("#createGroupBtn").on("click", function(event) {

	event.preventDefault();

	groupName = $("#groupName").val();
	groupDate = $("#groupDate").val();
	groupParticipants = $("#groupParticipants").val();
	groupTime = $("#groupTime").val();
	groupTheme = $("#groupTheme").val();

	// window.location.href = "myGroups.html";

	console.log(groupName, groupDate, groupParticipants, groupTime, groupTheme);

});
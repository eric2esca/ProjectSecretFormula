var recipes = [];
var counter = 0;
var cardDivArray = [];
var results;


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
			results = response.hits;
			counter = 0; // attribute value assigned to each dynamic group of recipe elements
			cardDivArray = []; 

			results.forEach( function(recipe) { 
				// console.log(recipe)
				var columnDiv = $("<div>").addClass("grid col-lg-4 col-md-6");
				var cardDiv = $("<div>").addClass("card").attr("id",counter); //Eric added attr id counter
				var image = $("<img>").attr("src", recipe.recipe.image);
				image.addClass("card-img-top");
				var cardTitle = $("<h3>").text(recipe.recipe.label).addClass("card-title");
				var list = $("<ul>").addClass("list-group list-group-flush");
				recipe.recipe.ingredientLines.forEach(function(line) {
					var il = $("<il>").text(line).addClass("list-group-item");
					list.append(il);
				});
				var btn = $("<a></a>").addClass("btn btn-primary").attr("href", recipe.recipe.url).attr("target", "_blank").text("Find out more");
				var btn2 = $("<button></button>").addClass("btn btn-primary bookmark").text("Save for later").attr("id",counter);

				cardDiv.append(image).append(cardTitle).append(list).append(btn).append(btn2);
				columnDiv.append(cardDiv);
				$("#recipe-here").prepend(columnDiv);
				cardDivArray.push(recipe);
				counter++;
			});
	});

	// Prevents the page from reloading after the AJAX call.
	event.preventDefault();

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
        results = response.hits;
        counter = 0; // attribute value assigned to each dynamic group of recipe elements
        cardDivArray = [];

        results.forEach(function(recipe) {
            // console.log(recipe)
            var columnDiv = $("<div>").addClass("grid col-lg-4 col-md-6");
            var cardDiv = $("<div>").addClass("card").attr("id", counter); //Eric added attr id counter
            var image = $("<img>").attr("src", recipe.recipe.image);
            image.addClass("card-img-top");
            var cardTitle = $("<h3>").text(recipe.recipe.label).addClass("card-title");
            var list = $("<ul>").addClass("list-group list-group-flush");
            recipe.recipe.ingredientLines.forEach(function(line) {
                var il = $("<il>").text(line).addClass("list-group-item");
                list.append(il);
            });
            var btn = $("<a></a>").addClass("btn btn-primary").attr("href", recipe.recipe.url).attr("target", "_blank").text("Get the recipe!");
            var btn2 = $("<button></button>").addClass("btn btn-primary bookmark").text("bookmark").attr("id", counter);

            cardDiv.append(image).append(cardTitle).append(list).append(btn).append(btn2);
            columnDiv.append(cardDiv);
            $("#recipe-here").prepend(columnDiv);
            cardDivArray.push(recipe);
            counter++;
        });
    });

    // Prevents the page from reloading after the AJAX call.
    event.preventDefault();

});


// Initialize Firebase
//1. Initialize Firebase

var config = {
    apiKey: "AIzaSyCBmdSwWMcDk9m6lolLxaLvPLXd7_k2QPY",
    authDomain: "recipe-website-e376f.firebaseapp.com",
    databaseURL: "https://recipe-website-e376f.firebaseio.com",
    projectId: "recipe-website-e376f",
    storageBucket: "recipe-website-e376f.appspot.com",
    messagingSenderId: "310605823696"
};
firebase.initializeApp(config);
var database = firebase.database();

//firebase value label holders
var img_fire;
var label_fire;
var ingredients_fireArray = [];
var url_fire;
var calories_fire;
var protien_fire;
var fat_fire;
var carb_fire;

//click event

$(document).on("click", ".bookmark", function(event){
	var bookMarkID = $(this).attr("id");

	img_fire = results[bookMarkID].recipe.image;
	label_fire = results[bookMarkID].recipe.label;
	//-----------------------------------------------------------------------
	for(var x = 0; x < results[bookMarkID].recipe.ingredients.length ; x++){
		var ingredients_fire = results[bookMarkID].recipe.ingredientLines[x];
		ingredients_fireArray.push(ingredients_fire);
	}
	//------------------------------------------------------------------------
	url_fire = results[bookMarkID].recipe.url;
	calories_fire = results[bookMarkID].recipe.calories;
	protien_fire = results[bookMarkID].recipe.totalNutrients.PROCNT.quantity; //for future development
	fat_fire = results[bookMarkID].recipe.totalNutrients.FAT.quantity;		  //for future development
	carb_fire = results[bookMarkID].recipe.totalNutrients.CHOCDF.quantity;	  //for future development
	
	//adds temporary object to hold everything in firebase
	var firebaseObject = {
		image: img_fire,
		title: label_fire,
		ingredients: ingredients_fireArray,
		instructions: url_fire,
		calories: calories_fire,
		protien: protien_fire,
		fat: fat_fire,
		carbs: carb_fire
	}
	console.log(firebaseObject);
	console.log(results[bookMarkID]);

	// Uploads employee data to the database
  	database.ref().push(firebaseObject);

  	//send to bookmark tab
  	database.ref().on("child_added", function(childSnapshot) {
  		img_fire = childSnapshot.val().image;
  		label_fire = childSnapshot.val().title;
  		ingredients_fireArray = childSnapshot.val().ingredients;
  		url_fire = childSnapshot.val().instructions;
  		//console.log(img_fire);
  	});

  	//Append bookmarks dynamically to recipe section
  	var columnDiv1 = $("<div>").addClass("grid col-lg-4 col-md-6");
  	var cardDiv1 = $("<div>").addClass("card");
  	var image1 = $("<img>").attr("src", img_fire);//--------Add----firebaseImageUrl
  	image1.addClass("card-img-top");
  	var cardTitle1 = $("<h3>").text(label_fire).addClass("card-title");
  	//var list1 = $("<ul>").addClass("list-group list-group-flush");
  	var btn1 = $("<a></a>").addClass("btn btn-primary").attr("href", url_fire).attr("target", "_blank").text("Find out more");
  	cardDiv1.append(image1).append(cardTitle1).append(btn1);
		columnDiv1.append(cardDiv1);

$(document).on("click", ".bookmark", function(event) {
    var bookMarkID = $(this).attr("id");

    img_fire = results[bookMarkID].recipe.image;
    label_fire = results[bookMarkID].recipe.label;
    //-----------------------------------------------------------------------
    for (var x = 0; x < results[bookMarkID].recipe.ingredients.length; x++) {
        var ingredients_fire = results[bookMarkID].recipe.ingredientLines[x];
        ingredients_fireArray.push(ingredients_fire);
    }
    //------------------------------------------------------------------------
    url_fire = results[bookMarkID].recipe.url;
    calories_fire = results[bookMarkID].recipe.calories;
    protien_fire = results[bookMarkID].recipe.totalNutrients.PROCNT.quantity; //for future development
    fat_fire = results[bookMarkID].recipe.totalNutrients.FAT.quantity; //for future development
    carb_fire = results[bookMarkID].recipe.totalNutrients.CHOCDF.quantity; //for future development

    //adds temporary object to hold everything in firebase
    var firebaseObject = {
        image: img_fire,
        title: label_fire,
        ingredients: ingredients_fireArray,
        instructions: url_fire,
        calories: calories_fire,
        protien: protien_fire,
        fat: fat_fire,
        carbs: carb_fire
    }
    console.log(firebaseObject);
    console.log(results[bookMarkID]);

    // Uploads employee data to the database
    database.ref().push(firebaseObject);

    //send to bookmark tab
    database.ref().on("child_added", function(childSnapshot) {
        img_fire = childSnapshot.val().image;
        label_fire = childSnapshot.val().title;
        ingredients_fireArray = childSnapshot.val().ingredients;
        url_fire = childSnapshot.val().instructions;
        console.log(img_fire);
    });

    //Append bookmarks dynamically to recipe section
    var columnDiv1 = $("<div>").addClass("grid col-lg-4 col-md-6");
    var cardDiv1 = $("<div>").addClass("card");
    var image1 = $("<img>").attr("src", img_fire); //--------Add----firebaseImageUrl
    image1.addClass("card-img-top");
    var cardTitle1 = $("<h3>").text(label_fire).addClass("card-title");
    //var list1 = $("<ul>").addClass("list-group list-group-flush");
    var btn1 = $("<a></a>").addClass("btn btn-primary").attr("href", url_fire).attr("target", "_blank").text("Find out more");
    cardDiv1.append(image1).append(cardTitle1).append(btn1);
    columnDiv1.append(cardDiv1);

    $("#bookmarksAdded").prepend(columnDiv1);
});

$(document).on('click', '.bookmark', function() {
    console.log('We made it!')
});

var map;
var infowindow;
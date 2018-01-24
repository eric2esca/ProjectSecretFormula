//----------------------------------------------------------------
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
        counter = 0;
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
    storageBucket: "",
    messagingSenderId: "310605823696"
};

//firebase.initializeApp(config);

//var database = firebase.database();

//click event
$(document).on("click", ".bookmark", function(event) {
    var bookMarkID = $(this).attr("id");
    console.log(results[bookMarkID]);
});

$(document).on('click', '.bookmark', function() {
    console.log('We made it!')
});

var map;
var infowindow;
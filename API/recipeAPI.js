        $("#search-box").submit(function(event) {
            // Get the search data from the form
            var searchText = $("#search").val();

            // Debugging, log what we are looking for
            console.log("Searching for " + searchText);

            // Performing GET requests to the recipe API and logging the responses to the console    
            $.ajax({
                url: "https://api.edamam.com/search?q=" + searchText + "&app_id=a5adb2d9&app_key=bbbb6d6a60ed99b20528ac9c372c5a9c",
                method: "GET"
            }).done(function(response) {
                console.log(response);

                // Google places API
                // $.ajax({
                //     url: "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=500&type=restaurant&keyword=cruise&key=AIzaSyDSYIY3_YzWDSDew4jVIB5TVYty8-wESxA",
                //     method: "GET"
                // }).done(function(response) {
                //     console.log(response);
                // });

                // Storing the data from the AJAX request in the results variable
                var results = response.hits;

                for (var i = 0; i < results.length; i++) {

                    // Creating and storing a div tag
                    var recipeDiv = $("<div>");

                    // Creating and storing an image tag
                    var recipeImage = $("<img>");

                    // Setting the src attribute of the image to a property pulled off the result item
                    recipeImage.attr("src", results[i].recipe.image);

                    // Creating and storing recipe in a paragraph
                    var recipeList = $("<p>").text("Recipe: " + results[i].recipe.label);

                    // Creating and storing nutrient list in a paragraph
                    var nutrientList = $("<p>").text(results[i].recipe.healthLabels);

                    //Prep instructions
                    var prepInstructions = $("<p>").text(results[i].recipe.url);


                    // Appending the paragraph and image tag to the recipeDiv
                    recipeDiv.append(recipeList);
                    recipeDiv.append(prepInstructions);
                    recipeDiv.append(nutrientList);
                    recipeDiv.append(recipeImage);

                    // Creating element for ingredients
                    var ingredientInfo = results[i].recipe.ingredientLines;
                    for (var j = 0; j < ingredientInfo.length; j++) {
                        recipeDiv.append($("<p>").text(ingredientInfo[j]));
                    }



                    // Prependng the recipe to the HTML page in the "#recipe-here" div
                    $("#recipe-here").prepend(recipeDiv);
                }

            });

            // Prevents the page from reloading after the AJAX call.
            event.preventDefault();
        });

        // Google Places search functionality
        function activatePlacesSearch() {
            var input = document.getElementById('map-search');
            var autocomplete = new google.maps.places.Autocomplete(input);
        }
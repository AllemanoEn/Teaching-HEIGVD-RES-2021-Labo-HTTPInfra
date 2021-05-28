function loadAnimals() {
		$.getJSON( "/api/students/", function( animals ) {
		console.log(animals);
		var message = "Nobody is here";
		if ( animals.length > 0 ) {
			message = animals[0];
		}
		
		$(".em").text(message);
	});
};
	
loadAnimals();
setInterval( loadAnimals, 2000 );
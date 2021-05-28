function loadStudents() {
		$.getJSON( "/api/students/", function( students ) {
		console.log(students);
		var message = "Nobody is here";
		if ( students.length > 0 ) {
			message = students[0].firstName + " " + students[0].LastName;
		}
		
		$(".em").text(message);
	});
};
	
loadStudents();
setInterval( loadStudents, 2000 );
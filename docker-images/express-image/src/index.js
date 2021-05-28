var Chance = require('chance');
var chance = new Chance();

var express = require('express');
var app = express();

app.get('/test', function(req,res){
	res.send("Hello RES test");
});

app.get('/', function(req,res){
	res.send(generateAnimals() );
});


app.listen(3000,function(){
console.log("Accepting HTTP request on port 3000");
});

function generateAnimals() {
    var numberOfAnimals = chance.integer({
      min: 0,
      max: 10
    });
    console.log(numberOfAnimals);
    var animals = [];
    for (var i = 0; i < numberOfAnimals; i++) {
    animals.push(chance.animal());
    };
  console.log(animals);
  return animals;
}

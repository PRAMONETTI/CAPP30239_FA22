/* 
This is a javascript example for 
week 2.
*/

// this an inline comment

let num = 100; //integer

function foo () {
    let num2 = 200;
    console.log(num); // This work because num was declared at a higher level
};

// console.log(num2); This didn't work because num2 is declared inside of a function

foo(); // This is calling a function

//let anonFun = function() {
//    console.log("Hello");      <- This is an anonymous function
//};                      

let anonFun = () => console.log("Hello");

(function() {
    console.log("hi")

})();

let person = "Summer";

function people(peopleName) {
    console.log("Hello " + peopleName);
};

people(person);

let arr = ["foo", 123, ["zar", "bar"]];

console.log(arr[2]); // Indexing starts from 0 (like python)

// Set item in array

arr[1] = "barbar";

console.log(arr);

// Add item to the end of an array 

arr.push("car");

// Removing an item from the array (index, deleteCount)

arr.splice(2,1); // Translation: Go to index 2 and remove 1 element
console.log(arr);

for (let item of arr) {
    console.log(item);        // Loops!
}

for (let i in arr) {
    console.log(i + " " + arr[i]);  // Here we looped through the index,not the objects
} 

arr.forEach((item,i) => console.log(i + " " + item)); // A cleaner version of the previous loop.

let obj1 = {   // We are declaring our first object here
    name: "Jill",
    age: 85,
    job: "Cactus Huneter",
};

console.log(obj1.name);
console.log(obj1["name"]); // These 2 methods do the exact same thing

obj1.job = "Barista"; // We are setting a new job for obj1

console.log(obj1.job)

for (let key in obj1) {
    let value = obj1[key];
    console.log(`${key}: ${value}`);
}

console.log(`Hello ${obj1["name"]} ${num}!`); // string template literal

for (let i = 0; i < 10; i++) {
    console.log(i);
}

x = 35

if (x > 50) {
    console.log("Above Average");
}
else if (x > 5) {
    console.log("Below Average");
}
else {
    console.log("Really Below Average");
}

// ternary operator 

let y = (x > 50) ? "Above Average" : "Below Average";

// traverse DOM

let example = document.getElementById("example");

example.innerHTML += "Hello World!";
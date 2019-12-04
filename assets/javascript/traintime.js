// Steps Process
// 1.Create a Firebase link
// 2. Create initial train data in database 
// 3. Create button for adding new trains -> update html -> update database
// 4. Create a way to retrieve trains from the trainlist 
// 5. Create a way to calculate the time way using difference between start and current time 

// +++ Step 1  +++
// Initialize Firebase
let firebaseConfig = {
apiKey: "AIzaSyALK3Eb8Tx1fW9IprvnE6rvQaLCTChLPj0",
authDomain: "train-time-tracker-2a208.firebaseapp.com",
databaseURL: "https://train-time-tracker-2a208.firebaseio.com",
projectId: "train-time-tracker-2a208",
storageBucket: "train-time-tracker-2a208.appspot.com",
messagingSenderId: "491611444773",
appId: "1:491611444773:web:3c2f68dc38344df6eb91cc"
};

firebase.initializeApp(firebaseConfig);

let trainData = firebase.database();

// +++ Step 2 & Step 3 +++
// Populate Firebase Database with initial data (done in Firebase GUI)
// Create Buttons for adding trains
$("add-train-btn").on("click", function(event) {
    // prevent the default form submit behavior
    event.preventDefault();

    // grab user inputs
   let trainName = $("#train-name-input")
        .val()
        .trim();
   let destination = $("#destination-input")
        .val()
        .trim();
   let firstTrain = $("#first-train-input")
        .val()
        .trim();
   let frequency = $("#frequency-input")
        .val()
        .trim();

    // create a local temporary object for holding train data
   let newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency
    };

    // Uploads train data to the database
    trainData.ref().push(newTrain);

    // log everything to console just to see that it's working
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrain);
    console.log(newTrain.frequency);

    // Alert user train has been added 
    alert("Train successfully added");

    // Clear text boxes after user input
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
});

// +++ Step 4 +++
// Create a Firebase event to add trains to database and a row in the HTML when user adds entry
trainData.ref().on("child_added", function(childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());

    // store data into a variable 
    let tName = childSnapshot.val().name;
    let tDestination = childSnapshot.val().destination;
    let tFrequency = childSnapshot.val().frequency;
    let tFirstTrain = childSnapshot.val().firstTrain;

    let timeArr = tFirstTrain.split(":");
    let trainTime = moment()
        .hours(timeArr[0])
        .minutes(timeArr[1]);
    let maxMoment = moment.max(moment(), trainTime);
    let tMinutes;
    let tArrival;

    if (maxMoment === trainTime) {
        tArrival = trainTime.format("hh:mm A");
        tMinutes = trainTime.diff(moment(), "minutes");
    } else {
        let differenceTimes = moment().diff(trainTime, "minutes");
        let tRemainder = differenceTimes % tFrequency;

        tMinutes = tFrequency - tRemainder;

        tArrival = moment()
            .add(tMinutes, "m")
            .format("hh:mm A");
    }
    console.log("tMinutes:", tMinutes);
    console.log("tArrival:", tArrival);

    // Add each train's data into the table
    $("#train-table > tbody").append(
        $("<tr>").append(
            $("<td>").text(tName),
            $("<td>").text(tDestination),
            $("<td>").text(tFrequency),
            $("<td>").text(tArrival),
            $("<td>").text(tMinutes)
        )
    );
});
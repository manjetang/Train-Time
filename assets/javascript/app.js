// Initialize Firebase
var config = {
    apiKey: "AIzaSyCSTp_BzV2zQXmDpQO6OlRBL8Gb27V_8Zk",
    authDomain: "train-scheduler-6d90a.appspot.com",
    databaseURL: "https://train-scheduler-6d90a.firebaseio.com",
    storageBucket: "train-scheduler-6d90a.appspot.com",
    messagingSenderId: "727919894031"
  };
  firebase.initializeApp(config);
  var database = firebase.database();
  $('#addTrainBtn').on("click", function() {
    // take user input
    var trainName = $("#trainNameInput").val().trim();
    var destination = $("#destinationInput").val().trim();
    var firstTrain = moment($("#timeInput").val().trim(), "HH:mm").format("HH:mm");
    var frequency = $("#frequencyInput").val().trim();
    // to create local temporary object to hold train data
    var newTrain = {
        name: trainName,
        place: destination,
        ftrain: firstTrain,
        freq: frequency
      }
      // uploads train data to the database
    database.ref().push(newTrain);
    console.log(newTrain.name);
    // clears all the text-boxes
    $("#trainNameInput").val("");
    $("#destinationInput").val("");
    $("#timeInput").val("");
    $("#frequencyInput").val("");
    // Prevents moving to new page
    return false;
  });
  //  Created a firebase event listener for adding trains to database and a row in the html when the user adds an entry
  database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
    // Now we store the childSnapshot values into a variable
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().place;
    var firstTrain = childSnapshot.val().ftrain;
    var frequency = childSnapshot.val().freq;
    // first Train pushed back to make sure it comes before current time
    var firstTimeConverted = moment(firstTrain, "HH:mm");
    console.log(firstTimeConverted);
    var currentTime = moment().format("HH:mm");
    console.log("CURRENT TIME: " + currentTime);
    // Difference between train times
    var timeDiff = moment().diff(moment(firstTimeConverted), "minutes");
    console.log(firstTrain);
    console.log("Difference in Time: " + timeDiff);
    // find Remainder of the time left and store in a variable
    var timeRemainder = timeDiff % frequency;
    console.log(timeRemainder);
    // to calculate minutes till train,we store it in a variable
    var minToTrain = frequency - timeRemainder;
    // next train
    var nextTrain = moment().add(minToTrain, "minutes").format("HH:mm");
    $("#trainTable>tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + nextTrain + "</td><td>" + frequency + "</td><td>" + minToTrain + "</td></tr>");
  });
  
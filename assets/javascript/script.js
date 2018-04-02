const config = {
  apiKey: 'AIzaSyDRqNEX72MHrWWJx5bBK6K9UNt9HuA8enc',
  authDomain: 'trainschedule-da3a1.firebaseapp.com',
  databaseURL: 'https://trainschedule-da3a1.firebaseio.com',
  projectId: 'trainschedule-da3a1',
  storageBucket: '',
  messagingSenderId: '548362641885',
};
firebase.initializeApp(config);

const database = firebase.database();

$('#submit-button').on('click', function (e) {
  e.preventDefault();

  const trainName = $('#train-name').val().trim();
  const destination = $('#destination').val().trim();
  const firstTime = $('#first-time').val().trim();
  const frequency = $('#frequency').val().trim();

  database.ref().push({
    trainName: trainName,
    destination: destination,
    startTime: firstTime,
    frequency: frequency,
    // dateAdded: firebase.database.ServerValue.TIMESTAMP,
  });

  $('#train-name').val('');
  $('#destination').val('');
  $('#first-time').val('');
  $('#frequency').val('');
});

let minutesTilNext;
let nextTrainTime;
let currentTime;

database.ref().orderByChild('dateAdded').on('child_added', function (snapshot) {
  // storing the snapshot.val() in a variable for convenience
  const sv = snapshot.val();

  // Calculate Minutes
  const firstTimeConverted = moment(sv.startTime, 'hh:mm').subtract(1, 'years');

  // currentTime = moment();

  const diffTime = moment().diff(moment(firstTimeConverted), 'minutes');

  const tRemainder = diffTime % sv.frequency;

  minutesTilNext = sv.frequency - tRemainder;

  nextTrainTime = moment().add(minutesTilNext, 'minutes');

  // Change the HTML to reflect
  const tRow = $('<tr>');
  const nameTd = $('<td>').text(sv.trainName);
  const destinationTd = $('<td>').text(sv.destination);
  const frequencyTd = $('<td>').text(sv.frequency);
  const nextArrivalTd = $('<td>').text(moment(nextTrainTime).format('hh:mm'));
  const minutesAwayTd = $('<td>').text(minutesTilNext);

  // Append the newly created table data to the table row
  tRow.append(nameTd, destinationTd, frequencyTd, nextArrivalTd, minutesAwayTd);
  // Append the table row to the table body
  $('#schedule-table').append(tRow);

  // Handle the errors
}, function (errorObject) {
  console.log(`Errors handled: ${errorObject.code}`);
});

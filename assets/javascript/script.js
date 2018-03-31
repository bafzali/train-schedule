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

database.ref().orderByChild('dateAdded').on('child_added', function (snapshot) {
  // storing the snapshot.val() in a variable for convenience
  const sv = snapshot.val();

  // Console.loging the last user's data
  console.log(sv.trainName);
  console.log(sv.destination);
  const firstTime = JSON.stringify(sv.startTime);
  console.log(firstTime);
  console.log(sv.frequency);

  // Calculate Minutes
  const firstTimeConverted = moment(sv.startTime, 'hh:mm').subtract(1, 'years');
  console.log(`Time entered: ${firstTimeConverted}`);

  const currentTime = moment();
  console.log(`Current time: ${currentTime}`);

  const diffTime = moment().diff(moment(firstTimeConverted), 'minutes');
  console.log(`Difference in time: ${diffTime}`);

  const tRemainder = diffTime % sv.frequency;
  console.log(tRemainder);

  const minutesTilNext = sv.frequency - tRemainder;
  console.log(`Minutes until train: ${minutesTilNext}`);

  const nextTrainTime = moment().add(minutesTilNext, 'minutes');
  console.log(`Arrival time: ${moment(nextTrainTime).format('hh:mm')}`);

  // Change the HTML to reflect
  const tRow = $('<tr>');
  const nameTd = $('<td>').text(sv.trainName);
  const destinationTd = $('<td>').text(sv.destination);
  const frequencyTd = $('<td>').text(sv.frequency);
  const nextArrivalTd = $('<td>').text(moment(nextTrainTime).format('hh:mm'));
  const minutesAwayTd = $('<td>').text(minutesTilNext);

  // const rateTd = $('<td>').text(sv.rate);
  // const monthsTd = $('<td>').text(duration);

  // Append the newly created table data to the table row
  tRow.append(nameTd, destinationTd, frequencyTd, nextArrivalTd, minutesAwayTd);
  // Append the table row to the table body
  $('#schedule-table').append(tRow);

  // $('#name-display').text(sv.name);
  // $('#email-display').text(sv.email);
  // $('#age-display').text(sv.age);
  // $('#comment-display').text(sv.comment);

  // Handle the errors
}, function (errorObject) {
  console.log(`Errors handled: ${errorObject.code}`);
});

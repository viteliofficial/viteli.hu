// Ez a file az oldallátogatását elemzi

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3cmymea7b95RNhtLPqEIh_aKGI0KTJks",
  authDomain: "netby-web-traffic.firebaseapp.com",
  databaseURL: "https://netby-web-traffic-default-rtdb.firebaseio.com",
  projectId: "netby-web-traffic",
  storageBucket: "netby-web-traffic.appspot.com",
  messagingSenderId: "1005760908215",
  appId: "1:1005760908215:web:7baf02a24340c7f7217632",
  measurementId: "G-T4NLY6136Q"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Reference to the traffic counter in the database
const counterRef = database.ref('traffic_counter');

// Increment the counter
counterRef.transaction(currentValue => {
  return (currentValue || 0) + 1;
}).then(result => {
  if (result.committed) {
    console.log('Counter incremented successfully');
  } else {
    console.log('Counter increment failed');
  }
}).catch(error => {
  console.error('Error incrementing counter:', error);
});
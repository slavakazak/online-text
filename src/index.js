import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { initializeApp } from "firebase/app"

const firebaseConfig = {
	apiKey: "AIzaSyD5OPU-mjP-jWa-nq5AvYI87OL9gZcXcoo",
	authDomain: "online-text-b570e.firebaseapp.com",
	databaseURL: "https://online-text-b570e-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "online-text-b570e",
	storageBucket: "online-text-b570e.appspot.com",
	messagingSenderId: "136715642771",
	appId: "1:136715642771:web:5267177ad588dd2fbd6a66"
}
initializeApp(firebaseConfig)

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
)
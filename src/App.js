import { useState, useEffect } from "react"
import { getDatabase, ref, set, get, onValue } from "firebase/database"

export default function App() {
	const [text, setText] = useState('')

	function changeHandler(e) {
		setText(e.target.value)
		const db = getDatabase()
		set(ref(db, 'text'), e.target.value)
	}

	useEffect(() => {
		const db = getDatabase()
		onValue(ref(db, 'text'), snapshot => {
			const data = snapshot.val()
			setText(data)
		})
	}, [])

	return (
		<div className="App">
			<textarea placeholder="Enter text" value={text} onChange={changeHandler} />
		</div>
	)
}
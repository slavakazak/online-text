import { useState } from "react"

export default function App() {
	const [text, setText] = useState('')

	function changeHandler(e) {
		setText(e.target.value)

		console.log(e.target.value)
	}

	return (
		<div className="App">
			<textarea placeholder="Enter text" value={text} onChange={changeHandler} />
		</div>
	)
}
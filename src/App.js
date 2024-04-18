import { useState, useEffect } from "react"
import { getDatabase, ref, set, get, child, onValue } from "firebase/database"

export default function App() {
  const [text, setText] = useState('')
  const [tabs, setTabs] = useState(['All', 'Cartel', 'Attic'])
  const [current, setCurrent] = useState('All')

  function changeHandler(e) {
    setText(e.target.value)
    const db = getDatabase()
    set(ref(db, current), e.target.value)
  }

  function tabClickHandler(tab) {
    return () => {
      setCurrent(tab)
      const dbRef = ref(getDatabase())
      get(child(dbRef, tab)).then(snapshot => {
        if (snapshot.exists()) {
          setText(snapshot.val())
        } else {
          setText('')
        }
      }).catch((error) => {
        setText('')
        console.error(error)
      })
    }
  }

  useEffect(() => {
    const db = getDatabase()
    tabs.forEach(tab => {
      onValue(ref(db, tab), snapshot => {
        if (snapshot.key == current) {
          setText(snapshot.val())
        }
      })
    })

  }, [tabs, current])

  return (
    <div className="App">
      <div className="tabs">
        {tabs.map((tab, i) => (
          <div
            key={i}
            className={'tab' + (tab == current ? ' active' : '')}
            onClick={tabClickHandler(tab)}>
            {tab}
          </div>
        ))}
      </div>
      <textarea placeholder="Enter text" value={text} onChange={changeHandler} />
    </div>
  )
}
import { useState, useEffect } from "react"
import { getDatabase, ref, set, onValue } from "firebase/database"

export default function App() {
  const [tabs, setTabs] = useState({})
  const [current, setCurrent] = useState(null)

  function changeHandler(tab) {
    return e => {
      setTabs(prev => ({ ...prev, [tab]: e.target.value }))
      set(ref(getDatabase(), tab), e.target.value)
    }
  }

  function tabClickHandler(tab) {
    return () => setCurrent(tab)
  }

  useEffect(() => {
    onValue(ref(getDatabase(), '/'), snapshot => {
      const data = snapshot.val()
      setTabs(data)
      setCurrent(Object.keys(data)[0])
    })
  }, [])

  return (
    <div className="App">
      <div className="tabs">
        {Object.keys(tabs).map((tab, i) => (
          <div
            key={i}
            className={'tab' + (tab == current ? ' active' : '')}
            onClick={tabClickHandler(tab)}>
            {tab}
          </div>
        ))}
        <div className="add" />
      </div>
      <div className="pages">
        {Object.keys(tabs).map((tab, i) => (
          <textarea
            key={i}
            placeholder="Enter text"
            className={tab == current ? 'active' : ''}
            value={tabs[tab]}
            onChange={changeHandler(tab)}
          />
        ))}
      </div>
    </div>
  )
}
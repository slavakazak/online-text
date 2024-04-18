import { useState, useEffect } from "react"
import { getDatabase, ref, set, get, child, onValue } from "firebase/database"

export default function App() {
  const [tabs, setTabs] = useState({ 'All': '', 'Attic': '', 'Cartel': '' })
  const [current, setCurrent] = useState('All')

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
    onValue(ref(getDatabase(), '/'), snapshot => setTabs(snapshot.val()))
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
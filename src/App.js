import { useState, useEffect, useRef } from "react"
import { getDatabase, ref, set, onValue } from "firebase/database"

export default function App() {
  const [tabs, setTabs] = useState({})
  const [current, setCurrent] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const input = useRef(null)
  const [add, setAdd] = useState(false)

  function changeHandler(tab) {
    return e => {
      const value = {
        name: tabs[tab].name || tab,
        text: e.target.value,
        order: tabs[tab].order || 1,
        visible: tabs[tab].visible || true
      }
      setTabs(prev => ({ ...prev, [tab]: value }))
      set(ref(getDatabase(), tab), value)
    }
  }

  const tabClickHandler = tab => () => setCurrent(tab)

  function addClickHandler() {
    setAdd(true)
  }

  function inputChangeHandler(e) {
    const value = e.target.value
    setInputValue(value)
    input.current.style.width = (value.length * 8.3) + 'px'
    if (window.innerWidth > 800) {
      input.current.style.width = (value.length * 10) + 'px'
    }
  }

  function saveTab() {
    const trimValue = inputValue.trim()
    if (trimValue.length !== 0) {
      const value = {
        name: trimValue,
        text: '',
        order: 1,
        visible: true
      }
      const tab = trimValue.toLocaleLowerCase()
      set(ref(getDatabase(), tab), value)
      setCurrent(tab)
    }
    setInputValue('')
    setAdd(false)
    input.current.style.width = '50px'
  }

  function keyDownHandler(e) {
    var key = e.which || e.keyCode;
    if (key === 13) saveTab()
  }

  useEffect(() => {
    onValue(ref(getDatabase(), '/'), snapshot => {
      const data = snapshot.val()
      setTabs(data)
      setCurrent(prev => prev || Object.keys(data).sort((a, b) => data[a].order - data[b].order)[0])
    })
    document.addEventListener('contextmenu', e => {
      e.preventDefault()
    })
  }, [])

  useEffect(() => {
    if (add) input.current.focus()
  }, [add])

  const renderTabs = Object.keys(tabs)
    .filter(tab => tabs[tab].visible)
    .sort((a, b) => tabs[a].order - tabs[b].order)

  return (
    <div className="App">
      <div className="tabs">
        <div className={'input_tab' + (add ? ' active' : '')}>
          <input ref={input} onChange={inputChangeHandler} value={inputValue} onKeyDown={keyDownHandler} />
          <svg viewBox="0 0 24 24" onClick={saveTab}>
            <path d="M19.3,5.3L9,15.6l-4.3-4.3l-1.4,1.4l5,5L9,18.4l0.7-0.7l11-11L19.3,5.3z" />
          </svg>
        </div>
        {renderTabs.map((tab, i) => (
          <div
            key={i}
            className={'tab' + (tab === current ? ' active' : '')}
            onClick={tabClickHandler(tab)}>
            {tabs[tab].name}
          </div>
        ))}
        {!add && <div className="add" onClick={addClickHandler} />}
      </div>
      <div className="pages">
        {renderTabs.map((tab, i) => (
          <textarea
            key={i}
            placeholder="Enter text"
            className={tab === current ? 'active' : ''}
            value={tabs[tab].text}
            onChange={changeHandler(tab)}
          />
        ))}
      </div>
    </div>
  )
}
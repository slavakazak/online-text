import { useState, useEffect } from "react"
import { getDatabase, ref, set, onValue } from "firebase/database"
import Save from "./components/Save"
import Trash from "./components/Trash"
import Copy from "./components/Copy"

export default function App() {
  const [tabs, setTabs] = useState({})
  const [current, setCurrent] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const [input, setInput] = useState(null)
  const [add, setAdd] = useState(false)
  const [change, setChange] = useState(null)
  const [alert, setAlert] = useState(false)
  const [alertText, setAlertText] = useState('')

  const changeHandler = tab => e => {
    const value = {
      name: tabs[tab].name || tab,
      text: e.target.value,
      order: tabs[tab].order || 1,
      visible: tabs[tab].visible || true
    }
    set(ref(getDatabase(), tab), value)
  }

  const tabClickHandler = tab => () => {
    setCurrent(tab)
    setAdd(false)
    setInput(null)
    if (tab !== change) setChange(null)
  }

  const contextMenuHandler = tab => e => {
    e.preventDefault()
    setChange(tab)
    setAdd(false)
    setCurrent(tab)
    const value = tabs[tab].name
    const thisInput = e.currentTarget.querySelector('.name-input')
    setInputValue(value)
    setInput(thisInput)
    thisInput.style.width = (value.length * 8.3) + 'px'
    if (window.innerWidth > 800) {
      thisInput.style.width = (value.length * 10) + 'px'
    }
  }

  function addClickHandler() {
    const thisInput = document.querySelector('.input_tab .name-input')
    setInput(thisInput)
    thisInput.style.width = '50px'
    setInputValue('')
    setChange(null)
    setAdd(true)
  }

  function inputChangeHandler(e) {
    const value = e.target.value
    setInputValue(value)
    const thisInput = e.target
    thisInput.style.width = (value.length * 8.3) + 'px'
    if (window.innerWidth > 800) {
      thisInput.style.width = (value.length * 10) + 'px'
    }
  }

  function addTab() {
    const trimValue = inputValue.trim()
    if (trimValue.length !== 0 && add) {
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
    setInput(null)
    setAdd(false)
  }

  function saveTab() {
    const trimValue = inputValue.trim()
    if (trimValue.length !== 0 && change) {
      const value = {
        name: trimValue,
        text: tabs[change].text || '',
        order: tabs[change].order || 1,
        visible: tabs[change].visible || true
      }
      set(ref(getDatabase(), change), value)
      setCurrent(change)
    }
    setInputValue('')
    setInput(null)
    setChange(null)
  }

  function keyDownHandler(e) {
    var key = e.which || e.keyCode;
    if (key === 13) {
      addTab()
      saveTab()
    }
  }

  function trashHandler() {
    if (change) {
      const value = {
        name: tabs[change].name || '',
        text: tabs[change].text || '',
        order: tabs[change].order || 1,
        visible: false
      }
      set(ref(getDatabase(), change), value)
    }
    setInputValue('')
    setInput(null)
    setChange(null)
  }

  function copyClickHandler() {
    const textComponent = document.querySelector('.pages textarea.active')
    let selectedText = ''
    if (textComponent.selectionStart !== undefined) {
      const startPos = textComponent.selectionStart
      const endPos = textComponent.selectionEnd
      selectedText = textComponent.value.substring(startPos, endPos)
    } else if (document.selection !== undefined) {
      textComponent.focus()
      const sel = document.selection.createRange()
      selectedText = sel.text
    }

    if (!selectedText) {
      setAlertText('Выделите текст для копирования')
    } else {
      navigator.clipboard.writeText(selectedText).then(() => {
        setAlertText('Текст скопирован в буфер обмена')
      }, err => {
        setAlertText('Произошла ошибка при копировании текста')
        console.error('Произошла ошибка при копировании текста: ', err)
      })
    }
    setAlert(true)
    setTimeout(() => setAlert(false), 1000)
  }

  useEffect(() => {
    onValue(ref(getDatabase(), '/'), snapshot => {
      const data = snapshot.val()
      if (data) {
        setTabs(data)
        setCurrent(prev => {
          if (data[prev] && data[prev].visible) {
            return prev
          }
          return Object.keys(data)
            .filter(tab => data[tab].visible)
            .sort((a, b) => data[a].order - data[b].order)[0]
        })
      }
    })
    document.addEventListener('contextmenu', e => e.preventDefault())
  }, [])

  useEffect(() => {
    if (input) input.focus()
  }, [input])

  const renderTabs = Object.keys(tabs)
    .filter(tab => tabs[tab].visible)
    .sort((a, b) => tabs[a].order - tabs[b].order)

  return (
    <div className="App">
      <div className="tabs">
        <div className={'input_tab' + (add ? ' active' : '')}>
          <input className="name-input" onChange={inputChangeHandler} value={inputValue} onKeyDown={keyDownHandler} />
          <Save onClick={addTab} />
        </div>
        {renderTabs.map((tab, i) => (
          <div
            key={i}
            className={'tab' + (tab === current ? ' active' : '') + (tab === change ? ' change' : '')}
            onClick={tabClickHandler(tab)}
            onContextMenu={contextMenuHandler(tab)}>
            <div className="name">{tabs[tab].name}</div>
            <Trash onClick={trashHandler} />
            <input className="name-input" onChange={inputChangeHandler} value={inputValue} onKeyDown={keyDownHandler} />
            <Save onClick={saveTab} />
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
      <Copy onClick={copyClickHandler} />
      {alert && <div className="alert-wrap">
        <div className="alert">{alertText}</div>
      </div>}
    </div>
  )
}
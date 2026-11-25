import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0);

  const handleClick = (event: React.MouseEvent<any, MouseEvent>) => {
    if (event.target.id === "minus") {
      setCount(c => c-1);
    } else setCount(c => c+1);
  }

  return (
    <div className='app'>
      <div>
        <h4>Count: <span className='count'>{count}</span></h4>
        <div className='actions'>
          <button id="minus" onClick={handleClick}>-</button>
          <button id="plus" onClick={handleClick}>+</button>
        </div>
      </div>
    </div>
  )
}

export default App

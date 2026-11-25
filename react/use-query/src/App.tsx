import { useState } from 'react'
import './App.css'
import { getName } from './api';
import { useQuery } from './useQuery';
import { useQueryWithCache } from './useQueryWithCache';

function App() {
  const [count, setCount] = useState(0);
  // const { data, loading } = useQuery(getName, ["user", count]);
  const { data, loading } = useQueryWithCache(getName, ["user", count]);


  return (
    <div>
      <button onClick={() => setCount(c => c+1)}>Click me</button>
      {loading && <div>Loading...</div>}
      {!loading && data as string && <div>{data as string}</div>}
    </div>
  )
}

export default App

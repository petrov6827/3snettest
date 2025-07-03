import './App.css'
import Table from './components/Table'
import { useState } from 'react'
import { YEARS } from './utils/date';


function App() {
  const [year, setYear] = useState(2025);

  return (
    <div className="p-4">
      <Table year={year} onYearChange={setYear} years={YEARS} />
    </div>
  )
}

export default App

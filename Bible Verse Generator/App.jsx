import { useState } from 'react'
import './App.css'



function App() {
  const [verse,setverse] = useState('')
  const [copy,setCopy] = useState('Copy')
  function fetchVerse(){
    fetch("https://bolls.life/get-random-verse/ESV/")
      .then(request => request.json())
      .then(data => {
        setverse(data.text)
        setCopy('Copy')
      })
  }
  function copyVerse(){
     navigator.clipboard.writeText(verse)
     setCopy('Copied')
  }
  return (
    <>
      <h1>Bible Verse Generator</h1>
    <section className="mainSection">
      <div className="verse-copy" onClick={copyVerse}>
        <div className="copy">
        <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M14 8H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2V10c0-1.103-.897-2-2-2z"/><path d="M20 2H10a2 2 0 0 0-2 2v2h8a2 2 0 0 1 2 2v8h2a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/></svg>
        {copy}
      </div>
        <div className="verse">{verse}</div>
      </div>
      <button id="generateVerse" onClick={fetchVerse}>Generate a Verse</button>
    </section>
    </>
  )
}

export default App

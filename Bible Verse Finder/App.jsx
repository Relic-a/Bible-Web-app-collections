import { useState, useEffect } from 'react'
import './App.css'
import SearchResult from './components/results'
function App() {
  const [searchingBar,setSearchingBar] = useState("")
  const [searchResults, setSearchResults] = useState()
  const [translation,setTranslation] = useState()
  const [books, setBooks] = useState()
  const [languageTranslation, setLanguageTranslation] = useState()
  const [selectedLanguage, setSelectedLanguage] = useState("English")
  const [availableTranslations, setAvailableTranslations] = useState()
  const [selectedTranslation, setSelectedTranslation] = useState()
  useEffect(()=>{
    fetch('https://bolls.life/get-books/YLT/')
    .then(request => request.json())
    .then(data => {return setBooks(data)})
  },[])
  useEffect(()=>{
    fetch('https://bolls.life/static/bolls/app/views/languages.json')
    .then(request => request.json())
    .then(data => {setLanguageTranslation(data.map(object => object))})
  },[])
  function updateSearchBar(eve){
    setSearchingBar(eve.target.value)
  }
  function searchVerses(translation){
    if(searchingBar){
    if(!(selectedTranslation || translation)){
    fetch(`https://bolls.life/find/YLT/?search=${searchingBar}&match_case=false&match_whole=true`)
    .then(request => request.json())
    .then(data => {return setSearchResults(data)})
    }
    else if(translation){
      fetch(`https://bolls.life/find/${translation}/?search=${searchingBar}&match_case=false&match_whole=true`)
    .then(request => request.json())
    .then(data => {return setSearchResults(data)})
    }
    else if(selectedTranslation){
      fetch(`https://bolls.life/find/${selectedTranslation}/?search=${searchingBar}&match_case=false&match_whole=true`)
    .then(request => request.json())
    .then(data => {return setSearchResults(data)})
    }
    else{
      fetch(`https://bolls.life/find/YLT/?search=${searchingBar}&match_case=false&match_whole=true`)
    .then(request => request.json())
    .then(data => {return setSearchResults(data)})
    }
  }
  }
  function setLanguage(language){
    setSelectedLanguage(language)
    let languageObject;
    for(let i = 0;i < languageTranslation.length; i++){
      if(languageTranslation[i].language == language){
        languageObject = languageTranslation[i]
        break
      }
    }
    const translations = languageObject.translations.map(object => object.short_name)
    setAvailableTranslations(translations)
  }
  function translationSelected(translation){
    setSelectedTranslation(translation)
    searchVerses(translation)
  }
  return (
    <>
      <nav>
      <h1>Search the Bible</h1>
    </nav>
    <section className="mainSection">
      <div className="searchSection">
        <input type="text" name="search" placeholder="Search a verse" id="searchBar" onChange={updateSearchBar} value={searchingBar}/>
        <div onClick={()=> searchVerses()}><svg className="searchIcon" height="24" version="1.1" width="40" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><g transform="translate(0 -1028.4)"><path d="m14.938 12.281-2.844 2.813 6.906 6.906 2.844-2.844-6.906-6.875z" fill="#95a5a6" transform="translate(0 1028.4)"/><path d="m15.562 1041.2c-0.473 1.3-1.472 2.4-2.75 2.9l2.188 2.3c1.16-0.7 2.137-1.7 2.812-2.9l-2.25-2.3z" fill="#7f8c8d"/><path d="m18 10a8 8 0 1 1 -16 0 8 8 0 1 1 16 0z" fill="#bdc3c7" transform="translate(0 1028.4)"/><path d="m15 10a5 5 0 1 1 -10 0 5 5 0 1 1 10 0z" fill="#ecf0f1" transform="translate(0 1028.4)"/></g></svg></div>
        <label>Language: </label>
        <select name='languageToRead' defaultValue={""} id='languageToRead' >
            <option selected disabled value={""}>Select a Language</option>
            <option value={"English"} selected onClick={()=> setLanguage("English")}>English </option>
        </select >
        <label>Translation: </label>
          <select name='languageToRead' defaultValue={""} id='languageToRead' className={selectedLanguage?  null : 'disabled'} disabled={selectedLanguage ? false : true}>
            <option value={""} disabled>Select Translation</option>
            {availableTranslations? availableTranslations.map((translations,index) => <option key={index} onClick={()=> translationSelected(translations)}>{translations}</option>) :null}
          </select>
      </div>
      {searchResults? searchResults.map(object => <SearchResult verse={object.text} book={books.find(book => {return book.bookid == object.book ? true:false})} chapter={object.chapter} verseNumber={object.verse}></SearchResult>):null}
    </section>
    </>
  )
}

export default App

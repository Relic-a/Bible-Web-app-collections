import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import React from 'react'
import './App.css'

function App() {
  const [books, setBooks] = useState([])
  const [choosenBook, setChoosenBook] = useState()
  const [chaptersToArray, setChaptersToArray] = useState()
  const [theChapter, setTheChapter] = useState()
  const [currentChapter, setCurrentChapter] = useState()
  const [languageTranslation, setLanguageTranslation] = useState()
  const [selectedLanguage, setSelectedLanguage] = useState()
  const [availableTranslations, setAvailableTranslations] = useState()
  const [selectedTranslation, setSelectedTranslation] = useState()
  useEffect(() => {
    fetch('https://bolls.life/get-books/YLT/')
      .then(request => request.json())
      .then(data => setBooks(data))
  }, [])
  //language
  useEffect(()=>{
    fetch('https://bolls.life/static/bolls/app/views/languages.json')
    .then(request => request.json())
    .then(data => {setLanguageTranslation(data.map(object => object))})
  },[])
  useEffect(()=>{
    numberOfChapters(choosenBook)
  },[choosenBook])
  function numberOfChapters(book){
    if(book){
      const bookObj = books.find(object => object.name == book? true: false)
      const numberofChapter = bookObj.chapters
      const arrayChapters = []
      for(let i = 1; i <= numberofChapter; i++){

        arrayChapters.push(i)
      }
      setChaptersToArray(arrayChapters)
    }
  }
  function setBook(book) {
    setChoosenBook(book)
  }

  function fetchBook(book,chapter,translation){
    const bookObj = books.find(object => object.name == book ? true : false)
    if(!(translation || selectedTranslation)){
      fetch(`https://bolls.life/get-text/NIV/${bookObj.bookid}/${chapter}/`)
      .then(request => request.json())
      .then(data => {setTheChapter(data);setCurrentChapter(chapter)})
    }
    else if(translation){
      fetch(`https://bolls.life/get-text/${translation}/${bookObj.bookid}/${chapter}/`)
      .then(request => request.json())
      .then(data => {setTheChapter(data);setCurrentChapter(chapter)})
    }
    else if(selectedTranslation){
      fetch(`https://bolls.life/get-text/${selectedTranslation}/${bookObj.bookid}/${chapter}/`)
      .then(request => request.json())
      .then(data => {setTheChapter(data);setCurrentChapter(chapter)})
    }
  }

  //language and translations
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
    fetchBook(choosenBook,currentChapter,translation)
  }
  return (
    <>
      <nav>
        <h1>Bible Reading</h1>
      </nav>
      <section className="mainSection">
        <div className="sideBar">
          <label htmlFor="bibleBook">Book: </label>
          <select name="bibleBook" id="bibleBook" defaultValue={""}>
            <option value="" disabled >Pick a Book</option>
            {books.map((value, index) => {
              return <option key={index} value={value.name} onClick={() => { setBook(value.name) }}>{value.name}</option>
            })}
          </select>
          <label htmlFor="chapterToRead">Chapter: </label>
          <select name="chapterToRead" defaultValue={""} id="chapterToRead" className={choosenBook?  null : 'disabled'} disabled={choosenBook? false : true}>
            <option value={""} key={0} disabled>Choose Chapter</option>
            {chaptersToArray? chaptersToArray.map(chapter => <option key={chapter} value={"ch"+chapter} onClick={()=> fetchBook(choosenBook, chapter)}>{chapter}</option>) :null}
          </select>
          <label>Language: </label>
          <select name='languageToRead' defaultValue={""} id='languageToRead' className={currentChapter?  null : 'disabled'} disabled={currentChapter ? false : true}>
            <option value={""} disabled>Choose a Language</option>
            {languageTranslation? languageTranslation.map((language,index) => 
              <option key={index} onClick={()=> setLanguage(language.language)}>{language.language}</option>)
              : null}
          </select >
          <label>Translation: </label>
          <select name='languageToRead' defaultValue={""} id='languageToRead' className={selectedLanguage?  null : 'disabled'} disabled={selectedLanguage ? false : true}>
            <option value={""}>Select Translation</option>
            {availableTranslations? availableTranslations.map((translations,index) => <option key={index} onClick={()=> translationSelected(translations)}>{translations}</option>) :null}
          </select>
        </div>
        <div className="readingPanel">
          {currentChapter ? <h4 className='choosenBook'>{choosenBook} {currentChapter}</h4> : null}
          {theChapter ? theChapter.map((verses,index)=>{
            if(index == 0){
              const newPartsArray = verses.text.split('<br/>')
              let newTextParts;
              let titlePart = newPartsArray[0]
              titlePart = titlePart.replace(/<i>/gi, "\n")
              titlePart = titlePart.replace(/<\/i>/gi, "\n")
              if(newPartsArray.length >  1){
                 newTextParts = newPartsArray[1].replace(/<br\/>/gi, "\n");
                 newTextParts = newPartsArray[1].replace(/<i>/gi, "\n");
                 newTextParts = newPartsArray[1].replace(/<\/i>/gi, "\n");
              }
              return( 
                <>
                  <h6 className='chapterTitle' key={1000}>{titlePart}</h6>
                  {newTextParts? <p key={index} className='bibleText'>{newTextParts}</p> : null}
                </>
              )
            }
            let newTextParts = verses.text.replace(/<br\/>/gi, "\n");
            newTextParts = newTextParts.replace(/<i>/gi, "\n");
            newTextParts = newTextParts.replace(/<\/i>/gi, "\n");
            return( 
              <>
                <span className='verseNumber'>{verses.verse}</span>
                <p key={index} className='bibleText'>{newTextParts}</p>
              </>
            )
          }): null}
        </div>
      </section>

    </>
  )
}

export default App

export default function SearchResult(props){
    let {verse, book, chapter, verseNumber} = props
    verse = verse.replace(/<mark>/gi,"")
    verse = verse.replace(/<\/mark>/gi,"")
    verse = verse.replace(/<i>/gi,"")
    verse = verse.replace(/<\/i>/gi,"")
    verse = verse.replace(/<br\/>/gi," ")
    verse = verse.replace(/<br>/gi," ")

    return(
        <>
        <section className="verseSection">
        <div className="verseAddress">
          <h6>{book.name} {chapter}:{verseNumber}</h6>
        </div>
        <div className="actualVerse">
          <p>{verse}</p>
        </div>
      </section>
        </>
    )
}
import { useEffect, useMemo, useState } from 'react'

const categories = {
  Freizeit: '#7dd3a8',
  Hausaufgaben: '#f6c98b',
  Test: '#f6a7b5',
  Anderes: '#9ccaf7'
}

const defaultEvents = [
  { id: 1, title: 'Mathe-Test', category: 'Test', date: getDateOffset(1), note: 'Wiederholung von Funktionen' },
  { id: 2, title: 'Deutsch-HA', category: 'Hausaufgaben', date: getDateOffset(2), note: 'Textanalyse fertigstellen' },
  { id: 3, title: 'Fußball', category: 'Freizeit', date: getDateOffset(0), note: 'Training 17:30 Uhr' },
  { id: 4, title: 'Biologie-Lektion', category: 'Anderes', date: getDateOffset(3), note: 'Praktikum' }
]

const defaultGrades = [
  { id: 1, subject: 'Mathe', value: 1.5, note: 'Klassenarbeit' },
  { id: 2, subject: 'Deutsch', value: 2.0, note: 'Aufsatz' },
  { id: 3, subject: 'Biologie', value: 3.0, note: 'Quiz' }
]

const defaultCards = [
  { id: 1, question: 'Was ist die Hauptfunktion der Zellmembran?', answer: 'Sie schützt die Zelle und reguliert den Stoffaustausch.' },
  { id: 2, question: 'Wie nennt man die größte Energiequelle für Pflanzen?', answer: 'Die Sonne.' }
]

const defaultMedia = [
  { id: 1, type: 'Video', title: 'Mathe: Funktionen erklärt', url: 'https://www.youtube.com/watch?v=U5Q3dC9DXc0' },
  { id: 2, type: 'Podcast', title: 'Lernpodcast Deutsch', url: 'https://example.com/podcast-deutsch' },
  { id: 3, type: 'Video', title: 'Biologie: Zellen einfach erklärt', url: 'https://www.youtube.com/watch?v=0Vg7U1P0X8E' }
]

const motivationalQuotes = [
  'Du bist stärker, als du denkst.',
  'Jeder kleine Lernschritt zählt.',
  'Erfolg kommt nicht von heute auf morgen – sondern aus Konsistenz.',
  'Heute lernen heißt morgen leichter sein.',
  'Du musst nicht perfekt sein, nur weitergehen.'
]

function getDateOffset(offset) {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + offset)
  return date.toISOString().slice(0, 10)
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' }).format(date)
}

function App() {
  const [activeTab, setActiveTab] = useState('übersicht')

  const [events, setEvents] = useState(() => {
    const stored = localStorage.getItem('school-events')
    return stored ? JSON.parse(stored) : defaultEvents
  })

  const [grades, setGrades] = useState(() => {
    const stored = localStorage.getItem('school-grades')
    return stored ? JSON.parse(stored) : defaultGrades
  })

  const [cards, setCards] = useState(() => {
    const stored = localStorage.getItem('school-cards')
    return stored ? JSON.parse(stored) : defaultCards
  })

  const [media, setMedia] = useState(() => {
    const stored = localStorage.getItem('school-media')
    return stored ? JSON.parse(stored) : defaultMedia
  })

  const [eventForm, setEventForm] = useState({ title: '', category: 'Test', date: getDateOffset(0), note: '' })
  const [gradeForm, setGradeForm] = useState({ subject: '', value: '', note: '' })
  const [cardForm, setCardForm] = useState({ question: '', answer: '' })
  const [mediaForm, setMediaForm] = useState({ type: 'Video', title: '', url: '' })
  const [selectedCard, setSelectedCard] = useState(null)

  useEffect(() => {
    localStorage.setItem('school-events', JSON.stringify(events))
  }, [events])

  useEffect(() => {
    localStorage.setItem('school-grades', JSON.stringify(grades))
  }, [grades])

  useEffect(() => {
    localStorage.setItem('school-cards', JSON.stringify(cards))
  }, [cards])

  useEffect(() => {
    localStorage.setItem('school-media', JSON.stringify(media))
  }, [media])

  const sevenDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date()
      date.setDate(date.getDate() + index)
      return {
        date: date.toISOString().slice(0, 10),
        label: new Intl.DateTimeFormat('de-DE', { weekday: 'short' }).format(date)
      }
    })
  }, [])

  const studyPlan = useMemo(() => {
    const tests = events.filter((event) => event.category === 'Test')

    return tests
      .slice()
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((test, index) => {
        const date = new Date(test.date)
        const learnDates = []

        for (let i = 1; i <= 3; i++) {
          const d = new Date(date)
          d.setDate(d.getDate() - i)
          learnDates.push(`${formatDate(d.toISOString().slice(0, 10))}`)
        }

        return {
          id: test.id,
          title: test.title,
          subject: test.note || 'Wiederholung',
          testDate: formatDate(test.date),
          studyDates: learnDates,
          priority: index + 1
        }
      })
  }, [events])

  const averageGrade = useMemo(() => {
    if (grades.length === 0) return '0.00'
    const total = grades.reduce((sum, item) => sum + Number(item.value), 0)
    return (total / grades.length).toFixed(2)
  }, [grades])

  const handleAddEvent = (e) => {
    e.preventDefault()
    if (!eventForm.title.trim()) return

    const newEvent = {
      id: Date.now(),
      title: eventForm.title,
      category: eventForm.category,
      date: eventForm.date,
      note: eventForm.note
    }

    setEvents((prev) => [...prev, newEvent])
    setEventForm({ title: '', category: 'Test', date: getDateOffset(0), note: '' })
  }

  const handleAddGrade = (e) => {
    e.preventDefault()
    if (!gradeForm.subject.trim() || !gradeForm.value) return

    setGrades((prev) => [
      ...prev,
      {
        id: Date.now(),
        subject: gradeForm.subject,
        value: Number(gradeForm.value),
        note: gradeForm.note
      }
    ])
    setGradeForm({ subject: '', value: '', note: '' })
  }

  const handleAddCard = (e) => {
    e.preventDefault()
    if (!cardForm.question.trim() || !cardForm.answer.trim()) return

    setCards((prev) => [
      ...prev,
      {
        id: Date.now(),
        question: cardForm.question,
        answer: cardForm.answer
      }
    ])
    setCardForm({ question: '', answer: '' })
  }

  const handleAddMedia = (e) => {
    e.preventDefault()
    if (!mediaForm.title.trim() || !mediaForm.url.trim()) return

    setMedia((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: mediaForm.type,
        title: mediaForm.title,
        url: mediaForm.url
      }
    ])
    setMediaForm({ type: 'Video', title: '', url: '' })
  }

  const removeEvent = (id) => setEvents((prev) => prev.filter((event) => event.id !== id))
  const removeGrade = (id) => setGrades((prev) => prev.filter((grade) => grade.id !== id))
  const removeCard = (id) => setCards((prev) => prev.filter((card) => card.id !== id))
  const removeMedia = (id) => setMedia((prev) => prev.filter((item) => item.id !== id))

  const tabs = [
    { id: 'übersicht', label: 'Übersicht' },
    { id: 'kalender', label: 'Kalender' },
    { id: 'tests', label: 'Tests & Lernplan' },
    { id: 'noten', label: 'Noten' },
    { id: 'motivation', label: 'Motivation' },
    { id: 'karteikarten', label: 'Karteikarten' },
    { id: 'medien', label: 'Medien' }
  ]

  const renderOverview = () => (
    <div className="tab-content">
      <h2>Willkommen! 👋</h2>
      <p className="intro-text">Dein persönlicher Schulplanner zur Organisation deiner Woche</p>
      
      <section className="top-summary">
        <div className="summary-card mint-card">
          <div className="card-icon">📅</div>
          <div className="card-text">
            <span>Heute</span>
            <strong>{events.filter((event) => event.date === getDateOffset(0)).length}</strong>
            <small>Termine</small>
          </div>
        </div>
        <div className="summary-card violet-card">
          <div className="card-icon">📝</div>
          <div className="card-text">
            <span>Tests</span>
            <strong>{events.filter((event) => event.category === 'Test').length}</strong>
            <small>im Blick</small>
          </div>
        </div>
        <div className="summary-card mint-card">
          <div className="card-icon">⭐</div>
          <div className="card-text">
            <span>Durchschnitt</span>
            <strong>{averageGrade}</strong>
            <small>Noten</small>
          </div>
        </div>
        <div className="summary-card violet-card">
          <div className="card-icon">🃏</div>
          <div className="card-text">
            <span>Karteikarten</span>
            <strong>{cards.length}</strong>
            <small>zum Üben</small>
          </div>
        </div>
      </section>

      <section className="panel">
        <h3>Diese Woche:</h3>
        <div className="calendar-grid">
          {sevenDays.map((day) => {
            const items = events.filter((event) => event.date === day.date)
            return (
              <div key={day.date} className="day-card">
                <div className="day-header">
                  <strong>{day.label}</strong>
                  <span>{new Date(day.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}</span>
                </div>
                {items.length === 0 ? (
                  <p className="empty">frei</p>
                ) : (
                  <div className="event-list">
                    {items.slice(0, 2).map((event) => (
                      <div key={event.id} className="event-item" style={{ background: categories[event.category] }}>
                        <strong>{event.title}</strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )

  const renderKalender = () => (
    <div className="tab-content">
      <h2>7-Tage-Kalender</h2>
      
      <div className="calendar-grid">
        {sevenDays.map((day) => {
          const items = events.filter((event) => event.date === day.date)

          return (
            <div key={day.date} className="day-card">
              <div className="day-header">
                <strong>{day.label}</strong>
                <span>{new Date(day.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}</span>
              </div>

              {items.length === 0 ? (
                <p className="empty">Keine Einträge</p>
              ) : (
                <div className="event-list">
                  {items.map((event) => (
                    <div key={event.id} className="event-item" style={{ background: categories[event.category] }}>
                      <div>
                        <strong>{event.title}</strong>
                        <small>{event.note || event.category}</small>
                      </div>
                      <button onClick={() => removeEvent(event.id)}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <section className="panel form-section">
        <h3>Neuer Termin</h3>
        <form className="form-row" onSubmit={handleAddEvent}>
          <input value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} placeholder="Termin oder Test" />
          <select value={eventForm.category} onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}>
            {Object.keys(categories).map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <input type="date" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} />
          <input value={eventForm.note} onChange={(e) => setEventForm({ ...eventForm, note: e.target.value })} placeholder="Notiz" />
          <button type="submit">Hinzufügen</button>
        </form>
      </section>
    </div>
  )

  const renderTests = () => (
    <div className="tab-content">
      <h2>Tests & Lernplan</h2>
      
      <div className="two-column-grid">
        <section className="panel">
          <h3>Test-Übersicht</h3>

          {studyPlan.length === 0 ? (
            <p className="empty">Noch keine Tests eingegeben.</p>
          ) : (
            <div className="plan-list">
              {studyPlan.map((test) => (
                <div key={test.id} className="plan-item">
                  <div className="plan-meta">
                    <strong>{test.title}</strong>
                    <span>{test.testDate}</span>
                  </div>
                  <div className="study-badges">
                    {test.studyDates.map((date, index) => (
                      <span key={index}>{date}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="panel">
          <h3>Lernplan</h3>
          <ul className="checklist">
            <li>1. Testdaten eintragen</li>
            <li>2. Relevante Fächer wiederholen</li>
            <li>3. 20–30 Minuten täglich lernen</li>
            <li>4. Karteikarten und Medien nutzen</li>
          </ul>
        </section>
      </div>
    </div>
  )

  const renderNoten = () => (
    <div className="tab-content">
      <h2>Noten</h2>
      
      <section className="panel form-section">
        <h3>Note hinzufügen</h3>
        <form className="form-row" onSubmit={handleAddGrade}>
          <input value={gradeForm.subject} onChange={(e) => setGradeForm({ ...gradeForm, subject: e.target.value })} placeholder="Fach" />
          <input type="number" min="1" max="6" step="0.5" value={gradeForm.value} onChange={(e) => setGradeForm({ ...gradeForm, value: e.target.value })} placeholder="Note" />
          <input value={gradeForm.note} onChange={(e) => setGradeForm({ ...gradeForm, note: e.target.value })} placeholder="Beschreibung" />
          <button type="submit">Speichern</button>
        </form>
      </section>

      <section className="panel">
        <div className="grade-list">
          {grades.map((grade) => (
            <div key={grade.id} className="grade-item">
              <div>
                <strong>{grade.subject}</strong>
                <small>{grade.note}</small>
              </div>
              <div className="grade-right">
                <span>{grade.value}</span>
                <button onClick={() => removeGrade(grade.id)}>×</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )

  const renderMotivation = () => (
    <div className="tab-content">
      <h2>Motivationssprüche</h2>
      
      <section className="panel">
        <div className="quote-grid">
          {motivationalQuotes.map((quote, index) => (
            <div key={index} className="quote-card">
              "{quote}"
            </div>
          ))}
        </div>
      </section>
    </div>
  )

  const renderKarteikarten = () => (
    <div className="tab-content">
      <h2>Karteikarten</h2>
      
      <div className="two-column-grid">
        <section className="panel form-section">
          <h3>Neue Karte</h3>
          <form className="stacked-form" onSubmit={handleAddCard}>
            <input value={cardForm.question} onChange={(e) => setCardForm({ ...cardForm, question: e.target.value })} placeholder="Frage" />
            <textarea value={cardForm.answer} onChange={(e) => setCardForm({ ...cardForm, answer: e.target.value })} placeholder="Antwort" rows="3" />
            <button type="submit">Karte hinzufügen</button>
          </form>
        </section>

        <section className="panel">
          <h3>Üben</h3>
          <div className="flashcard-list">
            {cards.map((card) => (
              <div key={card.id} className="flashcard">
                <button className="flip-button" onClick={() => setSelectedCard(selectedCard === card.id ? null : card.id)}>
                  {selectedCard === card.id ? 'Antwort zeigen' : 'Frage zeigen'}
                </button>
                <div className="flashcard-card">
                  <p>{selectedCard === card.id ? card.answer : card.question}</p>
                </div>
                <button className="delete-button" onClick={() => removeCard(card.id)}>Entfernen</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )

  const renderMedien = () => (
    <div className="tab-content">
      <h2>Medien</h2>
      
      <section className="panel form-section">
        <h3>Neues Medium</h3>
        <form className="form-row" onSubmit={handleAddMedia}>
          <select value={mediaForm.type} onChange={(e) => setMediaForm({ ...mediaForm, type: e.target.value })}>
            <option value="Video">Video</option>
            <option value="Podcast">Podcast</option>
            <option value="Lernlink">Lernlink</option>
          </select>
          <input value={mediaForm.title} onChange={(e) => setMediaForm({ ...mediaForm, title: e.target.value })} placeholder="Titel" />
          <input value={mediaForm.url} onChange={(e) => setMediaForm({ ...mediaForm, url: e.target.value })} placeholder="Link" />
          <button type="submit">Speichern</button>
        </form>
      </section>

      <section className="panel">
        <div className="media-grid">
          {media.map((item) => (
            <div key={item.id} className="media-card">
              <span className="media-tag">{item.type}</span>
              <h4>{item.title}</h4>
              <a href={item.url} target="_blank" rel="noreferrer">Öffnen</a>
              <button className="delete-button" onClick={() => removeMedia(item.id)}>Entfernen</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'kalender':
        return renderKalender()
      case 'tests':
        return renderTests()
      case 'noten':
        return renderNoten()
      case 'motivation':
        return renderMotivation()
      case 'karteikarten':
        return renderKarteikarten()
      case 'medien':
        return renderMedien()
      case 'übersicht':
      default:
        return renderOverview()
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">📚</div>
          <div>
            <h1>Schulplanner</h1>
            <small>deine Lernwelt</small>
          </div>
        </div>

        <nav className="nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  )
}

export default App

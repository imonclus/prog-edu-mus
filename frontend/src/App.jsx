import React, { useState } from 'react';
import { BookOpen, CheckSquare, Loader2, Play, Music, LayoutTemplate } from 'lucide-react';
import { MarkdownRenderer } from './components/MarkdownRenderer';
import { PdfExportButton } from './components/PdfExportButton';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'; // Define backend URL

function App() {
  const [activeTab, setActiveTab] = useState('sa'); // 'sa' | 'rubrica'
  
  // State for Situació d'Aprenentatge
  const [curs, setCurs] = useState('3r de primària');
  const [tema, setTema] = useState('La música tradicional i els instruments catalans');
  const [sessions, setSessions] = useState('3');
  const [saContent, setSaContent] = useState('');
  const [isGeneratingSa, setIsGeneratingSa] = useState(false);
  const [error, setError] = useState(null);

  // State for Rubrica
  const [rubricaContent, setRubricaContent] = useState('');
  const [isGeneratingRubrica, setIsGeneratingRubrica] = useState(false);

  const handleGenerateSA = async () => {
    setIsGeneratingSa(true);
    setError(null);
    try {
      const prompt = `Vull una situació d'aprenentatge de ${sessions} sessions sobre ${tema} per a ${curs}.`;
      const userId = 'user_local';

      // 1. Create a session first
      const sessionResponse = await fetch(`${API_URL}/apps/app/users/${userId}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      if (!sessionResponse.ok) {
        throw new Error("No s'ha pogut crear la sessió amb el backend.");
      }
      
      const sessionData = await sessionResponse.json();
      const realSessionId = sessionData.id;

      // 2. Invoke the agent
      const response = await fetch(`${API_URL}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appName: "app",
          userId: userId,
          sessionId: realSessionId,
          newMessage: {
            role: "user",
            parts: [{ text: prompt }]
          }
        })
      });

      if (!response.ok) {
        throw new Error("No s'ha pogut connectar amb l'agent. Assegura't que el backend està engegat.");
      }

      const events = await response.json();
      const lastEvent = events[events.length - 1];
      const text = lastEvent?.content?.parts?.[0]?.text || "L'agent no ha retornat cap text.";
      
      setSaContent(text);
      
    } catch (err) {
      console.warn('Backend unavailable, using fallback mockup', err);
      setError(err.message + " - Utilitzant contingut de prova per ara.");
      
      // Fallback timeout per demostrar la UI
      setTimeout(() => {
        setSaContent(`# Situació d'Aprenentatge: ${tema}\n\n**Curs:** ${curs}\n**Sessions:** ${sessions}\n\n## 1. Introducció\nAquesta situació d'aprenentatge convida als alumnes a descobrir la riquesa de la música tradicional...\n\n## 2. Competències i Sabers\n* **C1:** Identificar elements musicals bàsics.\n* **Sabers:** Instruments de cobla, la sardana.\n\n## 3. Desenvolupament (Sessions)\n### Sessió 1: Què sona?\nEscoltem i classifiquem els instruments de vent de la cobla.\n\n### Sessió 2: El ritme de la tradició\nTreballem el compàs i l'oïda interna.\n\n### Sessió 3: Fem la nostra audició\nCreem una petita composició rítmica basada en una dansa tradicional.\n\n## 4. Avaluació\nEs valorarà la participació, el reconeixement auditiu i el treball cooperatiu.`);
        setIsGeneratingSa(false);
      }, 2000);
      return;
    }
    
    setIsGeneratingSa(false);
  };

  const handleGenerateRubrica = async () => {
    if (!saContent) {
      setError("Cal generar primer la Situació d'Aprenentatge abans de crear la rúbrica.");
      return;
    }
    
    setIsGeneratingRubrica(true);
    setError(null);
    try {
      const prompt = `Genera la rúbrica d'avaluació per a la següent situació d'aprenentatge:\n\n${saContent}\n\nUtilitza la skill creador-rubrica.`;
      const userId = 'user_local';

      // 1. Create a session first
      const sessionResponse = await fetch(`${API_URL}/apps/app/users/${userId}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      if (!sessionResponse.ok) {
        throw new Error("No s'ha pogut crear la sessió amb el backend.");
      }
      
      const sessionData = await sessionResponse.json();
      const realSessionId = sessionData.id;

      // 2. Invoke the agent
      const response = await fetch(`${API_URL}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appName: "app",
          userId: userId,
          sessionId: realSessionId,
          newMessage: {
            role: "user",
            parts: [{ text: prompt }]
          }
        })
      });

      if (!response.ok) {
        throw new Error("No s'ha pogut connectar amb l'agent.");
      }

      const events = await response.json();
      const lastEvent = events[events.length - 1];
      const text = lastEvent?.content?.parts?.[0]?.text || "L'agent no ha retornat cap text.";
      
      setRubricaContent(text);
      
    } catch (err) {
      console.warn('Backend unavailable, using fallback mockup', err);
      setError(err.message + " - Utilitzant contingut de prova per ara.");
      
      setTimeout(() => {
        setRubricaContent(`# Rúbrica d'Avaluació: ${tema}\n\n| Criteri / Dimensió | Nivell 1 (Satisfactori) | Nivell 2 (Notable) | Nivell 3 (Excel·lent) |\n| :--- | :--- | :--- | :--- |\n| **Reconeixement auditiu** | Identifica alguns instruments de la cobla amb l'ajuda de targetes visuals. | Identifica la majoria d'instruments sol. | Identifica tots els instruments i els agrupa per famílies. |\n| **Pràctica rítmica** | Repeteix el patró amb ajuda de la mestra. | Segueix el compàs autònomament. | Crea i lidera un nou patró rítmic per a la classe. |\n| **Treball Cooperatiu** | Participa si se li demana directament. | Col·labora activament amb el grup. | Ajuda els companys i explica com millorar. |`);
        setIsGeneratingRubrica(false);
      }, 2000);
      return;
    }
    
    setIsGeneratingRubrica(false);
  };

  const currentContent = activeTab === 'sa' ? saContent : rubricaContent;
  const targetId = activeTab === 'sa' ? 'pdf-sa-content' : 'pdf-rubrica-content';
  const exportFilename = activeTab === 'sa' ? 'situacio_aprenentatge.pdf' : 'rubrica.pdf';

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-title">
          <Music size={28} color="#818cf8" />
          <span>Programador de SdA i la seva rúbrica, per a l'educació musical a primària</span>
        </div>
      </header>

      <main className="main-content">
        {/* Sidebar Controls */}
        <aside className="sidebar glass-panel">
          <div className="control-panel">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LayoutTemplate size={20} />
              Configuració
            </h2>
            
            {error && (
              <div className="alert-error">
                {error}
              </div>
            )}

            {/* Always show SA inputs for context */}
            <div className="control-group">
              <label className="control-label">Curs</label>
              <input 
                type="text" 
                className="input-field" 
                value={curs} 
                onChange={(e) => setCurs(e.target.value)} 
                placeholder="Ex: 3r de primària"
              />
            </div>
            
            <div className="control-group">
              <label className="control-label">Tema / Repte</label>
              <textarea 
                className="textarea-field" 
                value={tema} 
                onChange={(e) => setTema(e.target.value)}
                placeholder="Descriu la temàtica de la SA..."
              />
            </div>

            <div className="control-group">
              <label className="control-label">Número de sessions</label>
              <input 
                type="number" 
                className="input-field" 
                value={sessions} 
                onChange={(e) => setSessions(e.target.value)}
                min="1" max="10"
              />
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button 
                className="btn btn-primary" 
                onClick={handleGenerateSA}
                disabled={isGeneratingSa || isGeneratingRubrica}
                style={{ width: '100%' }}
              >
                {isGeneratingSa ? <Loader2 size={18} className="spinner" /> : <Play size={18} />}
                <span>Generar Situació</span>
              </button>

              <button 
                className="btn btn-secondary" 
                onClick={handleGenerateRubrica}
                disabled={!saContent || isGeneratingSa || isGeneratingRubrica}
                style={{ width: '100%' }}
                title={!saContent ? "Cal generar la SA primer" : "Generar rúbrica basada en la SA actual"}
              >
                {isGeneratingRubrica ? <Loader2 size={18} className="spinner" /> : <CheckSquare size={18} />}
                <span>Generar Rúbrica</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Document View */}
        <section className="document-view glass-panel">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'sa' ? 'active' : ''}`}
              onClick={() => setActiveTab('sa')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={16} />
                Situació d'Aprenentatge
              </div>
            </button>
            <button 
              className={`tab ${activeTab === 'rubrica' ? 'active' : ''}`}
              onClick={() => setActiveTab('rubrica')}
              disabled={!saContent && !rubricaContent}
              style={{ opacity: (!saContent && !rubricaContent) ? 0.5 : 1, cursor: (!saContent && !rubricaContent) ? 'not-allowed' : 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckSquare size={16} />
                Rúbrica d'Avaluació
              </div>
            </button>
          </div>

          <div className="document-header">
            <h2 className="document-title">
              {activeTab === 'sa' ? "Document: Situació d'Aprenentatge" : "Document: Rúbrica d'Avaluació"}
            </h2>
            <PdfExportButton 
              targetId={targetId} 
              filename={exportFilename} 
            />
          </div>

          <div className="document-content-wrapper">
            <MarkdownRenderer 
              id={targetId} 
              content={currentContent} 
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;

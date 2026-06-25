# Programador de SdA i la seva rúbrica, per a l'educació musical a primària

Aquest és un sistema impulsat per IA (Gemini 2.5 Pro) per ajudar als docents de música d'educació primària a dissenyar Situacions d'Aprenentatge (SdA) i rúbriques d'avaluació amb base als currículums, competències i sabers del Departament d'Educació.

## Arquitectura del Sistema

El projecte consta de dues parts principals:
1. **Backend (Agent)**: Desenvolupat amb l'Agent Development Kit (ADK) de Google i exposat via FastAPI. Conté el cervell pedagògic, eines i regles per crear unitats coherents i complertes.
2. **Frontend (Interfície d'usuari)**: Creat amb React, Vite i CSS Vanilla. Ofereix una interfície en "Mode Fosc", amb la qual els docents interactuen per definir la temàtica, el curs i la durada, i reben i descarreguen (PDF) els resultats de forma ràpida.

## Com engegar-ho en local

### Requisits
- Python 3.11+
- Node.js i `npm`
- `uv` (Gestor de paquets de Python)

### Engegar el Backend (ADK / FastAPI)

1. Crea i activa l'entorn virtual o utilitza `uv` directament.
2. Configura les variables d'entorn al fitxer `.env` (Google Cloud Project ID o API Key).
3. Engega l'orquestrador (cal permetre orígens per CORS si s'utilitza amb el frontend local):

```bash
$env:ALLOW_ORIGINS="http://localhost:5173"
uv run uvicorn app.fast_api_app:app --host 0.0.0.0 --port 8000
```

### Engegar el Frontend (React / Vite)

Obre una nova terminal i dirigeix-te a la carpeta `frontend`.

```bash
cd frontend
npm install
npm run dev
```

La interfície web estarà disponible a `http://localhost:5173`.

## Llicència

Aquest projecte està sota llicència **MIT**. Llegeix el fitxer `LICENSE` per a més detalls.

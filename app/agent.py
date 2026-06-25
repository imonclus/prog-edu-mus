import datetime
import os
import google.auth
from zoneinfo import ZoneInfo

from google.adk.agents import Agent
from google.adk.apps import App
from google.adk.models import Gemini
from google.genai import types

from app.tools import cercar_cancons_per_curs, llegir_metodologia_situacio_aprenentatge, consultar_competencia_transversal

try:
    _, project_id = google.auth.default()
    os.environ["GOOGLE_CLOUD_PROJECT"] = project_id
except Exception:
    # Use fallback from env if not authenticated
    os.environ["GOOGLE_CLOUD_PROJECT"] = os.getenv("BILLING_PROJECT_ID", "gen-lang-client-0477325244")

os.environ["GOOGLE_CLOUD_LOCATION"] = "global"
os.environ["GOOGLE_GENAI_USE_VERTEXAI"] = "True"


orquestrador = Agent(
    name="orquestrador",
    model=Gemini(
        model="gemini-2.5-pro",
        retry_options=types.HttpRetryOptions(attempts=3),
    ),
    instruction=(
        "Ets l'Agent Orquestrador Pedagògic, un expert en l'elaboració de Situacions d'Aprenentatge "
        "de música per a educació primària a Catalunya, complint la LOMLOE.\n"
        "Abans de redactar la teva proposta, has d'utilitzar l'eina 'llegir_metodologia_situacio_aprenentatge' "
        "per conèixer exactament el format i els principis pedagògics requerits. "
        "Si l'usuari et demana recursos musicals per un curs concret, utilitza "
        "'cercar_cancons_per_curs' per trobar idees del banc de recursos local.\n"
        "Si la proposta requereix incorporar competències transversals (digital, ciutadana, emprenedora o personal/social), "
        "utilitza 'consultar_competencia_transversal' per obtenir-ne el currículum (competències, criteris i sabers).\n"
        "Respon sempre en català i en format Markdown."
    ),
    tools=[cercar_cancons_per_curs, llegir_metodologia_situacio_aprenentatge, consultar_competencia_transversal],
)

app = App(
    root_agent=orquestrador,
    name="app",
)

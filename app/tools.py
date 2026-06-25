import os
import pathlib

def cercar_cancons_per_curs(curs: str) -> str:
    """
    Cerca al banc de recursos de cançons i audicions les propostes adients per al curs especificat.
    
    Args:
        curs: Curs de primària (ex: '3r', '4t', '5è', '6è', '1r', '2n').
        
    Returns:
        Un text en format markdown amb les propostes de cançons i audicions.
    """
    base_path = pathlib.Path("JSON/audios_cancons")
    
    result = []
    if base_path.exists():
        for file in base_path.iterdir():
            # Aquesta lògica senzilla busca el número del curs en el nom del fitxer
            # ex: 'musica3r-llista-i-lletres.md' per '3'
            curs_num = next((char for char in curs if char.isdigit()), "")
            
            if curs_num and curs_num in file.name:
                try:
                    with open(file, "r", encoding="utf-8") as f:
                        content = f.read()
                        # Retornem els primers 2000 caràcters per no saturar el context
                        result.append(f"### Fitxer: {file.name}\n\n{content[:2000]}\n\n[...]")
                except Exception:
                    pass
                    
    if result:
        return "\n\n".join(result)
    
    return f"No s'han trobat cançons específiques pel curs {curs}."

def llegir_metodologia_situacio_aprenentatge() -> str:
    """
    Llegeix la Skill de metodologia per dissenyar situacions d'aprenentatge.
    
    Returns:
        El text amb la metodologia i estructura requerida a aplicar.
    """
    try:
        with open("skills/situacio-aprenentatge/SKILL.md", "r", encoding="utf-8") as f:
            return f.read()
    except Exception as e:
        return f"Error llegint la Skill: {str(e)}"

def consultar_competencia_transversal(competencia: str) -> str:
    """
    Consulta totes les competències, criteris d'avaluació i sabers d'una competència transversal específica.
    
    Args:
        competencia: Nom de la competència transversal. Opcions vàlides: 'digital', 'ciutadana', 'emprenedora', 'personal'.
        
    Returns:
        Tota la informació de la competència seleccionada (competències, criteris, sabers) en format JSON.
    """
    import json
    import pathlib
    
    directoris = {
        'digital': 'competencia_digital',
        'ciutadana': 'competencia_ciutadana',
        'emprenedora': 'competencia_emprenedora',
        'personal': 'competencia_personal_social_aprendre_a_aprendre'
    }
    
    if competencia not in directoris:
        return f"Competència no vàlida. Opcions: {', '.join(directoris.keys())}"
        
    base_path = pathlib.Path("JSON") / directoris[competencia]
    
    if not base_path.exists():
        return f"No s'ha trobat el directori per a la competència {competencia}."
        
    result = {}
    for fitxer in base_path.iterdir():
        if fitxer.suffix == '.json':
            try:
                with open(fitxer, "r", encoding="utf-8") as f:
                    result[fitxer.name] = json.load(f)
            except Exception as e:
                result[fitxer.name] = f"Error llegint: {str(e)}"
                
    return json.dumps(result, indent=2, ensure_ascii=False)

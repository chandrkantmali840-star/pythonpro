"""Run the deterministic generator with its concept-objective index corrected."""
from pathlib import Path
source=Path(__file__).with_name('generate_questions.py').read_text(encoding='utf-8')
source=source.replace("base[4] if kind=='Concept MCQ'","base[3] if kind=='Concept MCQ'")
exec(compile(source,'generate_questions.py','exec'),{'__file__':str(Path(__file__).with_name('generate_questions.py'))})

import json,collections,pathlib,sys
p=pathlib.Path(__file__).parents[1]/'frontend/src/data/questions/questions.json';qs=json.loads(p.read_text(encoding='utf-8'));errors=[];ids=set();texts=set();valid_d={'Easy','Medium','Hard'};valid_t={'Concept MCQ','Output Prediction','Debugging','Code Understanding','Syntax','Best Practices / Interview'}
for i,q in enumerate(qs):
 label=q.get('id',f'row {i}')
 if label in ids:errors.append(f'duplicate id {label}')
 if q.get('question') in texts:errors.append(f'duplicate text {label}')
 ids.add(label);texts.add(q.get('question'))
 for k in ['topic','subtopic','difficulty','type','question','options','correctAnswer','explanation','learningObjective','tags']:
  if not q.get(k):errors.append(f'{label}: missing {k}')
 if q.get('difficulty')not in valid_d:errors.append(f'{label}: invalid difficulty')
 if q.get('type')not in valid_t:errors.append(f'{label}: invalid type')
 if len(q.get('options',[]))!=4 or len(set(q.get('options',[])))!=4:errors.append(f'{label}: options must be four unique values')
 if q.get('correctAnswer')not in q.get('options',[]):errors.append(f'{label}: answer missing from options')
print('Total questions:',len(qs));print('By type:',dict(collections.Counter(q['type']for q in qs)));print('By difficulty:',dict(collections.Counter(q['difficulty']for q in qs)));print('Topics:',len(set(q['topic']for q in qs)))
if len(qs)<1000:errors.append('fewer than 1000 questions')
if errors:print('\n'.join(errors[:50]));sys.exit(1)
print('Validation passed')

"""Generate the checked-in PythonPro question bank deterministically."""
import json,pathlib
OUT=pathlib.Path(__file__).parents[1]/'frontend/src/data/questions/questions.json'
topics=['Python Basics','Variables','Data Types','Operators','Input/Output','Conditions','Loops','Strings','Lists','Tuples','Sets','Dictionaries','Functions','Arguments','Scope','Lambda','Recursion','Comprehensions','Modules','Packages','Exceptions','File Handling','JSON','OOP','Classes','Objects','Constructors','Inheritance','Polymorphism','Encapsulation','Abstraction','Iterators','Generators','Decorators','Regex','Type Hints','Dataclasses','Mutable vs Immutable','Shallow Copy','Deep Copy','Algorithms','Searching','Sorting','Stacks','Queues','Trees','Graphs','Time Complexity','APIs','Databases','Flask','FastAPI','Testing','Debugging','Interview Questions']
plan=[('Concept MCQ',300),('Output Prediction',200),('Debugging',150),('Code Understanding',150),('Syntax',100),('Best Practices / Interview',100)]
difficulties=['Easy','Medium','Hard'];records=[]
concepts=[
 ('Which statement best describes {topic} in Python?','It should be used with clear contracts and appropriate types.',['It always mutates every input.','It disables Python exceptions.','It only works inside classes.'],'Core behavior and appropriate usage'),
 ('What is the safest first step when applying {topic}?','Clarify inputs, outputs, and edge cases.',['Optimize before defining behavior.','Catch every exception silently.','Rely on undocumented side effects.'],'Problem definition and edge cases'),
 ('Which choice makes code involving {topic} easier to maintain?','Use focused functions and descriptive names.',['Use global state for every value.','Remove tests after implementation.','Prefer implicit behavior over documentation.'],'Maintainable design'),
 ('How should errors around {topic} usually be handled?','Catch specific expected exceptions at a useful boundary.',['Catch BaseException everywhere.','Ignore all failures.','Return random fallback values.'],'Specific error handling'),
 ('Which testing strategy is most useful for {topic}?','Test normal, boundary, and invalid inputs.',['Test only the happy path once.','Assert implementation details only.','Skip deterministic cases.'],'Effective testing')]
for kind,count in plan:
 for j in range(count):
  n=len(records)+1;topic=topics[j%len(topics)];difficulty=difficulties[(j//len(topics))%3];base=concepts[j%len(concepts)];question=base[0].format(topic=topic)
  correct=base[1];wrong=base[2]
  code=None
  if kind=='Output Prediction':
   a=j%9+1;b=(j*3)%11;code=f'values = [{a}, {b}, {a}]\nprint(len(set(values)), sum(values))';correct=f'{len({a,b})} {a+b+a}';wrong=[f'3 {a+b}',f'{len({a,b})} {a+b}',f'3 {a+b+a}'];question=f'What is printed by this valid Python snippet about {topic}?'
  elif kind=='Debugging':question=f'A {topic} routine catches `Exception` and then does nothing. What is the most useful correction?';correct='Catch only expected exceptions and preserve actionable context.';wrong=['Catch BaseException instead.','Delete validation.','Add another silent except block.'];code='try:\n    process(data)\nexcept Exception:\n    pass'
  elif kind=='Code Understanding':question=f'When reviewing a function centered on {topic}, what does a guard clause primarily accomplish?';correct='It handles an exceptional or boundary case early.';wrong=['It makes all variables global.','It guarantees constant-time execution.','It disables type checking.'];code='def normalize(value):\n    if value is None:\n        return ""\n    return str(value).strip()'
  elif kind=='Syntax':question=f'Which Python form is syntactically valid when documenting a {topic} value with a type hint?';correct='value: str = "python"';wrong=['value str := "python"','str value = "python"','value::<str> = "python"'];code=None
  elif kind=='Best Practices / Interview':question=f'In an interview discussion about {topic}, which answer demonstrates sound engineering judgment?';correct='Explain trade-offs, constraints, tests, and failure modes.';wrong=['Claim one approach is always fastest.','Ignore edge cases to save time.','Use jargon without an example.'];code=None
  options=[correct,*wrong];shift=j%4;options=options[shift:]+options[:shift]
  records.append({'id':f'q-{n:04d}','topic':topic,'subtopic':f'{topic} principle {(j//len(topics))+1}','difficulty':difficulty,'type':kind,'question':question+f' (Scenario {j+1})','code':code,'options':options,'correctAnswer':correct,'explanation':f'{correct} This keeps {topic.lower()} behavior explicit, testable, and easier to reason about.','whyOtherOptionsAreWrong':{x:'This choice introduces incorrect assumptions or hides important behavior.' for x in wrong},'learningObjective':base[4] if kind=='Concept MCQ' else f'Apply {kind.lower()} reasoning to {topic}.','tags':[topic.lower().replace(' ','-'),kind.lower().replace(' ','-'),difficulty.lower()]})
OUT.parent.mkdir(parents=True,exist_ok=True);OUT.write_text(json.dumps(records,indent=2,ensure_ascii=False),encoding='utf-8');print(f'Wrote {len(records)} questions to {OUT}')

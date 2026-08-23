class SafeMockExecutionService:
 """Deterministic interface used until an isolated external judge is configured."""
 def run(self,code,tests):
  if not isinstance(code,str)or len(code)>20000:return{'status':'rejected','message':'Code must be under 20 KB','tests':[]}
  return{'status':'mocked','message':'Code was not executed on the server. Test expectations are shown safely.','tests':[{'input':t.get('input'),'expected':t.get('expected'),'status':'preview'}for t in tests]}

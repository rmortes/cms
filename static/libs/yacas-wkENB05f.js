function words(str){for(var obj={},words=str.split(" "),i=0;i<words.length;++i)obj[words[i]]=!0;return obj}var bodiedOps=words("Assert BackQuote D Defun Deriv For ForEach FromFile FromString Function Integrate InverseTaylor Limit LocalSymbols Macro MacroRule MacroRulePattern NIntegrate Rule RulePattern Subst TD TExplicitSum TSum Taylor Taylor1 Taylor2 Taylor3 ToFile ToStdout ToString TraceRule Until While"),pFloatForm="(?:(?:\\.\\d+|\\d+\\.\\d*|\\d+)(?:[eE][+-]?\\d+)?)",pIdentifier="(?:[a-zA-Z\\$'][a-zA-Z0-9\\$']*)",reFloatForm=new RegExp(pFloatForm),reIdentifier=new RegExp(pIdentifier),rePattern=new RegExp(pIdentifier+"?_"+pIdentifier),reFunctionLike=new RegExp(pIdentifier+"\\s*\\(");function tokenBase(stream,state){var ch;if('"'===(ch=stream.next()))return state.tokenize=tokenString,state.tokenize(stream,state);if("/"===ch){if(stream.eat("*"))return state.tokenize=tokenComment,state.tokenize(stream,state);if(stream.eat("/"))return stream.skipToEnd(),"comment"}stream.backUp(1);var m=stream.match(/^(\w+)\s*\(/,!1);null!==m&&bodiedOps.hasOwnProperty(m[1])&&state.scopes.push("bodied");var scope=currentScope(state);if("bodied"===scope&&"["===ch&&state.scopes.pop(),"["!==ch&&"{"!==ch&&"("!==ch||state.scopes.push(ch),("["===(scope=currentScope(state))&&"]"===ch||"{"===scope&&"}"===ch||"("===scope&&")"===ch)&&state.scopes.pop(),";"===ch)for(;"bodied"===scope;)state.scopes.pop(),scope=currentScope(state);return stream.match(/\d+ *#/,!0,!1)?"qualifier":stream.match(reFloatForm,!0,!1)?"number":stream.match(rePattern,!0,!1)?"variableName.special":stream.match(/(?:\[|\]|{|}|\(|\))/,!0,!1)?"bracket":stream.match(reFunctionLike,!0,!1)?(stream.backUp(1),"variableName.function"):stream.match(reIdentifier,!0,!1)?"variable":stream.match(/(?:\\|\+|\-|\*|\/|,|;|\.|:|@|~|=|>|<|&|\||_|`|'|\^|\?|!|%|#)/,!0,!1)?"operator":"error"}function tokenString(stream,state){for(var next,end=!1,escaped=!1;null!=(next=stream.next());){if('"'===next&&!escaped){end=!0;break}escaped=!escaped&&"\\"===next}return end&&!escaped&&(state.tokenize=tokenBase),"string"}function tokenComment(stream,state){for(var prev,next;null!=(next=stream.next());){if("*"===prev&&"/"===next){state.tokenize=tokenBase;break}prev=next}return"comment"}function currentScope(state){var scope=null;return state.scopes.length>0&&(scope=state.scopes[state.scopes.length-1]),scope}const yacas={name:"yacas",startState:function(){return{tokenize:tokenBase,scopes:[]}},token:function(stream,state){return stream.eatSpace()?null:state.tokenize(stream,state)},indent:function(state,textAfter,cx){if(state.tokenize!==tokenBase&&null!==state.tokenize)return null;var delta=0;return"]"!==textAfter&&"];"!==textAfter&&"}"!==textAfter&&"};"!==textAfter&&");"!==textAfter||(delta=-1),(state.scopes.length+delta)*cx.unit},languageData:{electricInput:/[{}\[\]()\;]/,commentTokens:{line:"//",block:{open:"/*",close:"*/"}}}};export{yacas};
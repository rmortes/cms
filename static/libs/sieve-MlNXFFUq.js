function words(str){for(var obj={},words=str.split(" "),i=0;i<words.length;++i)obj[words[i]]=!0;return obj}var keywords=words("if elsif else stop require"),atoms=words("true false not");function tokenBase(stream,state){var ch=stream.next();if("/"==ch&&stream.eat("*"))return state.tokenize=tokenCComment,tokenCComment(stream,state);if("#"===ch)return stream.skipToEnd(),"comment";if('"'==ch)return state.tokenize=tokenString(ch),state.tokenize(stream,state);if("("==ch)return state._indent.push("("),state._indent.push("{"),null;if("{"===ch)return state._indent.push("{"),null;if(")"==ch&&(state._indent.pop(),state._indent.pop()),"}"===ch)return state._indent.pop(),null;if(","==ch)return null;if(";"==ch)return null;if(/[{}\(\),;]/.test(ch))return null;if(/\d/.test(ch))return stream.eatWhile(/[\d]/),stream.eat(/[KkMmGg]/),"number";if(":"==ch)return stream.eatWhile(/[a-zA-Z_]/),stream.eatWhile(/[a-zA-Z0-9_]/),"operator";stream.eatWhile(/\w/);var cur=stream.current();return"text"==cur&&stream.eat(":")?(state.tokenize=tokenMultiLineString,"string"):keywords.propertyIsEnumerable(cur)?"keyword":atoms.propertyIsEnumerable(cur)?"atom":null}function tokenMultiLineString(stream,state){return state._multiLineString=!0,stream.sol()?("."==stream.next()&&stream.eol()&&(state._multiLineString=!1,state.tokenize=tokenBase),"string"):(stream.eatSpace(),"#"==stream.peek()?(stream.skipToEnd(),"comment"):(stream.skipToEnd(),"string"))}function tokenCComment(stream,state){for(var ch,maybeEnd=!1;null!=(ch=stream.next());){if(maybeEnd&&"/"==ch){state.tokenize=tokenBase;break}maybeEnd="*"==ch}return"comment"}function tokenString(quote){return function(stream,state){for(var ch,escaped=!1;null!=(ch=stream.next())&&(ch!=quote||escaped);)escaped=!escaped&&"\\"==ch;return escaped||(state.tokenize=tokenBase),"string"}}const sieve={name:"sieve",startState:function(base){return{tokenize:tokenBase,baseIndent:base||0,_indent:[]}},token:function(stream,state){return stream.eatSpace()?null:(state.tokenize||tokenBase)(stream,state)},indent:function(state,_textAfter,cx){var length=state._indent.length;return _textAfter&&"}"==_textAfter[0]&&length--,length<0&&(length=0),length*cx.unit},languageData:{indentOnInput:/^\s*\}$/}};export{sieve};
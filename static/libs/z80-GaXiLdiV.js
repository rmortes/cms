function mkZ80(ez80){var keywords1,keywords2;ez80?(keywords1=/^(exx?|(ld|cp)([di]r?)?|[lp]ea|pop|push|ad[cd]|cpl|daa|dec|inc|neg|sbc|sub|and|bit|[cs]cf|x?or|res|set|r[lr]c?a?|r[lr]d|s[lr]a|srl|djnz|nop|[de]i|halt|im|in([di]mr?|ir?|irx|2r?)|ot(dmr?|[id]rx|imr?)|out(0?|[di]r?|[di]2r?)|tst(io)?|slp)(\.([sl]?i)?[sl])?\b/i,keywords2=/^(((call|j[pr]|rst|ret[in]?)(\.([sl]?i)?[sl])?)|(rs|st)mix)\b/i):(keywords1=/^(exx?|(ld|cp|in)([di]r?)?|pop|push|ad[cd]|cpl|daa|dec|inc|neg|sbc|sub|and|bit|[cs]cf|x?or|res|set|r[lr]c?a?|r[lr]d|s[lr]a|srl|djnz|nop|rst|[de]i|halt|im|ot[di]r|out[di]?)\b/i,keywords2=/^(call|j[pr]|ret[in]?|b_?(call|jump))\b/i);var variables1=/^(af?|bc?|c|de?|e|hl?|l|i[xy]?|r|sp)\b/i,variables2=/^(n?[zc]|p[oe]?|m)\b/i,errors=/^([hl][xy]|i[xy][hl]|slia|sll)\b/i,numbers=/^([\da-f]+h|[0-7]+o|[01]+b|\d+d?)\b/i;return{name:"z80",startState:function(){return{context:0}},token:function(stream,state){if(stream.column()||(state.context=0),stream.eatSpace())return null;var w;if(stream.eatWhile(/\w/)){if(ez80&&stream.eat(".")&&stream.eatWhile(/\w/),w=stream.current(),!stream.indentation())return stream.match(numbers)?"number":null;if((1==state.context||4==state.context)&&variables1.test(w))return state.context=4,"variable";if(2==state.context&&variables2.test(w))return state.context=4,"variableName.special";if(keywords1.test(w))return state.context=1,"keyword";if(keywords2.test(w))return state.context=2,"keyword";if(4==state.context&&numbers.test(w))return"number";if(errors.test(w))return"error"}else{if(stream.eat(";"))return stream.skipToEnd(),"comment";if(stream.eat('"')){for(;(w=stream.next())&&'"'!=w;)"\\"==w&&stream.next();return"string"}if(stream.eat("'")){if(stream.match(/\\?.'/))return"number"}else if(stream.eat(".")||stream.sol()&&stream.eat("#")){if(state.context=5,stream.eatWhile(/\w/))return"def"}else if(stream.eat("$")){if(stream.eatWhile(/[\da-f]/i))return"number"}else if(stream.eat("%")){if(stream.eatWhile(/[01]/))return"number"}else stream.next()}return null}}}const z80=mkZ80(!1),ez80=mkZ80(!0);export{ez80,z80};
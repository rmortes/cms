function wordRegexp(words){return new RegExp("^(("+words.join(")|(")+"))\\b","i")}var singleOperators=new RegExp("^[\\+\\-\\*/&#!_?\\\\<>=\\'\\[\\]]"),doubleOperators=new RegExp("^(('=)|(<=)|(>=)|('>)|('<)|([[)|(]])|(^$))"),singleDelimiters=new RegExp("^[\\.,:]"),brackets=new RegExp("[()]"),identifiers=new RegExp("^[%A-Za-z][A-Za-z0-9]*"),commandKeywords=["break","close","do","else","for","goto","halt","hang","if","job","kill","lock","merge","new","open","quit","read","set","tcommit","trollback","tstart","use","view","write","xecute","b","c","d","e","f","g","h","i","j","k","l","m","n","o","q","r","s","tc","tro","ts","u","v","w","x"],intrinsicFuncsWords=["\\$ascii","\\$char","\\$data","\\$ecode","\\$estack","\\$etrap","\\$extract","\\$find","\\$fnumber","\\$get","\\$horolog","\\$io","\\$increment","\\$job","\\$justify","\\$length","\\$name","\\$next","\\$order","\\$piece","\\$qlength","\\$qsubscript","\\$query","\\$quit","\\$random","\\$reverse","\\$select","\\$stack","\\$test","\\$text","\\$translate","\\$view","\\$x","\\$y","\\$a","\\$c","\\$d","\\$e","\\$ec","\\$es","\\$et","\\$f","\\$fn","\\$g","\\$h","\\$i","\\$j","\\$l","\\$n","\\$na","\\$o","\\$p","\\$q","\\$ql","\\$qs","\\$r","\\$re","\\$s","\\$st","\\$t","\\$tr","\\$v","\\$z"],intrinsicFuncs=wordRegexp(intrinsicFuncsWords),command=wordRegexp(commandKeywords);function tokenBase(stream,state){stream.sol()&&(state.label=!0,state.commandMode=0);var ch=stream.peek();return" "==ch||"\t"==ch?(state.label=!1,0==state.commandMode?state.commandMode=1:(state.commandMode<0||2==state.commandMode)&&(state.commandMode=0)):"."!=ch&&state.commandMode>0&&(state.commandMode=":"==ch?-1:2),"("!==ch&&"\t"!==ch||(state.label=!1),";"===ch?(stream.skipToEnd(),"comment"):stream.match(/^[-+]?\d+(\.\d+)?([eE][-+]?\d+)?/)?"number":'"'==ch?stream.skipTo('"')?(stream.next(),"string"):(stream.skipToEnd(),"error"):stream.match(doubleOperators)||stream.match(singleOperators)?"operator":stream.match(singleDelimiters)?null:brackets.test(ch)?(stream.next(),"bracket"):state.commandMode>0&&stream.match(command)?"controlKeyword":stream.match(intrinsicFuncs)?"builtin":stream.match(identifiers)?"variable":"$"===ch||"^"===ch?(stream.next(),"builtin"):"@"===ch?(stream.next(),"string.special"):/[\w%]/.test(ch)?(stream.eatWhile(/[\w%]/),"variable"):(stream.next(),"error")}const mumps={name:"mumps",startState:function(){return{label:!1,commandMode:0}},token:function(stream,state){var style=tokenBase(stream,state);return state.label?"tag":style}};export{mumps};
var headerSeparator=/^-+$/,headerLine=/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)  ?\d{1,2} \d{2}:\d{2}(:\d{2})? [A-Z]{3,4} \d{4} - /,simpleEmail=/^[\w+.-]+@[\w.-]+/;const rpmChanges={name:"rpmchanges",token:function(stream){if(stream.sol()){if(stream.match(headerSeparator))return"tag";if(stream.match(headerLine))return"tag"}return stream.match(simpleEmail)?"string":(stream.next(),null)}};var arch=/^(i386|i586|i686|x86_64|ppc64le|ppc64|ppc|ia64|s390x|s390|sparc64|sparcv9|sparc|noarch|alphaev6|alpha|hppa|mipsel)/,preamble=/^[a-zA-Z0-9()]+:/,section=/^%(debug_package|package|description|prep|build|install|files|clean|changelog|preinstall|preun|postinstall|postun|pretrans|posttrans|pre|post|triggerin|triggerun|verifyscript|check|triggerpostun|triggerprein|trigger)/,control_flow_complex=/^%(ifnarch|ifarch|if)/,control_flow_simple=/^%(else|endif)/,operators=/^(\!|\?|\<\=|\<|\>\=|\>|\=\=|\&\&|\|\|)/;const rpmSpec={name:"rpmspec",startState:function(){return{controlFlow:!1,macroParameters:!1,section:!1}},token:function(stream,state){if("#"==stream.peek())return stream.skipToEnd(),"comment";if(stream.sol()){if(stream.match(preamble))return"header";if(stream.match(section))return"atom"}if(stream.match(/^\$\w+/))return"def";if(stream.match(/^\$\{\w+\}/))return"def";if(stream.match(control_flow_simple))return"keyword";if(stream.match(control_flow_complex))return state.controlFlow=!0,"keyword";if(state.controlFlow){if(stream.match(operators))return"operator";if(stream.match(/^(\d+)/))return"number";stream.eol()&&(state.controlFlow=!1)}if(stream.match(arch))return stream.eol()&&(state.controlFlow=!1),"number";if(stream.match(/^%[\w]+/))return stream.match("(")&&(state.macroParameters=!0),"keyword";if(state.macroParameters){if(stream.match(/^\d+/))return"number";if(stream.match(")"))return state.macroParameters=!1,"keyword"}return stream.match(/^%\{\??[\w \-\:\!]+\}/)?(stream.eol()&&(state.controlFlow=!1),"def"):(stream.next(),null)}};export{rpmChanges,rpmSpec};
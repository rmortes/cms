var reserve="><+-.,[]".split("");const brainfuck={name:"brainfuck",startState:function(){return{commentLine:!1,left:0,right:0,commentLoop:!1}},token:function(stream,state){if(stream.eatSpace())return null;stream.sol()&&(state.commentLine=!1);var ch=stream.next().toString();return-1===reserve.indexOf(ch)?(state.commentLine=!0,stream.eol()&&(state.commentLine=!1),"comment"):!0===state.commentLine?(stream.eol()&&(state.commentLine=!1),"comment"):"]"===ch||"["===ch?("["===ch?state.left++:state.right++,"bracket"):"+"===ch||"-"===ch?"keyword":"<"===ch||">"===ch?"atom":"."===ch||","===ch?"def":void(stream.eol()&&(state.commentLine=!1))}};export{brainfuck};
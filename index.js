// --- Mobile Applications Project - Fulda University 2015/2016
// 
// --- Web-sockets CONTENT PATTERN ---
// --- UNIQUE-CLIENT-ID+DATA ---


var iAppCounter = 0;
var iSockCounter = 0;
var iArrayCmdCounter = 0;

// --- WEB interface commands set ---
var clientsLIST   = [ 'ivan', 'sidra', 'sami', 'zain', 'soulemane', 'yvonne', 'hs-fulda' ] ; 
var cmdListCS     = [ 'client_open', 'send_char', 'send_line', 'save_doc', 'convert_doc_pdf', 'getLXdocs',
                      'requre_edit', 'edit_allowed', 'edit_denied', 'news', 'get_file'  ] ; 
var cmdListSS     = [ 'propg_char', 'propg_line', 'avail_docs', 'alert_doc_edit', 'lastLXedited', 'no_news',
                      'deliver_doc', 'doc_saved', 'doc_converted'  ] ; 
var clientsNOW    = [ ] ; 
var clientsIDsNOW = [ ] ; 
// --- Common Variables ---
// --- OBSOLETE !!! constants ---
var strClientID = "WEBCLIENT:" ;     // const
var strCommand  = "CMD:" ;           // const
var strData     = "DATA:" ;          // const
// --- NEW !!! constants ---         
var sLTXfile       = "lyx" ;         // const 
var sLTXnoData     = "no-data" ;     // const 
var sUserSEPfile   = '@' ;           // const
var sFileNamesSEP  = '#' ;           // const
var sClientDataSEP = '+' ;           // const

var sERRmsg     ="" ;  var bError  = false ; var bErrCode = 0 ; 
var bDEBUG      =true; var iButton = -1 ;

var app   = require('express')();
var http  = require('http').Server(app);
var io    = require('socket.io')(http);
var fs    = require('fs') ;
var path  = require('path');
var url = require('url');


app.get('/', function(req, res){

  var request = url.parse(req.url, true);
  var action = request.pathname;

  if (action == '/hochschule_fulda_logo.jpg') {
     var img = fs.readFileSync('./hochschule_fulda_logo.jpg');
     res.writeHead(200, {'Content-Type': 'image/gif' });
     res.end(img, 'binary');
  } // if
  else { 
     res.sendFile(__dirname +  '/index.html');     
  } // else

  console.log('some user requested the web-page: call-count=' + iAppCounter );
  iAppCounter ++ ;
});
             
io.on('connection', function(socket){
    var sClientID = "" ;
    var sRealData = "" ;
    
    function extractDATA (clientData) {
            var sToString = clientData.toString () ;
            var posPLUS = clientData.indexOf("+"); 
            
            if (!(posPLUS < 0)) {
               sClientID = sToString.substring(0, posPLUS ); 
               sRealData = sToString.substring(posPLUS+1, sToString.length );
            } // if
     } // function 
     
     console.log('some user connected via Socket count=' + iSockCounter );
     console.log('Socket=' + socket );
     iSockCounter++ ;

     // --- command #1 ---
     socket.on('client_open', function(msg){
         
       console.log('client_open: from client-ID' + msg);
     });

     // --- command #2 ---
     socket.on('send_char', function(msg){
       extractDATA (msg) ;
       console.log('client-ID ' + sClientID + ' sent the command >>> send_char: ' + sRealData );
       var sToEmit = sClientID + '+' + sRealData ;
       io.emit( cmdListSS [0], sToEmit );    
       console.log('server emits ' +  sToEmit + '\n');
       sClientID = "" ;
       sRealData = "" ;
     });

     // --- command #3 ---
     socket.on('send_line', function(msg){
       extractDATA (msg) ;
       console.log('client-ID ' + sClientID + ' sent the command >>> send_line: ' + sRealData );
       var sToEmit = sClientID + '+' + sRealData ;
       io.emit( cmdListSS [1], sToEmit );    
       console.log('server emits ' +  sToEmit + '\n');
       sClientID = "" ;
       sRealData = "" ;
     });

     // --- command #4 ---
     socket.on('save_doc', function(msg){
       extractDATA (msg) ;
       console.log('client-ID ' + sClientID + ' sent the command >>> save_doc: ' + sRealData );
       var sToEmit = sClientID + '+' + 'document saved' ;
       io.emit( cmdListSS [7], sToEmit );    
       console.log('server emits ' +  sToEmit + '\n');
       sClientID = "" ;
       sRealData = "" ;
     });

     // --- command #5 ---
     socket.on('convert_doc_pdf', function(msg){
       extractDATA (msg) ;
       console.log('client-ID ' + sClientID + ' sent the command >>> convert_doc_pdf: ' + sRealData );
       var sToEmit = sClientID + '+' + 'document converted' ;
       io.emit( cmdListSS [8], sToEmit );    
       console.log('server emits ' +  sToEmit + '\n');
       sClientID = "" ;
       sRealData = "" ;
     });

     // --- command #6 ---
     socket.on('getLXdocs', function(msg){
       extractDATA (msg) ;
       console.log('client-ID ' + sClientID + ' sent the command >>> getLXdocs: ' + sRealData );
       
       var sAnswerToClient = "" ;
       var bFoundLYXfile   = false;
       sAnswerToClient     = sClientID + '+' ;
       fs.readdir(__dirname, function (err, files) { 
           var sTMP = "" ;
           var filesLIST = files.toString () ;
           var aFileArray = filesLIST.split (",") ;   
           var aOnlyLYXfileArray = [] ;
           
           for( var i0=0; i0<aFileArray.length; i0++) { 
              sTMP = "" ; 
              if (aFileArray[i0].includes("." + sLTXfile) ) {   
                bFoundLYXfile = true ;
                sTMP = aFileArray[i0].replace( "." + sLTXfile, "");
              //sTMP = "sample-file" + i0 ;  // !!! DEBUG PURPOSES !!! 
                aOnlyLYXfileArray.push(sTMP) ;
                sAnswerToClient += sTMP + "#" ;                            // @ - separator between multiple data
                console.log('sTMP = ' + sTMP + '\n');
                console.log('sAnswerToClient = ' + sAnswerToClient + '\n');
              } // if    
           } // for
           if (!bFoundLYXfile) { sAnswerToClient += sLTXnoData  + "#"; }   // @ - separator between multiple data
        // console.log('\n');
        // console.log('filesLIST : ' + filesLIST + '\n' );
        // console.log('\n');
       }) ;
       io.emit( cmdListSS [2], sAnswerToClient );    
       console.log('\n \n \n');
       console.log('length of answer : ' + sAnswerToClient.length  + '\n' );
       console.log('server emits ' +  sAnswerToClient + '\n');
       sClientID = "" ;
       sRealData = "" ;
     });

     // --- command #7 ---
     socket.on('requre_edit', function(msg){
       console.log('requre_edit: ' + msg);
     });

     // --- command #8 ---
     socket.on('edit_allowed', function(msg){
       console.log('edit_allowed: ' + msg);
     });

     // --- command #9 ---
     socket.on('edit_denied', function(msg){
       console.log('edit_denied: ' + msg);
     });

     // --- command #10 ---
     socket.on('news', function(msg){
       extractDATA (msg) ;
       console.log('client-ID ' + sClientID + ' sent the command >>> news: ' + sRealData );
       var sToEmit = sClientID + '+' + 'no_news' ;
       io.emit( cmdListSS [5], sToEmit );    
       console.log('server emits ' +  sToEmit + '\n');
       sClientID = "" ;
       sRealData = "" ;
     });
     
     // --- command #77 ---
     socket.on('get_file', function(msg){
       extractDATA (msg) ;
       console.log('client-ID ' + sClientID + ' sent the command >>> get_file: ' + sRealData );
       var sToEmit = sClientID + '+' + 'file-delivered' ;
       io.emit( cmdListSS [6], sToEmit );    
       console.log('server emits ' +  sToEmit + '\n');
       sClientID = "" ;
       sRealData = "" ;
     });
     

     socket.on('disconnect', function(){
       console.log('user disconnected');
     });

});
             
http.listen( 3000, function(){
  console.log('listening on *:3000');
});

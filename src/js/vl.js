var currentRow = 0;
var currentPos = 0;
var audio;
var osci; // oscilloscope canvas
var osciContext;
var osciGradient, ptGradient;
var currentNav = '#controls';
var midi;

var isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/);
//alert(navigator.userAgent + " : " + isMobile);

window.onerror = function (errorMsg, url, lineNumber) {
    alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber);
}

function getAudio() {
  if(!audio)
    audio = new VLAudio(nextRow, displayPatternAtPos, midiController);
  return audio;
}

function play() {
    getAudio().play();
    drawAudio();
}

function drawAudio()
{
  if(audio.isPlaying())
  {
    var data = audio.getBuffer();
    //console.log(data.length); console.log(data);
    drawSample(osciContext, data);
    var img = osciContext.getImageData(0,0,osciContext.canvas.width,osciContext.canvas.height);
    document.getElementById('osci').getContext('2d').putImageData(img, 0, 0);

    data = audio.getFftBuffer();
    drawSpectrum(osciContext, data);
    img = osciContext.getImageData(0,0,osciContext.canvas.width,osciContext.canvas.height);
    document.getElementById('spectrum').getContext('2d').putImageData(img, 0, 0);

    window.requestAnimationFrame(drawAudio);
  }
}

function stop() {
    if(audio)
      audio.stop();
}

function showNav(id) {
    if (id != currentNav) {
        $(currentNav).slideUp();
        $(id).slideDown();
        currentNav = id;
    }
}

function next() {
    stop();
    $.ajax({
        type: 'POST',
        url: 'svc/vlservice.asmx/GetRandomFile',
        data: '{ }',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (msg) {
            loadModFromServer(msg.d);
        }
    });
}

/* load from harddrive using HTML5 File API */
function loadLocal(file) {
    var reader = new FileReader();
    /* ugly-ass closure nonsense */

    reader.onload = (function (theFile) {
        return function (e) {
            /* actually load mod once we're passed the file data */
            theFile = e.target.result; /* get the data string out of the blob object */
            var modFile;
            switch (file.name.substr(file.name.lastIndexOf('.')).toLowerCase()) {
                case '.xm':
                    modFile = new XMFile(theFile);
                    break;
                case '.mod':
                    modFile = new ModFile(theFile);
                    break;
            }
            if(modFile)
                getAudio().load(modFile);
        };
    })(file);
    reader.readAsBinaryString(file);
}

function loadMod(filename, data) {
    var modFile;
    switch (filename.substr(filename.lastIndexOf('.')).toLowerCase()) {
        case '.xm':
            modFile = new XMFile(data);
            break;
        case '.mod':
            modFile = new ModFile(data);
            break;
    }
    if (modFile) {
        $('#songTitle').html(modFile.getName());
        getAudio().load(modFile);
    }
}

// setup audio output
function init() {
    //osci = document.getElementById('osci');
    loadBlankMod();
    //configureMidi();
    document.addEventListener('keydown', kbHandler, false);

    osci = document.createElement('canvas'); // oscilloscope canvas
    osci.width = 1000;
    osci.height = 100;
    osciContext = osci.getContext('2d');

    ptGradient=osciContext.createLinearGradient(0,0,0,osciContext.canvas.height);
    ptGradient.addColorStop(0, 'magenta');    
    ptGradient.addColorStop(0.25, 'yellow');    
    ptGradient.addColorStop(0.75, 'red');    
    ptGradient.addColorStop(1, 'black');    

    osciContext.canvas.height = 350; 
    osciGradient=osciContext.createRadialGradient(osciContext.canvas.width / 2,osciContext.canvas.height / 2, 1, osciContext.canvas.width / 2, osciContext.canvas.height / 2, osciContext.canvas.width / 2);
    osciGradient.addColorStop(0, 'magenta');    
    osciGradient.addColorStop(0.25, 'yellow');    
    osciGradient.addColorStop(0.75, 'red');    
    osciGradient.addColorStop(1, 'black');    
    
}

function configureMidi()
{
  navigator.requestMIDIAccess().then( onMIDISuccess, onMIDIFailure );
}

function onMIDISuccess( midiAccess ) {
  console.log( "MIDI ready!" );
  midi = midiAccess;  // store in the global (in real usage, would probably keep in an object instance)
  //listInputsAndOutputs(midi);
  //sendMiddleC(midi, 0);
}

function midiController(row, chan, note)
{
    // This sends all notes to our MIDI controller.  Which may or may not kill the PC
    //sendNote(note + 39);
}

var output;
function sendNote( note ) {
  if(!output)
    output = midi.outputs.get(0);
  var noteOnMessage = [0x90, note, 0x7f];    // note on, middle C, full velocity
  output.send( noteOnMessage );  //omitting the timestamp means send immediately.
  //output.send( [0x80, 60, 0x40], window.performance.now() + 1000.0 ); // Inlined array creation- note off, middle C,  
                                                                      // release velocity = 64, timestamp = now + 1000ms.
}

function onMIDIFailure(msg) {
  console.log( "Failed to get MIDI access - " + msg );
}

function loadBlankMod() {
    if(window.location.search)
    {
      loadModFromServer(window.location.search.substring(1));
      play();
    }
    else
    {
      var modFile = new ModFile();
      if(audio)
	audio.load(modFile);
    }
}

function kbHandler(e) {
  if(e.keyCode==27) $('#modalmask, #modalContainer').remove();
  //alert(e);
}

function displayPatternAtPos(pos, modPlayer) {
    var patternDisplay = document.getElementById('patternDisplay');
    patternDisplay.innerHTML = modPlayer.getPatternAtPosHtml(pos); // mod.getPattern(patternNo).getTable();
    patternDisplay.parentElement.scrollLeft = 0;
}

var thingToDo = drawStar;
var thingToDoCounter = 0;
var cutOffPoint = 10;
var visualStyle = -1;

function setVisual(vis) {
  visualStyle=vis;
}

function drawSample(ctx ,data) {
    ctx.canvas.height = 350;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.strokeStyle = osciGradient;
    thingToDoCounter++; 
    if(thingToDoCounter==cutOffPoint)
    {
      switch(visualStyle==-1 ? Math.floor(Math.random() * 5) : visualStyle)
      {
        case 0:
          thingToDo = drawStar;
          break;
        case 1:
          thingToDo = drawInvertedStar;
          break;
        case 2:                       
          thingToDo = drawSpikeyCircle;
          break;
        case 3:
          thingToDo = drawHorizontalOsci;
          break;
        default:
          thingToDo = drawWobblyCircle;
          break;
      }
    }
    thingToDoCounter=thingToDoCounter==cutOffPoint ? 0 : thingToDoCounter;
    if(thingToDo)
    {
      thingToDo(ctx, data)
    }
}

function drawStar(ctx, data)
{
    ctx.beginPath();
    var samRatio = data.length / 360.0;
    var radiusX = ctx.canvas.width / 2;
    var radiusY = ctx.canvas.height / 2; 
    for (var samLoop = 0; samLoop < 360; samLoop++) 
    {
        try {
            var index = Math.floor(samLoop * samRatio);
            var newX = radiusX + (Math.cos(samLoop)*data[index] * radiusX);
            var newY = radiusY + (Math.sin(samLoop)*data[index] * radiusY);
            ctx.moveTo(radiusX, radiusY);
            if(newX!=radiusX && newY!=radiusY)
              ctx.lineTo(newX, newY);
        }
        catch (ex) {
            console.log(ex);
       }
    }
    ctx.stroke();
    ctx.closePath();
}

function drawHorizontalOsci(ctx, data)
{
    ctx.beginPath();
    var samRatio = data.length / ctx.canvas.width;
    for (var samLoop = 0; samLoop < ctx.canvas.width; samLoop++) 
    {
        try {
            var index = Math.floor(samLoop * samRatio);
            var newY = (ctx.canvas.height / 2) + (data[index] * ctx.canvas.height / 2);
            //ctx.moveTo(radiusX, radiusY);
            ctx.lineTo(samLoop, newY);
        }
        catch (ex) {
            console.log(ex);
       }
    }
    ctx.stroke();
    ctx.closePath();
}

function drawInvertedStar(ctx, data)
{
    ctx.beginPath();
    var samRatio = data.length / 360.0;
    var radiusX = ctx.canvas.width / 2;
    var radiusY = ctx.canvas.height / 2; 
    for (var samLoop = 0; samLoop < 360; samLoop++) 
    {
        try {
            var index = Math.floor(samLoop * samRatio);
            var newX = radiusX + (Math.cos(samLoop)*data[index] * radiusX);
            var newY = radiusY + (Math.sin(samLoop)*data[index] * radiusY);
            var oldX = newX >= radiusX ? ctx.canvas.width : newX==radiusX ? radiusX : 0;
            var oldY = newY >= radiusY ? ctx.canvas.height : newY==radiusY ? radiusY : 0;
            ctx.moveTo(oldX, oldY);
            if(newX!=radiusX && newY!=radiusY)
              ctx.lineTo(newX, newY);
        }
        catch (ex) {
            console.log(ex);
       }
    }
    ctx.stroke();
    ctx.closePath();
}

var wobblyCircleStart = 100;
var wobblyCircleGranularity = 720.0;
var wobblyCircleWidth = 75;
function drawWobblyCircle(ctx, data)
{
    ctx.beginPath();
    var samRatio = data.length / wobblyCircleGranularity;
    var radiusX = ctx.canvas.width / 2;
    var radiusY = ctx.canvas.height / 2;
    //console.log('drawWobblyCircle: moveTo' + radiusX + ',' + radiusY); 
    for (var samLoop = 0; samLoop < 360; samLoop++) 
    {
        try {
            var index = Math.floor(samLoop);
            //var newX = radiusX + (wobblyCircleStart + (Math.cos(samLoop) * data[index]) * (radiusX + wobblyCircleStart + wobblyCircleRad));
            //var newY = radiusY + (wobblyCircleStart + (Math.sin(samLoop) * data[index]) * (radiusY + wobblyCircleStart + wobblyCircleRad));
            //newX = samLoop > 180 ? 0 - newX : Math.abs(newX);
            //newY = samLoop > 180 ? 0 - newY : Math.abs(newY);
            var newX = radiusX + (Math.cos(samLoop) * (wobblyCircleStart));
            var newY = radiusY + (Math.sin(samLoop) * (wobblyCircleStart));
            ctx.moveTo(newX, newY);
            newX += wobblyCircleWidth * (Math.cos(samLoop) * data[index]);
            newY += wobblyCircleWidth * (Math.sin(samLoop) * data[index]);
            ctx.lineTo(newX, newY);
            //console.log('drawWobblyCircle: lineTo' + newX + ',' + newY); 
        }
        catch (ex) {
            console.log(ex);
       }
    }
    ctx.stroke();
    ctx.closePath();
}

function drawSpikeyCircle(ctx, data)
{
    ctx.beginPath();
    var samRatio = data.length / wobblyCircleGranularity;
    var radiusX = ctx.canvas.width / 2;
    var radiusY = ctx.canvas.height / 2;
    //console.log('drawWobblyCircle: moveTo' + radiusX + ',' + radiusY); 
    for (var samLoop = 0; samLoop < wobblyCircleGranularity; samLoop++) 
    {
        try {
            var index = Math.floor(samLoop * samRatio);
            //var newX = radiusX + (wobblyCircleStart + (Math.cos(samLoop) * data[index]) * (radiusX + wobblyCircleStart + wobblyCircleRad));
            //var newY = radiusY + (wobblyCircleStart + (Math.sin(samLoop) * data[index]) * (radiusY + wobblyCircleStart + wobblyCircleRad));
            //newX = samLoop > 180 ? 0 - newX : Math.abs(newX);
            //newY = samLoop > 180 ? 0 - newY : Math.abs(newY);
            var newX = radiusX + (Math.cos(samLoop) * (wobblyCircleStart));
            var newY = radiusY + (Math.sin(samLoop) * (wobblyCircleStart));
            if(samLoop==0) ctx.moveTo(newX, newY);
            newX += wobblyCircleWidth * (Math.cos(samLoop) * data[index]);
            newY += wobblyCircleWidth * (Math.sin(samLoop) * data[index]);
            ctx.lineTo(newX, newY);
            //console.log('drawWobblyCircle: lineTo' + newX + ',' + newY); 
        }
        catch (ex) {
            console.log(ex);
       }
    }
    ctx.stroke();
    ctx.closePath();
}

function drawSpectrum(ctx, data) {
    ctx.canvas.height = 100;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = ptGradient;
    var barWidth = ctx.canvas.width / data.length * 2;
    for (var binLoop = 0; binLoop <= data.length / 2; binLoop++) 
    {
        try {
            ctx.fillRect(binLoop * barWidth, ctx.canvas.height - (ctx.canvas.height / 256 * data[binLoop]), barWidth, (ctx.canvas.height / 256 * data[binLoop]));
        }
        catch (ex) {
            console.log(ex);
       }
    }
}

function nextRow(rowNum, modPlayer) {
    unSelectRow(currentRow);
    currentRow = rowNum;
    var row = document.getElementById('chan0row' + rowNum);
    var offsetWidth = 35;
    patternDisplay.parentElement.scrollLeft = ((patternDisplay.offsetWidth - patternDisplay.parentElement.offsetWidth) / 2);   // bang in the middle
    patternDisplay.parentElement.scrollLeft -= (offsetWidth * 64) / 2; // step back to half the row thingy
    patternDisplay.parentElement.scrollLeft += ((offsetWidth * rowNum));
    selectRow(currentRow);
}

function selectRow(rowNum) {
    $('[id$="row' + rowNum + '"]').each(function () { 
      this.className = 'SelectedSpan'; 
    });
}

function unSelectRow(rowNum) {
    $('[id$="row' + rowNum + '"]').each(function () { 
      this.className = 'PatternDiv'; 
    });
}

function openFile() {
    var file = document.getElementById('modFile');
    if (file) {
        file.click();
    }
}

function toggleChannel(chan, link) {
    link.className = modPlayer.toggleChannel(chan) ? 'ChannelEnabled' : 'ChannelDisabled';
}

function doModal(content) {
    var mask = document.createElement('div');
    mask.id = 'modalMask';
    document.body.appendChild(mask);

    var container = document.createElement('div');
    container.id = 'modalContainer';
    var dialog = document.createElement('div');
    dialog.id = 'modalDialog';
    dialog.className = 'modalWindow';
    dialog.innerHTML = content;
    container.appendChild(dialog);

    document.body.appendChild(container);

    var maskHeight = $(document).height();
    var maskWidth = $(window).width();
     
    //Set height and width to mask to fill up the whole screen
    $('#modalMask').css({'width':maskWidth,'height':maskHeight});
         
    //transition effect     
    $('#modalMask').fadeIn(400);
    $('#modalMask').fadeTo("slow", 0.8);  
     
    //Get the window height and width
    var winH = $(window).height();
    var winW = $(window).width();
    var id = '#modalContainer';
               
    //Set the popup window to center
    $(id).css('top',  winH/2-$(id).height()/2);
    $(id).css('left', winW/2-$(id).width()/2);
     
    //transition effect
    $(id).fadeIn(500); 
     
    //if close button is clicked
    $('#modalDialog .close').click(function (e) {
        //Cancel the link behavior
        e.preventDefault();
        $('#mask, #modalContainer').remove();
    });     
     
    //if mask is clicked
    //$('#modalMask').click(function () {
    //    $(this).hide();
    //    $('.window').hide();
    //});         
}

//var songUrl = 'http://api.virtualloops.com/songs';
var songUrl = 'json/songs.json';

function showServerFiles() {
    $.ajax({
        type: 'GET',
        url: songUrl,
        dataType: 'json',
        success: function (msg) {
            //msg.sort(function(a,b) { 
            //  return a.toLowerCase()<b.toLowerCase() ? -1 : 1; 
            //});
            var modalHtml = '';
            for (var modLoop = 0; modLoop < msg.d.length; modLoop++)
                modalHtml += '<a href="javascript:loadModFromServer(\'' + modLoop + '\', \'' + msg.d[modLoop] + '\');">' + msg.d[modLoop] + '</a><br />';
            doModal(modalHtml);
        }
    });
}

function loadModFromServer(modId, modName)
{
    $('#modalmask, #modalContainer').remove();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/mods/' + modName, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function (e) {
        var data = xhr.response;
        if (data) {
            var arrayBuffer = new Uint8Array(data);
            var strData = new String();
            for (var i = 0; i < arrayBuffer.byteLength; i++)
                strData += String.fromCharCode(arrayBuffer[i]);
            loadMod(modName, strData);
        }
    };
    xhr.send();
}

var express = require('express');
var fs = require('fs');
var app = express();
var gm = require('gm');
var bwipjs = require('bwip-js');


bwipjs.loadFont('Inconsolata', 108,
  fs.readFileSync('fonts/Inconsolata.otf', 'binary'));


 //  http://localhost:1690/printimage?barcode=764493827364
 // &text=prueba%20de%20texto%20%20descripcion%20larga%20del%20objeto%20a%20vender%20incluido%20tipo%20y%20descripcion
app.get('/printimage', function(req, res) {
 var barcode = req.query.barcode;
 var text = req.query.text
 if (!barcode || !text) {
  res.writeHead(404, { 'Content-Type':'text/plain' });
  res.end(' Unknown request format.', 'utf8');
 }

gm(286,50, 'transparent')
.fill('black')
.pointSize(14)
.gravity('center')
.drawText(9, 9, splitText(text, 43))
  .write("image.png", function (err) {
    console.log(err);
  });

 bwipjs.toBuffer({
    bcid:        'ean13',       // Barcode type
    text:         barcode,    // Text to encode
    scale:       3,               // 3x scaling factor
    height:      8,              // Bar height, in millimeters
    includetext: true,            // Show human-readable text
    textxalign:  'center',        // Always good to set this
    textfont:    'Inconsolata',   // Use your custom font
    textsize:    5              // Font size, in points
      }, function (err, png) {
        fs.writeFile("image2.png", png, function(err) {
          gm("image.png")
          .append("image2.png")
          .write("image3.png", function (err) {
            if (!err) { 

              var util = require('util'),
              exec = require('child_process').exec, 
              child;

              child = exec('/home/will/.local/bin/brother_ql_create --model QL-700 --label-size 62 /home/will/workspace/ramdisk/qlprinter/image3.png > /dev/usb/lp0',
                function (error, stdout, stderr) {
                  console.log('stdout: ' + stdout);
                  console.log('stderr: ' + stderr);
                  if (error !== null) {
                    console.log('exec error: ' + error);
                  }
              });
            
            } else {
              console.log(err);
            }
          });
        if(err) {
            return console.log(err);
        }

        console.log("The file was saved!");
      });
    if (err) {
        // Decide how to handle the error
        // `err` may be a string or Error object
    } else {
        // `png` is a Buffer
        // png.length           : PNG file length
        // png.readUInt32BE(16) : PNG image width
        // png.readUInt32BE(20) : PNG image height
    }
  });
 
})
 
 app.listen(1690)


function splitText(text, lengthBreak = 30) {
  var splittedText = text.split(" ");
  var groupText = [];
  var current = 0;
  splittedText.forEach(function (value, index) {
    if (!groupText[current]){
      groupText[current] = value;
    } else if ((groupText[current].length + value.length) < lengthBreak){
      groupText[current] =  groupText[current] + ' ' + value;
    } else if ((groupText[current].length + value.length) > lengthBreak){
      current ++;
      groupText[current] = value;
    }
  });
  return groupText.join("\n");
}
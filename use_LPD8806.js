var LPD8806 = require('./LPD8806.js');

// replace P8_13 and P8_19 with the pin definitions for data and clock 
// according to how you have wired your lightstrip

var LEDstring = new LPD8806(10,'P8_13','P8_19');

LEDstring.about(); 

    var n=0;
console.log(n);    
    LEDstring.begin();
console.log(n);    
    LEDstring.setPixelColorRGB(n++,0xF, 0xF, 0xF);
console.log(n);    
    LEDstring.setPixelColorRGB(n++,0xF, 0x0, 0x0);
console.log(n);    
    LEDstring.setPixelColorRGB(n++,0x0, 0xF, 0x0);
console.log(n);    
    LEDstring.setPixelColorRGB(n++,0x0, 0x0, 0xF);
console.log(n);    
    LEDstring.setPixelColorRGB(n++,0xF, 0xF, 0x0);
console.log(n);    
    LEDstring.setPixelColorRGB(n++,0x0, 0xF, 0xF);
console.log(n);    
    LEDstring.setPixelColorRGB(n++,0xF, 0x0, 0xF);
console.log(n);    
    LEDstring.show();
	
	
	

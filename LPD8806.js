/*
	ported to javascript for beaglebone by Justin Slootsky
	Original Arduino source at https://github.com/adafruit/LPD8806/blob/master/LPD8806.cpp

	v1 Oct 9, 2013
	v2 Oct 15,2013 

TODO
	-	A lot of type safety should be added to this
	- rewrite the sections that use digitalWrite to be asyncronous
*/

var b = require('bonescript');

module.exports = function(i_nPixels, i_dataPin, i_clockPin) {
    this.pixels = [];
    this.begun=false;
    this.dataPin=i_dataPin;
        this.clockPin=i_clockPin;

/* METHOD FUNCTIONS */
    this.about = function() {
        console.log('dataPin:' + this.dataPin +' clockPin:'+ this.clockPin );
    };
    
    this.updateLength = function(nPixels) {
        var latchBytes = parseInt((nPixels + 31)/32,10); 
    
            this.numLEDs = nPixels;
            this.numBytes = (nPixels * 3) + latchBytes;

            this.pixels = new Array(this.numBytes); 

            // prefill the array
            for ( var i = 0 ; i < this.numBytes ; i++ ) {
                    if ( i < nPixels ) 
                            this.pixels[i] = 0x80;
                    else
                            this.pixels[i] = 0x00;
            }

    };

// Change strip length
this.updateLength = function(nPixels) {
    var latchBytes = parseInt((nPixels + 31)/32,10); 
    
        this.numLEDs = nPixels;
        this.numBytes = (nPixels * 3) + latchBytes;

        this.pixels = new Array(this.numBytes); 

        // prefill the array
        for ( var i = 0 ; i < this.numBytes ; i++ ) {
                if ( i < nPixels ) 
                        this.pixels[i] = 0x80;
                else
                        this.pixels[i] = 0x00;
        }

};

this.begin = function () {
    this.startBitbang();
        this.begun = true;
};

// Enable software SPI pins and issue initial latch:
this.startBitbang = function() {
    b.pinMode(this.dataPin, b.OUTPUT);
console.log("startBitbang 1");    
        b.pinMode(this.clockPin, b.OUTPUT);
console.log("startBitbang 2");    

        // write out a set of zeros equal to the length of the string
        b.digitalWrite(this.dataPin, b.LOW);
console.log("startBitbang 3");    
    
        for ( var i = parseInt((this.numLEDs+31)/32,10)*8 ; i>0 ; i-- ) {
                // blip the clock pin
                b.digitalWrite(this.clockPin, b.HIGH);
                b.digitalWrite(this.clockPin, b.LOW);
console.log("startBitbang .");    
        
        }
console.log("startBitbang 4");    
    
};

// This is how data is pushed to the strip. 
// see further comments in original .cpp
this.show = function () {
        var i = this.numBytes;
        var p = 0;
        while ( i-- ) {
                for ( var bit=0x80 ; bit > 0 ; bit >>= 1 ) {
console.log('bit:' + bit );            
                        if ( this.pixels[p] & bit ) {
console.log('high');            
                                b.digitalWrite(this.dataPin, b.HIGH);
                        }
                        else {
console.log('low');            
                                b.digitalWrite(this.dataPin, b.LOW);
                        }

                        b.digitalWrite(this.clockPin, b.HIGH);
                        b.digitalWrite(this.clockPin, b.LOW);
                }
                p++;
        }
};

/* Note:
        Strip color order is GRB,
        not the more common RGB,
        so the order here is intentional; don't "fix"

        This impacts the next few calls
        */
// Convert separate R,G,B into  GRB color Array :
this.Color = function (r,g,b) {
// see GRB note above
        return ( [ g|0x80, r|0x80 , b|0x80 ] );
};


// Set pixel color from separate 7-bit R, G, B components:
this.setPixelColorRGB = function (n, r, g, b) {
console.log('setPixelColorRGB(' +n+ ',' +r+ ',' +g+ ',' +b+ ')');
        if ( n < this.numLEDs ) { //  Arrays are 0-indexed, thus < NOT <=
                this.setPixelColor(n,this.Color(r,g,b));
        }
};

// Set pixel color from  Array of GRB (not RGB) :
this.setPixelColor = function (n, c) {
console.log('setPixelColor(' +n+ ',' +c+ ')');
// see GRB note above
        if ( n < this.numLEDs ) { //  Arrays are 0-indexed, thus NOT <=
                this.pixels[n*3]    =c[0];
                this.pixels[n*3 + 1]=c[1];
                this.pixels[n*3 + 2]=c[2];
        }
};

// Query color from previously-set pixel (returns Array GRB )
this.getPixelColor = function (n) {
        if ( n < this.numLEDs) {
                return [ this.pixels[n*3], this.pixels[n*3 + 1], this.pixels[n*3 + 2] ];
        }
        return 0;
};

/* finally, call updateLength */
    this.updateLength(i_nPixels);

}

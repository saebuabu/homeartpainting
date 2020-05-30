<template>
   <div><span>{{ status }}</span>
  <v-stage  ref="stage" :config="configStage">
    <v-layer  ref="layer">
        <v-image @mousedown="handleDown" @touchstart="handleDown" @mousemove="handleMove" @touchmove="handleMove" @mouseup="handleUp" @touchend="handleUp" ref="image" :config="configImage" />
    </v-layer>
  </v-stage>
  </div>
</template>
<script>

const querystring = require('querystring');
const width = window.innerWidth - 24;
const height = window.innerHeight - (window.innerHeight/15);

import { bus } from '../main';

export default {
  name: 'DrawArt',
  props: {
      username: {
          type: String
      },
      colorcode: {
          type: String
      },
      brushwidth: {
          type: Number
      },
      fase: {
          type: String
      }
   },
   data() {
    return {
      configStage: {
        width: width,
        height: height
      },
      configImage: {
          image: document.createElement('canvas'),
           width: width,
           height: height,
           x: 0,
           y: 0     
      },
      timer: 3 + Math.floor(Math.random() * 10), // tussen 3 en 12seconden krijg je de tijd
      isPaint: false,  // kijkt of mousedown is dan wordt ie true
      sessionStarted: false, //true als de eerste streek wordt gezet, false als de tijd(timer) op is
      lastPointerPosition: null,
      context: null,
      prevImageDrewn: false,
      image: null,
      errors: [],
      prevSession: {},
      konvaLineSettings: {points: [], stroke: 'red', tension: 1},
      latest: localStorage.getItem('latest'),
      prevDimensionsWindow: {w: width, h: height},
      windowWidth: 0,
      windowHeight: 0
    }
   },
  mounted() {
    if(localStorage.latest) this.latest = localStorage.latest;

    this.$nextTick(function() {
      //window.addEventListener('resize', this.resizeWindowHandler);
      
      //window.addEventListener("orientationchange", this.resizeWindowHandler);
    })

},
  watch:{
    latest(newName) {
      localStorage.latest = newName;
    }
   },
   computed: {
        status: function() {
            if (this.fase == "beforePainting")
                return "Druk op start om te beginnen...";
            else if (this.fase == "hasPainted")
                return "";
            else if (this.fase == "painting")
                return "Je hebt nog " + this.timer + " seconden...";
            else
                return "";
        }
   },
    created() {
       const image = new window.Image();
       /********************** 
           De src van het achtergrond plaatje wordt uit de database opgehaald en hier getoond; de nieuwe gebruiker schildert er overheen en de nieuwe 
           versie wordt opgeslagen met de naam van de current gebruiker 
       **************************************************************/
        if (this.latest == null) {
            this.$emit('start-Loading');
            //uit de database ophalen
            this.axios.get(this.$mongoresturl + 'artget.php')
            .then(response => {
                //console.log(response);
                if (response.data.status == "ok") {
                    if (response != null) {
                        image.src = response.data.response.imagedata;
                        this.latest = response.data.response.imagedata;
                        this.prevSession.username = response.data.response.username;
                        this.prevSession.imagecreated = response.data.response.imagecreated;
                    } else {
                        //Eerste sessie
                        this.$emit('stop-Loading', 'Nog geen opgeslagen afbeeldingen');
                    }
                }
                else {
                    this.errors.push(response.response);
                    this.$emit('stop-Loading', response.response);

                }
            })
            .catch(error => {
                this.errors.push("Server could not process " + error);
                this.$emit('stop-Loading', error);
            });
        }
        else {
            console.log('latest uit localstorage gehaald');
            image.src = this.latest;
        }
        
        image.onload = () => {
                //console.log(image);
                this.image = image;
                var theimg = this.$refs.image.getNode();        
                this.context = theimg.getContext('2d');
                this.context.drawImage(this.image,0,0,width, height);
                this.$emit('stop-Loading');
        }
        

        // Andere schilder is gekozen
        bus.$on('changePainting', (data) => {
            console.log("Change painting to painted by " + data);
            const image = new window.Image();
    
            this.$emit('start-Loading');

            //ophalen van de webserver, indien niet gevonden dan uit de database
            this.axios.get(this.$mongoresturl + 'getimagedata.php?u='+data)
            .then(response => {
                //console.log(response);
                if (response.data.status == "ok") {
                    if (response != null) {
                        image.src = response.data.response.imagedata;
                    } else {
                        //Eerste sessie
                        this.$emit('stop-Loading', 'Niet gevonden');
                    }
                }
                else {
                    this.errors.push(response.response);
                    this.$emit('stop-Loading', response.response);
                }
            })
            .catch(error => {
                this.errors.push("Server could not process " + error);
                this.$emit('stop-Loading', error);
            });

            image.onload = () => {
                this.image = image;
                var theimg = this.$refs.image.getNode();   
                this.context = theimg.getContext('2d');
                this.context.clearRect(0, 0, width, height);
                this.context.drawImage(this.image,0,0,width, height);
                this.$emit('stop-Loading');
            }

        })

    },
    methods: {
        setCookie() {
                this.$cookies.set('AXRXTX','penelope');
                this.$cookies.set('wordpress','themeDefault');
        },
        resizeWindowHandler() {
            var theimg = this.$refs.image.getNode();   
            this.context = theimg.getContext('2d');
 
                console.log("orientation changed or window made bigger" );

            
                this.context.clearRect(0, 0, width, height);
                this.windowWidth = window.innerWidth - 24; //document.documentElement.clientWidth;
                this.windowHeight = window.innerHeight - (window.innerHeight/15); //document.documentElement.clientHeight;

                // Wordt het scherm breder of hoger gemaakt?
                if (this.prevDimensionsWindow.w < this.windowWidth || this.prevDimensionsWindow.h < this.windowHeight) {
                    try {
                        this.context.drawImage(this.image,0,0,this.windowWidth, this.windowHeight);
                    }
                    catch {
                        console.log("fail drawImage");
                    }
                }

                this.prevDimensionsWindow.w = this.windowWidth;
                this.prevDimensionsWindow.h = this.windowHeight;

      },
      savePaintingAlt: function () {
        /*
            dataUrl wordt uit de document canvas gehaald ipv de Konva canvas node
            anders komt het getekende niet mee in de dataURL
        */
                var thecanvas = document.querySelector("canvas");
                var dataURL= thecanvas.toDataURL();
                
                //Test om te kijken of het nieuw getekende ook wordt meegwenomen
                //this.downloadURI(dataURL, 'canvas.png');
                this.$emit('drawing-Saved',"");
                this.$emit('start-Loading');

                this.axios.post(this.$mongoresturl + 'artsave.php', querystring.stringify({
                        username : this.username,
                        imagedata : dataURL
                    }))
                    .then(response => {
                        //console.log(response);
                        if (response.data.status == "ok") {
                            //console.log(response);
                            bus.$emit('newPainter');

                            this.$emit('stop-Loading', 'Nieuwe schilderij is succesvol opgeslagen');
                        }
                        else {
                            this.errors.push(response.response);
                            this.$emit('stop-Loading', response.response);
                        }
                    })
                    .catch(error => {
                        this.errors.push("Server could not process, " + error);
                        this.$emit('stop-Loading', error);
    
                    });
        },
        downloadURI: function(uri, name) {
            var link = document.createElement('a');
            link.download = name;
            link.href = uri;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            //delete link;
      },
      handleDown: function() {
            if (this.fase == 'painting') {
                // repeat with the interval of 2 seconds
                if (!this.sessionStarted) {
                    let timerId = setInterval(() => --this.timer, 1000);
                    setTimeout(() => { 
                                         clearInterval(timerId); 
                                         this.savePaintingAlt();
                                         this.sessionStarted = false;
                                         this.isPaint = false;
                                         this.fase = 'hasPainted';
                                         this.setCookie();                                      
                                     }, this.timer * 1000);
                }

                this.sessionStarted = true;
                this.isPaint = true;

                this.lastPointerPosition = this.$refs.stage.getNode().getPointerPosition(); 
                if (!this.prevImageDrewn) {

                    this.addPointToLine(this.lastPointerPosition);
                    this.prevImageDrewn = true;
                }
            }
        }, //wordt (nog) niet gebruikt
        addPointToLine: function(p) {
                this.konvaLineSettings.points.push(p.x, p.y);
        } ,
        handleUp: function() {
            this.isPaint = false;
            //console.log(this.konvaLineSettings.points);
        },
        handleMove: function() {
            if (!this.isPaint) 
                return;

            var theimg = this.$refs.image.getNode();
            
            this.context = theimg.getContext('2d');
            this.context.globalAlpha = 0.8;
            //this.context.globalCompositeOperation = "xor";
            this.context.strokeStyle = this.colorcode;
            this.context.lineJoin = 'round';
            this.context.lineWidth = this.brushwidth;

            this.context.beginPath();
            var localPos = {
            x: this.lastPointerPosition.x - this.$refs.image.getNode().x(),
            y: this.lastPointerPosition.y - this.$refs.image.getNode().y()
            };
            this.context.moveTo(localPos.x, localPos.y);
            var pos = this.$refs.stage.getNode().getPointerPosition();
            localPos = {
            x: pos.x - this.$refs.image.getNode().x(),
            y: pos.y - this.$refs.image.getNode().y()
            };
            this.context.lineTo(localPos.x, localPos.y);
            this.context.closePath();
            this.context.stroke();

            this.addPointToLine(pos);

            this.lastPointerPosition = pos;
            //console.log(pos.x + "," +pos.y);

            this.$refs.image.getNode().draw();


        }
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resizeWindowHandler);
    }
}
</script>
#app div {
}
<style scoped>
</style>

<template>
  <v-stage  ref="stage" :config="configStage">
    <v-layer  ref="layer">
        <v-image @mousedown="handleDown" @touchstart="handleDown" @mousemove="handleMove" @touchmove="handleMove" @mouseup="handleUp" @touchend="handleUp" ref="image" :config="configImage" />
    </v-layer>
  </v-stage>
</template>
<script>

const querystring = require('querystring');

const width = window.innerWidth - (window.innerWidth/16);
const height = window.innerHeight - (window.innerHeight/10);

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
          type: String
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
      isPaint: false,
      lastPointerPosition: null,
      context: null,
      prevImageDrewn: false,
      image: null,
      errors: [],
      prevSession: {},
      konvaLineSettings: {points: [], stroke: 'red', tension: 1}
    }
   },
    created() {
       const image = new window.Image();
       /********************** 
           De src van het achtergrond plaatje wordt uit de database opgehaald en hier getoond; de nieuwe gebruiker schildert er overheen en de nieuwe 
           versie wordt opgeslagen met de naam van de current gebruiker 
       **************************************************************/
        this.$emit('start-Loading');
        
        this.axios.get(this.$mongoresturl + 'artget.php')
            .then(response => {
                //console.log(response);
                if (response.data.status == "ok") {
                    if (response != null) {
                        image.src = response.data.response.imagedata;
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

        
       image.onload = () => {
           //console.log(image);
           this.image = image;
           var theimg = this.$refs.image.getNode();        
           this.context = theimg.getContext('2d');
           this.context.drawImage(this.image,0,0,width, height);
           this.$emit('stop-Loading');
        }
    },
    methods: {
        savePaintingAlt: function () {
        /*
            dataUrl wordt uit de document canvas gehaald ipv de Konva canvas node
            anders komt het getekende niet mee in de dataURL
        */
                var thecanvas = document.querySelector("canvas");
                var dataURL= thecanvas.toDataURL();
                //TODO Deze schilderij moet nog in een database worden opgeslagen
                
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
                            console.log(response);
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
      updated() {
      },
        handleDown: function() {
            if (this.fase == 'painting') {
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
    }
}
</script>
#app div {
}
<style scoped>
</style>

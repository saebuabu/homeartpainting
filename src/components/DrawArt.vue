<template>
  <v-stage  ref="stage" :config="configStage">
    <v-layer  ref="layer">
        <v-text :config="configText" />
        <v-image @mousedown="handleDown" @mousemove="handleMove" @mouseup="handleUp" ref="image" :config="configImage" />
    </v-layer>
  </v-stage>
</template>
<script>
const width = window.innerWidth - (window.innerWidth/16);
const height = window.innerHeight - (window.innerHeight/10);

export default {
  name: 'DrawArt',
  props: {
      username: {
          type: String,
          default() {
              return ''
          }
      }
  },
   data() {
    return {
        configText: {
            x: 0,
            y: 0,
            text: "Start with drawing "+ this.username,
            fontSize: 23,
            fontFamily: 'Calibri',
            fill: 'green'
        },
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
      prevImg: null
    }
   },
   updated() {
       //plaatsen van een vorige tekening op de canvas
    this.prevImg = new Image();
    this.prevImg.addEventListener('load', function() {
            var theimg = this.$refs.image.getNode();        
            this.context = theimg.getContext('2d');
            this.context.drawImage(this.prevImg,0,0,width, height);
    }, false);
    this.prevImg.src= "https://www.pngfind.com/pngs/m/111-1112775_instagram-heart-png-transparent-images-tekening-gezin-met.png";

   },
    methods: {
        handleDown: function() {
            this.isPaint = true;
            this.lastPointerPosition = this.$refs.stage.getNode().getPointerPosition();
        },
        handleUp: function() {
            this.isPaint = false;
        },
        handleMove: function() {
            if (!this.isPaint) 
                return;

            var theimg = this.$refs.image.getNode();
            
            this.context = theimg.getContext('2d');
            this.context.strokeStyle = '#df4b26';
            this.context.lineJoin = 'round';
            this.context.lineWidth = 5;

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

            this.lastPointerPosition = pos;
            //console.log(pos.x + "," +pos.y);
            this.$refs.image.getNode().draw();
        }
    }
}
</script>
#app div {
    margin-left: 10%;
}
<style scoped>
</style>

<template>
  <v-stage @click="handleClick" ref="stage" :config="configStage">
    <v-layer  ref="layer">
        <v-image @mousedown="handleDown" @mousemove="handleMove" @mouseup="handleUp" ref="image" :config="configImage" />
    </v-layer>
  </v-stage>
</template>
<script>
const width = window.innerWidth - (window.innerWidth/10);
const height = window.innerHeight;

export default {
  name: 'DrawArt',
  props: {
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
      context: null
    }
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

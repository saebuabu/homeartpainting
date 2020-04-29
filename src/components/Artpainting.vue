<template>
  <v-stage @click="handleClick" ref="stage" :config="configStage">
    <v-layer  ref="layer">
        <v-line ref="lijn" :config="{
        x: 20,
        y: 20,
        points: [0, 0, 20, 20],
        tension: 0.3,
        closed: false,
        stroke: 'black',
        fillLinearGradientStartPoint: { x: -50, y: -50 },
        fillLinearGradientEndPoint: { x: 50, y: 50 },
        fillLinearGradientColorStops: [0, 'red', 1, 'yellow']
      }"
      />
      <v-text :config="configText"/>
    </v-layer>
  </v-stage>
</template>

<script>
const width = window.innerWidth;
const height = window.innerHeight;

export default {
  name: 'Artpainting',
  props: {
  },
   data() {
    return {
      configStage: {
        width: width,
        height: height      
      },
      configText: {
        x: 300,
        y: 400,
        text: "Save"
      }
    }
   },
    methods: {
      handleClick: function() {

        //waar wordt er geklikt 
        var stage = this.$refs.stage;
        //var layer = this.$refs.layer;

        var p = stage.getNode().getPointerPosition();

        //Toevoegen aan de bestaande lijn
        console.log(this.$refs.lijn.getNode().points());
        var delijn = this.$refs.lijn.getNode();
        delijn.x = p.x;
        delijn.y = p.y;

        delijn.points().push(p.x, p.y);
        delijn.draw();

        console.log('Ha');
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

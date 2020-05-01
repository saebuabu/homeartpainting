<template>
  <div id="app">
      <aside>
        <div v-if="this.fase == 'beforeStart'">
          <label>Wat is je naam?: </label>
          <input type="text" v-model="username" name="username" placeholder="Wat is je naam?">
          <input type="number" v-model="brushwidth" name="brushwidth" placeholder="Dikte kwast?">

          <button v-on:click="startDrawing">Start</button>
          <Colorpicker @color-Set="colorSet" />
        </div>
        <div v-if="this.fase == 'paintingEnded'">
          <button v-on:click="savePainting">Save</button>
        </div>
      </aside>

    <div id="painting" v-if="this.fase != 'beforeStart'">
      <DrawArt :username="username" :colorcode="colorcode" :brushwidth="brushwidth" ref="childComponent"/>
    </div>
  </div>
</template>

<script>
//import Artpainting from './components/Artpainting.vue'
import DrawArt from './components/DrawArt.vue'
import Colorpicker from './components/Colorpicker.vue'

export default {
  name: 'App',
  components: {
    DrawArt,
    Colorpicker
  },
  data() {
    return {
    username: '',
    colorcode: '#ff0000',
    fase: 'beforeStart'    
    }
  },
  methods: {
        colorSet(value) {
            this.colorcode = value;
            //console.log("kleur: "+value);
        },
        startDrawing() {
          if (this.username.length > 2)
            this.fase = 'paintingEnded';
          else 
             this.username = "?";
        },
        savePainting() {
          this.$refs.childComponent.savePaintingAlt();
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
aside {
  width: 9%;
  float: left;
}
#painting {
  margin-left: 12%;
  border: 1px solid grey;
}
aside button, aside input {
  display: block;
  margin: 0.3em;
  padding: 0.2em;
  border: 1px solid grey;
}
aside button {
  background-color:lightskyblue; 
}

aside label {
  text-align: left;
  padding: 0.1em;
}

#pickedColorEl {
  display: inline-block;
  width: 30px;
  height: 1em;
}

</style>

<template>
  <div id="app">
     <header>
      <Painters />
      <span v-if="this.fase == 'beforeStart'"><button v-on:click="startSession">Start nieuwe sessie</button></span>
      <span v-if="this.fase == 'beforePainting'" ><button  v-on:click="startDrawing">Start</button></span>
      <span v-if="this.fase == 'painting'" ><button v-on:click="savePainting">Save</button></span>
      </header>
      <LoadingBar v-if="this.isLoading"/>
      <aside v-bind:class="classObject">
        <div v-if="this.fase == 'beforePainting'">
          <h4>Naam: </h4><input type="text" v-model="username" name="username" placeholder="Naam?">
          <h4>Kwastdikte: </h4><input type="number" v-model="brushwidth" name="brushwidth" placeholder="Dikte kwast?">
          <h4>Kleur:</h4>
          <Colorpicker @color-Set="colorSet" />
        </div>
      </aside>

    <div id="painting" v-if="this.fase != 'beforePainting'">
      <DrawArt @start-Loading="startLoading" @stop-Loading="stopLoading" @drawing-Saved="drawingSaved" :fase="fase" :username="username" :colorcode="colorcode" :brushwidth="brushwidth" ref="childComponent"/>
    </div>
  </div>
</template>

<script>
//import Artpainting from './components/Artpainting.vue'
import DrawArt from './components/DrawArt.vue'
import Colorpicker from './components/Colorpicker.vue'
import LoadingBar from "./components/LoadingBar";
import Painters from "./components/Painters";


export default {
  name: 'App',
  components: {
    DrawArt,
    Colorpicker,
    LoadingBar,
    Painters
  },
  data() {
    return {
    username: '',
    colorcode: '#ff0000',
    fase: 'beforeStart' ,   //beforeStart, beforePainting, painting, PaintingEnded 
    isLoading: false,
    brushwidth: 5,
    drawingMessage: ''
    }
  },
  computed: {
        classObject: function() {
            return {
                active: this.fase == 'beforePainting',
                'hide': this.fase != 'beforePainting'
            }
        }
  },
  methods: {
        colorSet(value) {
            this.colorcode = value;
            //console.log("kleur: "+value);
        },
        startDrawing() {
          if (this.username.length > 2)
            this.fase = 'painting';
          else 
             this.username = "?";
        },
        startSession() {
            this.fase = 'beforePainting';
        },
        drawingSaved(val) {
            this.fase = 'paintingEnded';
            this.drawingMessage = val;
        },
        savePainting() {
          this.$refs.childComponent.savePaintingAlt();
        },
        startLoading() {
          this.isLoading = true;
        },
        stopLoading(error) {
           this.isLoading = false;
           if (error) 
               alert(error);
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
  margin-top: 3px;
}
aside {
  margin-left: 5em;
  float: left;
}
aside.active {
  width: 9%;
}

aside.hide {
  width: 0%;
}

#painting {
  border: 1px solid grey;
  margin: 0 1em 0 1em;
}
header {
  padding-bottom: 0.5em;
}
header span {
  margin-left: 1em;
}

header span button {
  border: 1px solid grey;
  background-color: #ffffff; 
  padding: 0.2em;
}

header span button:hover {
  background-color:darkgoldenrod; 
  color: #ffffff;
}

aside input {
  border: 1px solid grey;
  display: block;
  margin: 0.3em;
  padding: 0.2em;
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

header p {
  padding: 0 4em 0 4em;
  margin-top: 1em;
}

</style>

<template>
  <div id="app">
      <aside>
        <div v-if="this.fase == 'beforeStart'">
          <input type="text" v-model="username" name="username" placeholder="Wat is je naam?">
          <button v-on:click="startDrawing">Start</button>
        </div>
        <div v-if="this.fase == 'paintingEnded'">
          <button v-on:click="savePainting">Save</button>
        </div>
      </aside>

    <div id="painting" v-if="this.fase != 'beforeStart'">
      <DrawArt  :username="username" ref="childComponent"/>
    </div>
  </div>
</template>

<script>
//import Artpainting from './components/Artpainting.vue'
import DrawArt from './components/DrawArt.vue'

export default {
  name: 'App',
  components: {
    DrawArt
  },
  data() {
    return {
    username: '',
    fase: 'beforeStart'    
    }
  },
  methods: {
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
button, input {
  display: block;
  margin: 0.3em;
}
</style>

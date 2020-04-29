<template>
  <div id="app">
      <aside>
        <input type="text" v-model="username" name="username" placeholder="Wat is je naam?">
        <button v-on:click="startDrawing">Start</button>
      </aside>
    <div id="painting" v-if="this.doStart">
      <DrawArt  :username="username" />
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
    doStart: false
    }
  },
  methods: {
        startDrawing() {
          if (this.username.length > 2)
            this.doStart = true;
          else 
             this.username = "?";
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
</style>

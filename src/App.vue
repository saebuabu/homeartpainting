<template>
  <div id="app">
      <aside>
        <input type="text" name="username">
        <button>Opslaan</button>
      </aside>

    <DrawArt />
  </div>
</template>

<script>
//import Artpainting from './components/Artpainting.vue'
import DrawArt from './components/DrawArt.vue'

export default {
  name: 'App',
  components: {
    DrawArt
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
</style>

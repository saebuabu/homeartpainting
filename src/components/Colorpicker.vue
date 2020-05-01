<template>
  <v-app>
          <pre >{{ showColor }}</pre>

     <v-row>
        <v-col cols="20" md="20"
          class="d-flex justify-center"
        >
          <v-color-picker  v-on:change="colorPicked" v-model="color"></v-color-picker>
        </v-col>
        <v-col
          cols="20"
          md="20"
        >
          <v-sheet
            light
            class="pa-4"
          >
 
          </v-sheet>
        </v-col>
      </v-row>
  </v-app>
</template>
<script>
  export default {
  data: () => ({
    type: 'hex',
    hex: '#FF00FF',
    hexa: '#FF00FFFF',
    rgba: { r: 255, g: 0, b: 255, a: 1 },
    hsla: { h: 300, s: 1, l: 0.5, a: 1 },
    hsva: { h: 300, s: 1, v: 1, a: 1 },
  }),

  computed: {
    color: {
      get () {
        return this[this.type]
      },
      set (v) {
        this[this.type] = v
      },
    },
    showColor () {

       this.$emit('color-Set',this.color);
       console.log(this.color);

      if (typeof this.color === 'string') return this.color

      return JSON.stringify(Object.keys(this.color).reduce((color, key) => {
                color[key] = Number(this.color[key].toFixed(2))
                return color
        }, {}), null, 2)
    },
  },
  methods: {
    colorPicked: function() {
    }
  }
}
 
</script>

<style scoped>
#app.v-application {
  margin-top: 3px;
}

.v-application--wrap {
  min-height: 1px;
}
</style>


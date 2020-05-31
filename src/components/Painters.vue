<template>
<div id="painters">
    <label>Online canvas artists: </label><ul> <li class="painters" v-for="(painter, index) in painters" :key="painter.username">
    <span><country-flag :country='painter.country' size='small' />{{ painter.imagecreated}}</span><button :class="{ active: activePainter === painter.username }" v-on:click="showPainterPainting(index)">
     {{ painter.username }}</button> 
  </li></ul>
</div>
</template>

<script>
import { bus } from '../main'
import CountryFlag from 'vue-country-flag'

export default {
  components: {
       CountryFlag
  },
  data() {
    return {
      painters: null,
      errors: [],
      activePainter: null
    }
  },
  props: {
      fase: {
          type: String
      }
  },
  computed: {
  },
  created() {
        this.laadPainters();
        //nadat een nieuwe schilder heeft geschilderd opnieuw laden
       bus.$on('newPainter', () => { 
          console.log("ververs painters...");
          this.laadPainters()
        }); 
  },
  methods: {
    laadPainters() {
       console.log("Painters laden...");
        this.axios.get(this.$mongoresturl + 'artists.php')
            .then(response => {
                //console.log(response);
                if (response.data.status == "ok") {
                    if (response != null) {
                        this.painters = response.data.response;
                    } else {
                        this.info = response.status;
                    }
                }
                else {
                    this.errors.push(response.response);

                }
            })
            .catch(error => {
                this.errors.push("Server could not process " + error);
            });

    },
    showPainterPainting(i) {
      //console.log(this.painters[i].username);
       bus.$emit('changePainting', this.painters[i].username);

       this.activePainter = this.painters[i].username;
    }
  }
}
</script>
<style scoped>
#painters {
   margin: 0.5em 4em 0.5em 4em;
}
.painters {
  list-style-type: none;
  display: inline-block
}
.painters button:hover, .painters button.active {
  background-color: darkgoldenrod;
  color: white;
}
 .painters button.active {
  padding: 0.1em;  
 }

.painters span{
  font-size: xx-small;
  padding-left: 1em;
}
.painters span::after {
  content: ' | ';
}
.flag {
  top: -1.7em;
  position: relative;
  max-width: 60px;
}

</style>
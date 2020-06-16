<template>
<div id="painters">
    <h3>ONLINE CANVAS</h3>
    <h4 >artists</h4>
    <ul class="painters-wrapper" v-if="painters.length > 0"> <li class="painters" v-for="(painter, index) in painters" :key="painter.username">
    <country-flag :country='painter.country' size='small' /><span class="timecreated">{{ painter.imagecreated}}</span><button :class="{ active: activePainter === painter.username }" v-on:click="showPainterPainting(index)">
     {{ painter.username }}</button> 
    </li></ul>
    <span v-if="painters.length == 0">Nobody has started painting yet</span>
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
      activePainter: null,
      lastPainterName: ""
    }
  },
  props: {
      fase: {
          type: String
      }
  },
  watch: { 
      fase: function(newVal, oldVal) { // watch it
          if (newVal == "painting" && oldVal == "beforePainting") {
            bus.$emit('changePainting', this.lastPainterName);
          }
      }
  },
  computed: {
  },
  created() {
        this.laadPainters();
        //nadat een nieuwe schilder heeft geschilderd opnieuw laden
       bus.$on('newPainter', (username) => { 
          console.log("ververs painters...");

          if (username) 
            this.laadPainters(username)
          else          
            this.laadPainters()
        }); 
  },
  methods: {
    laadPainters(u) {
       console.log("Painters laden...");
        this.axios.get(this.$mongoresturl + 'artists.php')
            .then(response => {
                //console.log(response);
                if (response.data.status == "ok") {
                    if (response != null) {
                        this.painters = response.data.response;
                        if (this.painters.length > 0) {
                          this.lastPainterName = this.painters[this.painters.length - 1].username;
                          if (u)
                            this.$emit('changePainting', u);
                        }
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
#painters h3 {
   margin-bottom: 0.5em;
}
.painters {
  list-style-type: none;
  display: inline-block;
  height: 1.4em;
}

.painters button:hover, .painters button.active {
  color: rgba(170, 66, 66, 0.22);
}
 .painters button.active {
  padding: 0.1em;  
 }

.painters span{
  font-size: xx-small;
  padding: 0;
}
.painters span::after {
  content: ' | ';
}
.flag {
  top: -1.7em;
  position: relative;
  max-width: 60px;
  padding: 0;
}

@media only screen and (max-width: 768px) {

  .painters-wrapper {
      display: none;
  }


.site-title, .site-title a {
    font-size: 1.2rem;
  }

.site-title.left {
    padding-right: 0%;
  }

header #painters.open {
    display: block;
}

header #painters {
   margin: .1em;
}

header #painters span{
   width: 4em;
   display: float;
   float: left;
}

header #painters span.flag{
   right: -0.2em;
   top: -1.2em;

}

header #painters .timecreated{
   display: none;
}

#painters span::after {
  content: '';
}

.painters {
  list-style-type: none;
  display: inline-block;
  height: 1.4em;
  font-size: 0.8rem;
}



}


</style>
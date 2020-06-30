<template>
  <div id="app">
    <div class="site-branding">
        <p class="site-title left"><a href="https://www.emmyzwagers.nl/" rel="home">EMMY ZWAGERS</a></p>				
        <p class="site-title right"><a href="http://abu.saebu.nl/doku.php?id=ict_diensten" rel="partner site">ABU SAEBU</a></p>				
    </div>
     <header>
      <LoadingBar v-if="this.isLoading"/>
      <Painters v-if="this.fase == 'beforeStart' || this.fase == 'paintingEnded'" :key="componentKey" :fase="fase" />
      <span v-if="this.fase == 'beforeStart' && !alreadyPainted"><button v-on:click="startSession">Start nieuwe sessie</button></span>
      <span v-if="this.fase == 'beforePainting' && !viewer" ><button  v-on:click="startDrawing">Start</button></span>
      <span class="server-message" :class="{ red: this.fase == 'beforePainting'  }">&nbsp;{{ serverMessage }}</span>
      </header>
      <aside v-bind:class="classObject">
        <div v-if="this.fase == 'beforePainting' && !viewer">
          <h3>Painting settings</h3>
          <div><b>Instructions</b><br>
1. Enter Your Full Name and Location<br>
2. Choose Your Brush size and Colour<br>
3. You Get 3-10 sec to Make Your Mark, Hurry!</div>
          <div>
          <h4>Full name: </h4><input type="text" v-model="username" >
          <h4>Country: </h4>
          <vueCountryRegionSelect @country-Set="countrySet"/>          
          <h4>Brush width: </h4><input type="number" v-model="brushwidth" min="1" max="18" >
          <h4>Color:</h4>
          <Colorpicker @color-Set="colorSet" />
          </div>
        </div>
      </aside>

    <div id="painting" >
      <DrawArt @start-Loading="startLoading" @stop-Loading="stopLoading" @drawing-Saved="drawingSaved" :viewer="viewer" :fase="fase" :username="username" :colorcode="colorcode" :brushwidth="brushwidth" :country="country" ref="childComponent"/>
    </div>
  </div>
</template>

<script>
//import Artpainting from './components/Artpainting.vue'
import DrawArt from './components/DrawArt.vue'
import Colorpicker from './components/Colorpicker.vue'
import LoadingBar from "./components/LoadingBar";
import Painters from "./components/Painters";
import vueCountryRegionSelect from "./components/vueCountryRegionSelect.vue";
import socketio from "socket.io-client";

var options = {
          rememberUpgrade:true,
          transports: ['websocket'],
          secure:true, 
          rejectUnauthorized: false
              }

const socket = socketio('//artsocketpainting.herokuapp.com', options);
//const socket = socketio('//localhost:5000', options);

export default {
  name: 'App',
  metaInfo() {
        return {
          title: "Online Canvas by Emmy Zwagers and Abu Saebu",
          meta: [ { name: 'description', 
                    content:  'Collaborating with other painters on a online canvas'},
                    { name: 'keywords', content: 'painting, canvas, art, social, sharing, collaborate' }
                ]
        }
  },
  components: {
    DrawArt,
    Colorpicker,
    LoadingBar,
    Painters,
    vueCountryRegionSelect
  },
  data() {
    return {
    username: '',
    componentKey: 0,
    colorcode: '#ff0000',
    fase: 'beforeStart' ,   //beforeStart, beforePainting, painting, paintingEnded
    isLoading: false,
    brushwidth: 5,
    drawingMessage: '',
    country: 'NL',
    serverMessage: '',
    isConnected : false,
    viewer : true
    }
  },
  computed: {
        classObject: function() {
            return {
                active: this.fase == 'beforePainting' && !this.viewer,
                'hide': this.fase != 'beforePainting'
            }
        },
        alreadyPainted: function() {
            this.$cookies.config('30d');
            return ( this.$cookies.get('wordpress') || this.$cookies.get('AXRXTX') ) ? true : false;
        }
  },
  created() {
      socket.emit("painterOnline", "" );
       window.onbeforeunload = function(){      
            socket.emit("painterOffline", "" );
            localStorage.removeItem('latest');
          return false;
        },
        socket.on('message', data => {
              this.serverMessage = data.message;
            
              this.username = data.painter ? data.painter : '';
            
            //this.viewer om te voorkomen dat je door je eigen actie wordt geblokkeerd
              if (data.action == "block" && this.viewer) {
                this.fase = "beforePainting";
              }
              else if (data.action == "refresh" && this.viewer) {
                this.fase = "paintingEnded";
              }
        });
  },
  mounted() {
        socket.on('connect', () => {
              this.serverMessage = "connected";
        });


 
  },
  methods: {
        countrySet(value) {
            console.log("Country geselecteerd " + value);
            this.country = value;
        },
        forceRenderer() {
           this.componentKey +=1;
        },
        colorSet(value) {
            this.colorcode = value;
            //console.log("kleur: "+value);
        },
        startDrawing() {
          
          this.username = this.username.trimRight();
          this.viewer = false;
          //check op country werkt op de een of andere manier niet
          if (this.username.length > 3) {
            this.country = (this.country == "" || !this.country) ? "NL" : this.country;
            this.fase = 'painting';
            socket.emit("painterPainting", this.username );
          }
          else  {
              alert("Please fill in your name");
          }
        },
        startSession() {
            //vanaf nu ben je in actie en is de rest verplicht viewer
            this.viewer = false;
            socket.emit("painterStarted", "" );
            this.fase = 'beforePainting';
        },
        drawingSaved(val) {
            socket.emit("painterNewPainting", this.username );
            this.fase = 'paintingEnded';
            this.drawingMessage = val;
            this.forceRenderer();
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
  font-family: "Helvetica", "Helvetica Neue";
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 3px;
}

.site-branding {
    margin-top: 1em;
}


.site-title, .site-title a {
	clear: both;
	padding-top: 1em;
  color: #54595F;
  font-family: "Helvetica", "Helvetica Neue";
  font-size: 1.6rem;
  line-height: 2em;
  letter-spacing: 0.9px;
  font-weight: bold;
  text-decoration: none;
  width: 50%;
  display: inline;
}

.site-title a:hover {
    color: rgba(170, 66, 66, 0.22);
}

.site-title.left {
    padding-right: 15%;
}

.site-title.right {
    padding-left: 15%;
}




aside {
  left: 10%;
  margin: auto;
  position: absolute;
  background-color: #fff;
  z-index: 999999;
  height: 90vh;
}

aside h3 {
  text-decoration: underline;
  margin-bottom: 0.5em;
}

aside h4{
  text-align: left;
}

aside.active {
  width: 25vw;
  border: 1px solid black;
}

aside.hide {
  width: 0%;
}

aside > div {
  padding-left: 1.5em;
}

aside div div{
  text-align: left;
  margin: 0 0 0.5em 0;
}

#painting {
  margin: 0 0 0 8px;
  overflow-y: hidden;
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

aside input, aside select {
  border: 1px solid grey;
  display: block;
  margin: 0.3em;
  padding: 0.2em;
  max-width: 200px;
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

@media only screen and (max-width: 768px) {

aside.active {
    left: 6%;
    width: 85vw;
}

.site-title, .site-title a {
    font-size: 1.2rem;
  }

.site-title.left {
    padding-right: 0%;
  }

}

.server-message {
  display: block;
  font-size: 0.7em;
  position: absolute;
  top: 0.2em;
  left: 0.01em;
}

</style>

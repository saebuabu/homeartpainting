<template>
<div id="painters">
    <label>Artiesten: </label><ul> <li class="painters" v-for="painter in painters" :key="painter.username">
    <span>{{ painter.imagecreated}}</span>{{ painter.username }} 
  </li></ul>
</div>
</template>

<script>
export default {
  data() {
    return {
      painters: null,
      errors: []
    }
  },
  computed: {
  },
  mounted() {
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
.painters span{
  font-size: xx-small;
  padding-left: 1em;
}
.painters span::after {
  content: ' | ';
}
</style>
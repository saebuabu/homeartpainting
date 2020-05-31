<template>
  <country-select v-on:change="countrySelected" v-model="country"  topCountry="NL" placeholder="Select your country" />
</template>
<script>
export default {
data: () => ({
    country: '',
    region: ''
  }),
methods: {
    countrySelected: function() {
               console.log("change triggered");
               this.$emit('country-Set',this.country);
    }
  },
  beforeDestroy () {
               console.log("change triggered");
               this.$emit('country-Set',this.country);
  }
}
</script>

<template>
  <div>
    <TreemapNew v-if="dataFetch"    :inputWidth="width"
        :inputHeight="height" />
  </div>
</template>

<script>
// @ is an alias to /src
import TreemapNew from '@/components/TreemapNew.vue'


export default {
  name: 'Final',
  components: {
    TreemapNew
  },
  data(){
      return {
          width:null,
          height: null,
          dataFetch:false,
      }
  },
  mounted() {
    this.height = window.innerHeight - 50;
    this.height = 500

    this.width = window.innerWidth - 10;
    this.dataFetch=false

  }
}
</script>

/* eslint-disable vue/no-unused-vars */
<template>
  <div class="treemap">
    <!-- The SVG structure is explicitly defined in the template with attributes derived from component data -->
    <svg :height="height" style="margin-left: 0px;" :width="width">
      <g style="shape-rendering: crispEdges;" transform="translate(0,20)">
            <!-- The top most element, representing the previous node -->
        <g class="grandparent">
          
          <rect 
            :height="height" 
            :width="width" 
            :y="(margin.top * -1)" 
            v-on:click="selectNode" 
            :id="parentId">
          </rect>
          <!-- <g class="parentTitleBox"
          v-for="(child in rootNode)"
          ></g> -->
     
          <!-- The visible square text element with the id (basically a breadcumb, if you will) -->
          <text
            class="grandparentText"
            dy=".65em" 
            x="6" 
            y="-14">
            
            {{ selectedNode.id }}
          </text>
        </g>
        <!-- We can use Vue transitions too! -->
        <transition-group name="list" tag="g" class="depth" 
            v-if="selectedNode"
        >
          <!-- Generate each of the visible squares at a given zoom level (the current selected node) -->
          <g 
            class="children" 
            v-for="children in selectedNode._children" 
            :key="'c_' + children.id" 
            
            >
             

        

            <!-- 
              The visible square rect element.
              You can attribute directly an event, that fires a method that changes the current node,
              restructuring the data tree, that reactivly gets reflected in the template.
            -->
            <rect 
              
              class="parent" 
                            :id="children.id" 

              :key="children.data.id" 
              :x="x(children.x0)" 
              :y="y(children.y0)" 
              :width="x(children.x1 - children.x0 + children.parent.x0)" 
              :height="y(children.y1 - children.y0 + children.parent.y0)" 
              :style="getColor(children.data.change)"
              >
              
              <!-- The title attribute -->
              <!-- <title>{{ children.data.name }} | {{ children.value }}</title> -->
              <!-- <text
              class="parentText"
              dy="1em" 
              :key="'t_' + children.id" 
              :x="x(children.x0) + 60" 
              :y="y(children.y0) + 6" 
              style="fill:white;"
              >
              {{ children.data.name }}</text> -->
            </rect>
            <rect
              v-if="selectedNode.depth == 0"
              class="parentSquare"
              :x="x(children.x0)" 
              :y="y(children.y0)" 
              :width="x(children.x1 - children.x0 + children.parent.x0)" 
              height="10"
              style= "fill:black"
            >
            <!-- <text
             class="parentText"
              dy="1em" 
              :key="'t_' + children.id" 
              :x="x(children.x0) + 60" 
              :y="y(children.y0) + 6" 
              style="fill:white;"
              >
               {{ children.data.name }}
            </text> -->
            </rect>
                <!-- Generate the children squares (only visible on hover of a square) -->
          <g v-for="child in children._children" 
            :key="'c_' + child.id" >
            <rect 

              v-on:click="selectNode" 
              class="child" 
              :id="child.id" 
              :key="child.data.id" 
              :height="y(child.y1) - y(child.y0)" 
              :width="x(child.x1) - x(child.x0)" 
              :x="x(child.x0)" 
              :y="y(child.y0)+10"
              :style="getColor(child.data.change)"
              >
            
            </rect>
              <text 
              dy="1em"
              :key="'name_t_' + child.id" 
              :x="XText(child.x0,child.x1)"  
              :y="y(child.y0)+16" 
              
              style="fill: white;font-size:0.9rem;text-anchor='middle'"
              >
              {{ child.data.name }}
            </text>
               <text 
              dy="0.7em"
              :key="'percent_t_' + child.id" 
              :x="XText(child.x0,child.x1)" 
              :y="YText(child.y0,child.y1)" 
              
              style="fill: white;font-size:0.6rem;text-anchor='middle'"
              >
              {{ child.data.change + '%' }}
            </text>
          </g>
      
            <!-- The visible square text element with the title and value of the child node -->
            <text 
              dy="0.7em"
              :key="'name_' + children.data.id" 
              :x="x(children.x0) + 6" 
              :y="y(children.y0)" 
              style="fill: white;font-size:0.6rem"
              >
              {{ children.data.name }}
            </text>
            
            <text 
              dy="2.25em" 
              :key="'change_' + children.data.id" 
              :x="x(children.x0) + 6" 
              :y="y(children.y0) + 6" 
              style="fill-opacity: 1;"
              >

              {{ children.data.change }}
            </text>

          </g>
        </transition-group>

    
      </g>
    </svg>
  </div>
</template>

<script>
import {scaleLinear, scaleOrdinal} from 'd3-scale'
// import {json} from 'd3-request'
import {hierarchy, treemap} from 'd3-hierarchy'

// To be explicit about which methods are from D3 let's wrap them around an object
// Is there a better way to do this?
let d3 = {
  scaleLinear: scaleLinear,
  scaleOrdinal: scaleOrdinal,
  // schemeCategory20: schemeCategory20,
  // json: json,
  hierarchy: hierarchy,
  treemap: treemap
}
import data from "@/components/data/map2.json"
export default {
  name: 'Treemap',
  // the component's data
  data () {
    return {
      jsonData: null,
      rootNode: {},
      margin: {
        top: 20,
        right: 0,
        bottom: 0,
        left: 0
      },
      width: 1350,
      height: 580,
      selected: null,
      // color: {}
      colors: ["fill:#AA2121", "fill:#C84040", "fill:#ED7171", "fill:#33BA33", "fill:#518651", "fill:#215E2C"]
    }
  },
  // You can do whatever when the selected node changes
  watch: {
    // eslint-disable-next-line no-unused-vars
    selectedNode (newData, oldData) {
      console.log('The selected node changed...')
      console.log( newData.data);
    }
  },
  // In the beginning...
  mounted () {
    var that = this

    // An array with colors (can probably be replaced by a vuejs method)
    // that.color = d3.scaleOrdinal(d3.schemeCategory20)
    that.color = d3.scaleOrdinal().range(['#5EAFC6', '#FE9922', '#93c464', '#75739F'])

    // loads the data and calls the initialization methods
    // d3.json('@components/data/map2.json',
      // function (error, data) {
      //   if (error) console.log(error)

        that.jsonData = data
        that.initialize()
        that.accumulate(that.rootNode, that)
        that.treemap(that.rootNode)
        // console.log(this.rootNode);

      // }
    // )
  },
  // The reactive computed variables that fire rerenders
  computed: {
    // The grandparent id
    parentId () {
      if (this.selectedNode.parent === undefined || this.selectedNode.parent === null) {
        return this.selectedNode.id
      } else {
        return this.selectedNode.parent.id
      }
    },
    // Returns the x position within the current domain
    // Maybe it can be replaced by a vuejs method
    x () {
      return d3.scaleLinear()
        .domain([0, this.width])
        .range([0, this.width])
    },
    // Returns the y position within the current domain
    // Maybe it can be replaced by a vuejs method
    y () {
      return d3.scaleLinear()
        .domain([0, this.height - this.margin.top - this.margin.bottom])
        .range([0, this.height - this.margin.top - this.margin.bottom])
    },

    yText (input) {
        let parentData = d3.select(input).datum()
        return (parentData.x1 - parentData.x0) / 2
      },
    yParent() {
      return d3.scaleLinear()
      .domain([0, this.height - this.margin.top - this.margin.bottom])
        .range([0, this.height - this.margin.top - this.margin.bottom])
    },
    // The D3 function that recursively subdivides an area into rectangles
    treemap () {
      return d3.treemap()
      // .tile(d3.treemapResquarify)
      .size([this.width, this.height])
      .round(false)
     
      // .paddingInner(1)
      // .paddingOuter(1)
      // .paddingTop(15)
    },
    // The current selected node
    selectedNode () {
      let node = null

      if (this.selected) {
        let nd = this.getNodeById(this.rootNode, this.selected, this)

        if (nd._children) {
          node = nd
        } else {
          node = nd.parent
        }
      } else {
        node = this.rootNode
      }

      // Recalculates the y and x domains
      this.x.domain([node.x0, node.x0 + (node.x1 - node.x0)])
      this.y.domain([node.y0, node.y0 + (node.y1 - node.y0)])
      // console.log(node);
      return node
    }
  },
  methods: {
    // Called once, to create the hierarchical data representation
    initialize () {
      let that = this

      if (that.jsonData) {
        that.rootNode = d3.hierarchy(that.jsonData)
        .eachBefore(function (d) { d.id = (d.parent ? d.parent.id + '.' : '') + d.data.name })
        .sum((d) => d.value)
        .sort(function (a, b) {
          return b.height - a.height || b.value - a.value
        })
        that.rootNode.x = that.rootNode.y = 0
        that.rootNode.x1 = that.width
        that.rootNode.y1 = that.height
        that.rootNode.depth = 0
      }
    },
    // Calculates the accumulated value (sum of children values) of a node - its weight,
    // represented afterwards in the area of its square
    accumulate (d, context) {
      d._children = d.children

      if (d._children) {
        d.value = d._children.reduce(function (p, v) { return p + context.accumulate(v, context) }, 0)
        return d.value
      } else {
        return d.value
      }
    },
    // Helper method - gets a node by its id attribute
    getNodeById (node, id, context) {
      if (node.id === id) {
        return node
      } else if (node._children) {
        for (var i = 0; i < node._children.length; i++) {
          var nd = context.getNodeById(node._children[i], id, context)
          if (nd) {
            return nd
          }
        }
      }
    },
    // When a user clicks a square, changes the selected data attribute
    // which fires the computed selectedNode, which in turn finds the Node by the id of the square clicked
    // and the template reflects the changes
    selectNode (event) {
      // console.log(event.target.id);
      
      this.selected = event.target.id
    },
       XText (x0,x1) {
        return ((x1 - x0) /2) + x0 - 20
      },
      YText (y0,y1) {
        return ((y1 - y0) /2) + y0
      },
    getColor(val) {
      let color = "red";
      // console.log(val);
      val = Math.floor(val)
      switch (parseInt(val)) {
        case -5:
        case -4:
          color = this.colors[0];
          break;

        case -3:
          color = this.colors[1];
          break;
        case -2:
        case -1:
          color = this.colors[2];
          break;
        case 0:
        case 1:
          color = this.colors[3];
          break;
        case 2:
        case 3:
          color = this.colors[4];
          break;

        case 4:
        case 5:
          color = this.colors[5];
          break;
        default:
          color = this.colors[5];
      }
      return color;
    },
  }
}
</script>

<style scoped>

text {
  pointer-events: none;
}

.grandparent text {
  /* font-weight: bold; */
  fill: black;
  
}

rect {
  fill: none;
  stroke: rgb(5, 0, 0);
  
}

/* rect.parent,
.grandparent rect {
  stroke-width: 1px;
} */

.grandparent rect {
  fill: rgb(224, 224, 252);
  /* color: aliceblue; */
  
}
.parentText {
  fill:blanchedalmond
}
/* .grandparent:hover rect {
  fill: #ee9700;
} */
.child {
  cursor: pointer;
  stroke:rgb(36, 30, 30)
}
/* .parent:hover {
  cursor: pointer;
  stroke:yellow
} */

.children rect.parent,
.grandparent rect {
  cursor: pointer;
}

.children rect.parent {
  fill: #bbb;
  fill-opacity: .9;
}

.children:hover rect.child {
  fill: #bbb;
}

.children text{
  font-size: 0.8em;
}

.grandparent text{
  font-size: 0.8em;
  /* color: rgb(255, 255, 255); */
  
}
.grandparentText{
  color: #bbb !important;
}
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active for <2.1.8 */ {
  opacity: 0;
}
    
</style>

/* eslint-disable vue/no-use-v-if-with-v-for */
/* eslint-disable vue/no-unused-vars */
<template>
   <div class="treemap">
      <div id="tooltip"
          v-if="tooltip && selectedNode.depth == 0"
          class="tooltip" 
          :style="{ left: pageX+'px', top: pageY+'px'}">
          <span style="font-size:0.8rem">
              {{tooltipHeaderName}}
          </span>
          <hr>
        <div style="direction:rtl">
            <p style="font-size:0.7rem;direction:rtl">
              <span> {{tooltipListOfChilds[0].name}}</span>
              <span style="font-size:0.7rem">{{tooltipListOfChilds[0].change}}</span>
            </p>
         
        </div>
         
      </div>
    <!-- The SVG structure is explicitly defined in the template with attributes derived from component data -->
    <svg :height="height" style="margin-left: 0px;" :width="width">
  


      <g style="shape-rendering: crispEdges;" transform="translate(0,20)">
            <!-- The top most element, representing the previous node -->
        <g class="grandparent">
          
          <rect 
            :height="20" 
            :width="width-2" 
            :y="(margin.top * -1 )+15" 
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
            y="0">
            
            {{ selectedNode.data.name }}
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
              @mousemove="mouse_move(children,$event)"
              @mouseleave="tooltip = false"
            >
             

        

            <!-- 
              The visible square rect element.
              You can attribute directly an event, that fires a method that changes the current node,
              restructuring the data tree, that reactivly gets reflected in the template.
            -->
            <g v-if="selectedNode.depth==1">
            <rect 
              class="parent" 
              :id="children.id" 
              :key="children.data.id" 
              :x="x(children.x0)" 
              :y="y(children.y0)+15" 
              :width="x(children.x1 - children.x0 + children.parent.x0)" 
              :height="y(children.y1 - children.y0 + children.parent.y0)" 
              :style="getColor(children.data.change)"
              >
            </rect>
              <text
              dy="1em"
              :key="'name_' + children.data.id"
              :x="x(children.x0) + 6" 
              :y="y(children.y0) + 15" 
              style="fill: white;font-size:0.6rem"
              :style="InnerTickerTextFontSizeAdjust(children)"
              >
              {{ children.data.name }}
            </text>
            
            <text 
              dy="2.3em" 
              :key="'change_' + children.data.id" 
              :x="x(children.x0) + 6" 
              :y="y(children.y0) + 15" 
              style="fill-opacity:1;fill:white"
              :style="InnerTickerTextFontSizeAdjust(children)"
              >

              {{ children.data.change }}%
            </text>
            </g>
      


       
                <!-- Generate the children squares (only visible on hover of a square) -->
          <g v-for="child in children._children" 
            :key="'c_' + child.id"
            class="childG" >
            <rect 

              v-on:click="selectNode" 
              class="child" 
              :id="child.id" 
              :key="child.data.id" 
              :height="y(child.y1) - y(child.y0)" 
              :width="x(child.x1) - x(child.x0)" 
              :x="x(child.x0)" 
              :y="y(child.y0)"
              :style="getColor(child.data.change)"

              >
              
           
              
                   

            </rect>
            <!-- ticker TEXT ********************************* -->
              <text 
              class="childTickerName"
              :key="'name_t_' + child.id" 
              :x="XText(child.x0,child.x1)"  
              :y="YText2(child.y0,child.y1)"
              :style="tickerTextFontSizeAdjust(child.x0,child.x1,child.y0,child.y1)"
              >
              {{ child.data.name }}
            </text>
            <text 
              class="childTickerValue"
              dy="0.3em"
              :key="'percent_t_' + child.id" 
              :x="XText(child.x0,child.x1)" 
              :y="YText(child.y0,child.y1)" 
              
              :style="tickerTextFontSizeAdjust(child.x0,child.x1,child.y0,child.y1)"
              >
              {{ child.data.change + '%' }}
            </text>
              <!-- ticker TEXT ********************************* -->
          </g>

           <!-- HEADER SQUARES WITH NAMES ***************************** -->
          <g v-if="selectedNode.depth == 0">
            <rect
              
              class="parentSquare"
              :x="x(children.x0)" 
              :y="y(children.y0)" 
              :width="x(children.x1 - children.x0 + children.parent.x0)" 
              height="15"
              >
            </rect>
            <rect
              class="littleSquare"
              :x="x(children.x0)+5"  
              :y="y(children.y0)+8" 
              width="10" height="10" 
              style="fill:#262931;transform-box:fill-box;"
              transform="rotate(45)"
              transform-origin="50% 50%"
              >
            </rect>
             <text
              class="parentSquareText"
              v-if="selectedNode.depth == 0" 
              dy="0.8em"
              :key="'name_' + children.data.id" 
              :x="x(children.x0) + 6" 
              :y="y(children.y0)" 
              >
              {{ children.data.name }}
            </text>
          </g>
           <!-- HEADER SQUARES WITH NAMES ***************************** -->
      
            <!-- The visible square text element with the title and value of the child node -->
          
          </g>
        </transition-group>

    
      </g>

      <!-- ************* SVG TOOLTIP PLACEMENT ************************* -->
          <!-- <g id="tooltip"  v-if="tooltip && selectedNode.depth == 0"
          class="tooltip">
          <rect
          :x="pageX"
          :y="pageY"
          height="20"
          width="50"
          style="fill:black">
          </rect>
              <text style="font-size:0.8rem;fill:black" :x="pageX"
          :y="pageY">
              {{tooltipHeaderName}}
          </text>
          </g> -->
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
      pageX:null,
      MainScaleNode:null,
      pageY:null,
      tooltip:false,
      jsonData: null,
      rootNode: {},
      tooltipHeaderName:null,
      tooltipListOfChilds:[],
      finalR:[],
      dict:{},
      margin: {
        top: 20,
        right: 0,
        bottom: 0,
        left: 0
      },
      width: 1350,
      height: 600,
      selected: null,
      colors: ["fill:#e41414", "fill:#c91010", "fill:#ab0e0e", "fill:#870c0c", "fill:#690808", "fill:#3f4c53"
      , "fill:#006920" , "fill:#008729", "fill:#009e30", "fill:#00bd39", "fill:#00d641"]
    }
  },
  // You can do whatever when the selected node changes
  watch: {
    // eslint-disable-next-line no-unused-vars
    selectedNode (newData, oldData) {
      console.log('The selected node changed...')
      console.log( newData.data);
      if (newData.depth == 1){
        // this.initialize()
        this.accumulate(this.rootNode, this)
        this.InnerScaleTreemap(this.rootNode)
      }
        
      else if(newData.depth == 0 && oldData.depth == 1) {
        this.initialize()
        this.accumulate(this.rootNode, this)
        this.treemap(this.rootNode)
      }
        

      // console.log(newData.y0,newData.x0,newData.y1,newData.x1);
    }
  },
  // In the beginning...
  mounted () {
    var that = this

    // An array with colors (can probably be replaced by a vuejs method)
    // that.color = d3.scaleOrdinal(d3.schemeCategory20)
    // that.color = d3.scaleOrdinal().range(['#5EAFC6', '#FE9922', '#93c464', '#75739F'])

    // loads the data and calls the initialization methods
    // d3.json('@components/data/map2.json',
      // function (error, data) {
      //   if (error) console.log(error)

        that.jsonData = data
        that.initialize()
        that.accumulate(that.rootNode, that)
        // that.InnerScaleTreemap(that.rootNode)

        that.treemap(that.rootNode)
        
        // console.log(that.InnerScaleTreemap(that.rootNode));
        // that.MainScaleNode = that.InnerScaleTreemap(that.rootNode)


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

    yParent2() {
      return d3.scaleLinear()
      .domain([0, this.height])
        .range([0, this.height])
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
      .paddingTop(15)
      // .paddingOuter(1)
      .paddingRight(1)
      .paddingLeft(1)
      .paddingBottom(1)
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

      /*
      **** IMPORTANT *****
      SUPRISINGLY it works the way we want by this LOG line!!!
      have to figure out a way to get rid  of this!!!!!
      */
      console.log(this.MainScaleNode);
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

      // this.accumulate(this.selected,this)
    },
       XText (x0,x1) {
        return ((x1 - x0) /2) + x0
      },
      YText (y0,y1) {
        return ((y1 - y0) /2) + y0 -7
      },
      YText2 (y0,y1) {
        return ((y1 - y0) /4) + y0 - 7
      },
    test(input) {
       return d3.scaleLinear()
      .domain([0, input])
        .range([0, this.width])
    },
    test2(input) {
       return d3.scaleLinear()
      .domain([0, input])
        .range([0, this.height])
    },
    mouse_move(key,eve) {
      // let tool = document.getElementById("tooltip")
        this.tooltip = true;
        this.tooltipHeaderName = key.data.name
        this.tooltipListOfChilds = key.data.children
        this.pageX = eve.pageX
        this.pageY = eve.pageY
        let t = eve.target.id.split(".")
        console.log("MM ",t[t.length-1])
        // console.log(this.tooltipHeaderName,this.tooltipListOfChilds);
        // console.log(eve);
      
    },
    InnerScaleTreemap (input) {
      let t =  d3.treemap()
      .size([this.width, this.height])
      .round(false)
      .paddingBottom(15)

      // return treemap(input)
      this.MainScaleNode = t(input)
      // return this.MainScaleNode;
      // this.MainScaleNode = null;

    },
    InnerTickerTextFontSizeAdjust(children){
        let width=children.parent.x1 - children.parent.x0
        
        let height=children.parent.y1 - children.parent.y0

       let c =((((children.x1 - children.x0)*(children.y1-children.y0))*100)/(height*width));
        if (c>=4) return "font-size:1.4rem"
        if (c<4 && c >= 3) return "font-size:1.3rem";
        if (c <3  && c>=2) return "font-size:1.2rem";
        if (c<2 && c>=1) return "font-size:1rem"
        if (c<1 && c>=0.8) return "font-size:0.95rem"
        if (c<0.8 && c>=0.6) return "font-size:0.75rem"
        if (c<0.6 && c>=0.5) return "font-size:0.65rem"

        if (c<0.5 && c>=0.1) return "font-size:0.5rem"
        if (c < 0.1 && c>=0.07) return "font-size:0.4rem"
        if (c < 0.07 && c>=0.04) return "font-size:0.3rem"

    },
    tickerTextFontSizeAdjust(x0,x1,y0,y1){
       let c =((((x1 - x0)*(y1-y0))*100)/(this.height*this.width));
        // console.log(c);
        // console.log(name);
   
        if (c>=4) return "font-size:1.7rem"
        if (c<4 && c >= 3) return "font-size:1.4rem";
        if (c <3  && c>=2) return "font-size:1.2rem";
        if (c<2 && c>=1) return "font-size:1rem"
        if (c<1 && c>=0.8) return "font-size:0.95rem"
        if (c<0.8 && c>=0.6) return "font-size:0.75rem"
        if (c<0.6 && c>=0.5) return "font-size:0.65rem"

        if (c<0.5 && c>=0.1) return "font-size:0.5rem"
        if (c < 0.1) return "font-size:0rem"
     
    },
    getColor(val) {
      let color = this.colors[5];
      // console.log(val);
      val = Math.round(val)
      switch (parseInt(val)) {
        case -5:
          color = this.colors[0];
          break;
        case -4:
          color = this.colors[1];
          break;

        case -3:
          color = this.colors[2];
          break;
        case -2:
          color = this.colors[3]
          break;
        case -1:
          color = this.colors[4];
          break;
        case 0:
          color = this.colors[5];
          break;
        case 1:
          color = this.colors[6];
          break;
        case 2:
          color = this.colors[7];
          break;
        case 3:
          color = this.colors[8];
          break;

        case 4:
            color = this.colors[9];
          break;
        case 5:
          color = this.colors[10];
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
  stroke: #262931
  
}

/* rect.parent,
.grandparent rect {
  stroke-width: 1px;
} */

.grandparent rect {
  fill: rgb(224, 224, 252);
  /* color: aliceblue; */
  
}
.parentSquare {
  stroke: #bbb;
}
.parentText {
  fill:blanchedalmond
}
/* .grandparent:hover rect {
  fill: #ee9700;
} */
/* g .children {
  margin-top: 20px;
} */
.child {
  cursor: pointer;
  stroke:rgb(36, 30, 30);
  /* margin-bottom: 20px !important; */
}
.child:hover   {
    opacity: 40%;
}
.childG:hover *{
text-shadow: 1px 1px #000000;
}
.childTickerName {
  fill:white;
  text-anchor: middle;
}
.childTickerValue {
  fill: white;
  text-align: center;
  text-anchor: middle;
}
/* .parent:hover {
  cursor: pointer;
  stroke:yellow
} */

.children rect.parent,
.grandparent rect {
  cursor: pointer;
}
.parentSquareText{
  fill:white;
  font-size:0.6rem;
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
.parentSquare{
      fill:#262931;

}
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active for <2.1.8 */ {
  opacity: 0;
}
.children:hover rect.child{
  stroke:yellow;
  stroke-width:2px;
}
.children:hover rect.parentSquare{
  stroke:yellow;
  fill:yellow !important;
  stroke-width:2px;
}
.children:hover rect.littleSquare{
  stroke:yellow;
  fill:yellow !important;
  stroke-width:2px;
}
.children:hover text.parentSquareText{
  fill:black !important;
}
#tooltip {
  position: absolute;
  top:20px;
  right:20px;
  width: 120px;
  height: auto;
  padding: 5px;
  background-color: white;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  -webkit-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  pointer-events: none;
}
</style>

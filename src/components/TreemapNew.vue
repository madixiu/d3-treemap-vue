<template>
  <div class="treemap">
    <!-- *************  TOOLTIP PLACEMENT ************************* -->
    <div
      id="tooltipTreeMap"
      class="tooltipTreeMap"
      :style="tooltipPosition"
      v-if="tooltip && selectedNode.depth == 0"
    >
      <v-row class="tooltipTreeMapHeader">
        <v-chip label outlined color="#003049" x-small>
          <span style="font-size: 0.8rem">
            {{ tooltipHeaderName }}
          </span>
        </v-chip>
      </v-row>
      <v-row
        class="tooltipTreeMapRow"
        :style="`font-size: 0.7rem; direction: rtl;`"
      >
        <v-card
          width="100%"
          height="100%"
          class="tooltipTreeMapRow"
          color="#e9c46a"
          style="padding-top:5px;padding-bottom:5px"
        >
          <v-row style="margin-right:0px;margin-left:0px">
            <v-col class="flex-item">
              <span style="font-size: 1.3em"> {{ tooltipChild.name }}</span>
            </v-col>
            <v-col class="flex-item">
              <span style="font-size: 1.3em">
                {{ tooltipChild.close.toLocaleString() }}</span
              >
            </v-col>
            <v-col
              class="flex-item"
              :style="tooltipChild.change < 0 ? 'color:red' : 'color:green'"
            >
              <span style="font-size: 1.3em" dir="ltr">
                {{ tooltipChild.change }}%</span
              >
            </v-col>
          </v-row>
        </v-card>
      </v-row>
      <v-row
        style="font-size: 0.7rem; direction: rtl"
        v-for="item in tooltipListOfChilds"
        :key="item.name"
        class="tooltipTreeMapRow"
      >
        <v-card width="100%" class="tooltipTreeMapRow">
          <v-row style="margin-right:0px;margin-left:0px">
            <v-col class="flex-item">
              <span style="font-size: 1.3em"> {{ item.name }}</span>
            </v-col>
            <v-col class="flex-item">
              <span style="font-size: 1.3em">{{
                item.close.toLocaleString()
              }}</span>
            </v-col>
            <v-col
              class="flex-item"
              :style="item.change < 0 ? 'color:red' : 'color:green'"
            >
              <span style="font-size: 1.3em" dir="ltr">{{ item.change }}%</span>
            </v-col>
          </v-row>
        </v-card>
      </v-row>
    </div>
    <!-- *************  TOOLTIP PLACEMENT ************************* -->
    <v-toolbar class="TreeMapToolbar" style="height:30px">
      <v-toolbar-title style="height:30px"
        ><span style="font-size:0.8em">
          {{ selectedNode.data.name }}
        </span></v-toolbar-title
      >
      <v-spacer></v-spacer>
      <!-- <v-btn x-small @click="BackButton"   outlined
      color="indigo">بازگشت</v-btn> -->
      <v-icon v-if="selectedNode.depth != 0" @click="BackButton" color="indigo"
        >mdi-arrow-left-circle</v-icon
      >
    </v-toolbar>
    <!-- The SVG structure is explicitly defined in the template with attributes derived from component data -->
    <svg
      :height="height"
      style="margin-left: 0px;margin-top:-31px"
      :width="width"
    >
      <g style="shape-rendering: crispEdges;" transform="translate(0,20)">
        <!-- The top most element, representing the previous node -->
        <!-- <g class="grandparent">
          <rect
            :height="20"
            :width="width - 2"
            :y="margin.top * -1 + 14"
            v-on:click="selectNode"
            :id="parentId"
          ></rect> -->

        <!-- The visible square text element with the id (basically a breadcumb, if you will) -->
        <!-- <text class="grandparentText" dy=".65em" :x="width / 2" y="0">
            {{ selectedNode.data.name }}
          </text>
        </g> -->
        <!-- We can use Vue transitions too! -->
        <transition-group
          name="fade"
          mode="out-in"
          tag="g"
          class="depth"
          v-if="selectedNode"
        >
          <!-- Generate each of the visible squares at a given zoom level (the current selected node) -->
          <g
            class="children"
            v-for="children in selectedNode._children"
            :key="'c_' + children.id"
            @mousemove="mouse_move(children, $event)"
            @mouseleave="tooltip = false"
          >
            <!-- 
              The visible square rect element.
              You can attribute directly an event, that fires a method that changes the current node,
              restructuring the data tree, that reactivly gets reflected in the template.
            -->
            <g v-if="selectedNode.depth == 1" direction="ltr">
              <rect
                class="parent"
                :id="children.id"
                :key="children.data.id"
                :x="x(children.x0)"
                :y="y(children.y0) + 15"
                :width="x(children.x1 - children.x0 + children.parent.x0)"
                :height="y(children.y1 - children.y0 + children.parent.y0)"
                :style="getColor(children.data.change)"
              ></rect>
              <text
                class="parentChildsText"
                dy="1em"
                :key="'name_' + children.data.id"
                :x="x(children.x0) + 6"
                :y="y(children.y0) + 15"
                :style="InnerTickerTextFontSizeAdjust(children)"
              >
                {{ children.data.name }}
              </text>

              <text
                class="parentChildsValue"
                dy="2.3em"
                :key="'change_' + children.data.id"
                :x="x(children.x0) + 6"
                :y="y(children.y0) + 15"
                :style="InnerTickerTextFontSizeAdjust(children)"
              >
                {{ children.data.change }}%
              </text>
            </g>

            <!-- Generate the children squares (only visible on hover of a square) -->
            <g
              v-for="child in children._children"
              :key="'c_' + child.id"
              class="childG"
              direction="ltr"
              @mousemove="mouse_moveChild(child, $event)"
            >
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
              ></rect>
              <!-- ticker TEXT ********************************* -->
              <text
                class="childTickerName"
                :key="'name_t_' + child.id"
                :x="XText(child.x0, child.x1)"
                :y="YText2(child.y0, child.y1)"
                :style="
                  tickerTextFontSizeAdjust(
                    child.x0,
                    child.x1,
                    child.y0,
                    child.y1
                  )
                "
              >
                {{ child.data.name }}
              </text>
              <text
                class="childTickerValue"
                dy="0.3em"
                :key="'percent_t_' + child.id"
                :x="XText(child.x0, child.x1)"
                :y="YText(child.y0, child.y1)"
                :style="
                  tickerTextFontSizeAdjust(
                    child.x0,
                    child.x1,
                    child.y0,
                    child.y1
                  )
                "
              >
                {{ child.data.change + "%" }}
              </text>
              <!-- ticker TEXT ********************************* -->
            </g>

            <!-- HEADER SQUARES WITH NAMES ***************************** -->
            <g v-if="selectedNode.depth == 0">
              <rect
                v-on:click="selectNode"
                class="parentSquare"
                :x="x(children.x0)"
                :y="y(children.y0)"
                :width="x(children.x1 - children.x0 + children.parent.x0)"
                height="15"
              ></rect>
              <rect
                class="littleSquare"
                :x="x(children.x0) + 5"
                :y="y(children.y0) + 8"
                width="10"
                height="10"
                style="fill:#262931;transform-box:fill-box;"
                transform="rotate(45)"
                transform-origin="50% 50%"
              ></rect>
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
    </svg>
  </div>
</template>

<script>
import { scaleLinear, scaleOrdinal, scaleQuantize } from "d3-scale";
// import {json} from 'd3-request'
import { hierarchy, treemap } from "d3-hierarchy";
// To be explicit about which methods are from D3 let's wrap them around an object
// Is there a better way to do this?
let d3 = {
  scaleLinear: scaleLinear,
  scaleOrdinal: scaleOrdinal,
  scaleQuantize: scaleQuantize,
  // schemeCategory20: schemeCategory20,
  // json: json,
  hierarchy: hierarchy,
  treemap: treemap
};
// import data from "@/components/data/map2.json";
// import mapData from "./data/map2.json";
export default {
  // name: "treemap",
  props: { inputData: Object, inputWidth: Number, inputHeight: Number },
  // the component's data
  data() {
    return {
      jsonData: {
        name: "نقشه بازار",
        children: [
          {
            name: "استخراج زغال سنگ",
            children: [
              {
                name: "کشرق",
                close: 108622,
                change: 1.8,
                value: 9124248000000,
                tickerFull: "صنعتی و معدنی شمال شرق شاهرود"
              },
              {
                name: "کپرور",
                close: 45906,
                change: -3.27,
                value: 24789240000000,
                tickerFull: "فرآوری زغال سنگ پروده طبس"
              },
              {
                name: "کطبس",
                close: 67050,
                change: 3.2,
                value: 12404250000000,
                tickerFull: "ذغال‌سنگ‌ نگین‌ ط‌بس‌"
              }
            ]
          }
        ]
      },
      tooltipChild: null,
      pageX: null,
      MainScaleNode: null,
      pageY: null,
      tooltip: false,
      rootNode: {},
      tooltipHeaderName: null,
      tooltipListOfChilds: [],
      margin: {
        top: 20,
        right: 0,
        bottom: 0,
        left: 0
      },
      width: 1250,
      height: 550,
      selected: null,
      colors: [
        "fill:#f63538", // 0 lightest Red
        "fill:#eb363a", // 1
        "fill:#e0373c", // 2
        "fill:#c9393f", // 3
        "fill:#b33b43", // 4
        "fill:#9c3d46", // 5
        "fill:#86374a", // 6
        "fill:#6f414d", // 7
        "fill:#584351", // 8 darkest Red
        "fill:#414554", // 9 Black
        "fill:#404e55", // 10 darkest Green
        "fill:#3f5655", // 11
        "fill:#3d6756", // 12
        "fill:#398957", // 13
        "fill:#379a58", // 14
        "fill:#35ab59", // 15
        "fill:#33bc5a", // 16
        "fill:#32c45a", // 17
        "fill:#30cc5a" // 18 lightes Green
      ]
    };
  },
  // You can do whatever when the selected node changes
  watch: {
    // eslint-disable-next-line no-unused-vars

    selectedNode(newData, oldData) {
      // console.log("The selected node changed...");
      // console.log(newData.data);
      // console.log(oldData.depth);
      if (newData.depth == 1) {
        // this.initialize()
        this.accumulate(this.rootNode, this);
        this.InnerScaleTreemap(this.rootNode);
      } else if (newData.depth == 0 && oldData.depth == 1) {
        this.initialize();
        this.accumulate(this.rootNode, this);
        this.treemap(this.rootNode);
      }

      // console.log(newData.y0,newData.x0,newData.y1,newData.x1);
    }
  },
  created() {
    // this.loadData();
    this.width = this.inputWidth;
    this.height = this.inputHeight;
    // this.jsonData = this.inputData;

    // this.jsonData = null;
  },
  // In the beginning...
  mounted() {
    // var that = this;
    // console.log(this.getColor(-1));

    // An array with colors (can probably be replaced by a vuejs method)
    // that.color = d3.scaleOrdinal(d3.schemeCategory20)
    // that.color = d3.scaleOrdinal().range(['#5EAFC6', '#FE9922', '#93c464', '#75739F'])
    // loads the data and calls the initialization methods
    // d3.json('@components/data/map2.json',
    // function (error, data) {
    //   if (error) console.log(error)
    // that.jsonData = this.data;
    // console.log(this.jsonData);
    this.initialize();
    this.accumulate(this.rootNode, this);
    this.treemap(this.rootNode);
    // console.log(that.InnerScaleTreemap(that.rootNode));
    // that.MainScaleNode = that.InnerScaleTreemap(that.rootNode)
    // }
    // )
  },
  // The reactive computed variables that fire rerenders
  computed: {
    tooltipPosition() {
      if (this.pageX > this.width / 2) {
        if (this.pageY > this.height / 2) {
          let res = {
            right: this.width - this.pageX + 10 + "px",
            bottom: this.height - this.pageY + 70 + "px"
          };
          return res;
        } else {
          let res = {
            right: this.width - this.pageX + "px",
            top: this.pageY + "px"
          };
          return res;
        }
      } else {
        if (this.pageY > this.height * (2 / 3)) {
          let res = {
            left: this.pageX + 10 + "px",
            bottom: this.height - this.pageY + 70 + "px"
          };
          return res;
        }
        return {
          left: this.pageX + "px",
          top: this.pageY + "px"
        };
      }
    },
    myColor() {
      return d3
        .scaleLinear()
        .domain([1, 10])
        .range(["#FFFFFF", "#000000"]);
    },
    positiveColor() {
      return (
        d3
          .scaleLinear()
          .domain([0.05, 6])
          // .range(["#404e55", "#3f5655", "#3d6756", "#398957", "#379a58", "#35ab59", "#33bc5a", "#32c45a", "#30cc5a"]);
          .range(["#404e55", "#30cc5a"])
      );
    },
    negativeColor() {
      return (
        d3
          .scaleLinear()
          .domain([-2, -0.05])
          // .range(["#f63538", "#eb363a","#e0373c", "#c9393f", "#b33b43", "#9c3d46", "#86374a", "#6f414d", "#584351"]);
          .range(["#f63538", "#584351"])
      );
    },
    // The grandparent id
    parentId() {
      if (
        this.selectedNode.parent === undefined ||
        this.selectedNode.parent === null
      ) {
        return this.selectedNode.id;
      } else {
        return this.selectedNode.parent.id;
      }
    },
    // Returns the x position within the current domain
    // Maybe it can be replaced by a vuejs method
    x() {
      return d3
        .scaleLinear()
        .domain([0, this.width])
        .range([0, this.width]);
    },
    // Returns the y position within the current domain
    // Maybe it can be replaced by a vuejs method
    y() {
      return d3
        .scaleLinear()
        .domain([0, this.height - this.margin.top - this.margin.bottom])
        .range([0, this.height - this.margin.top - this.margin.bottom]);
    },

    yParent2() {
      return d3
        .scaleLinear()
        .domain([0, this.height])
        .range([0, this.height]);
    },
    yParent() {
      return d3
        .scaleLinear()
        .domain([0, this.height - this.margin.top - this.margin.bottom])
        .range([0, this.height - this.margin.top - this.margin.bottom]);
    },
    // The D3 function that recursively subdivides an area into rectangles
    treemap() {
      return (
        d3
          .treemap()
          // .tile(d3.treemapResquarify)
          .size([this.width, this.height])
          .round(false)
          .paddingTop(15)
          // .paddingOuter(1)
          .paddingRight(1)
          .paddingLeft(1)
          .paddingBottom(1)
      );
    },

    // InnerScaleTreemap() {
    //   console.log("INNNER");
    //   return (
    //     d3
    //       .treemap()
    //       .size([this.width, this.height])
    //       .round(false)
    //       .paddingBottom(15)
    //       .paddingTop(10)
    //   );
    //   // return treemap(input)

    //   // return this.MainScaleNode;
    //   // this.MainScaleNode = null;
    // },
    // The current selected node
    selectedNode() {
      let node = null;

      if (this.selected) {
        let nd = this.getNodeById(this.rootNode, this.selected, this);

        if (nd._children) {
          node = nd;
        } else {
          node = nd.parent;
        }
      } else {
        node = this.rootNode;
      }

      // Recalculates the y and x domains
      this.x.domain([node.x0, node.x0 + (node.x1 - node.x0)]);
      this.y.domain([node.y0, node.y0 + (node.y1 - node.y0)]);

      /*
      **** IMPORTANT *****
      SUPRISINGLY it works the way we want by this LOG line!!!
      have to figure out a way to get rid  of this!!!!!
      */
      console.error(this.MainScaleNode);
      // this.MainScaleNode
      return node;
    }
  },
  methods: {
    // Called once, to create the hierarchical data representation
    initialize() {
      let that = this;

      if (that.jsonData) {
        that.rootNode = d3
          .hierarchy(that.jsonData)
          .eachBefore(function(d) {
            d.id = (d.parent ? d.parent.id + "." : "") + d.data.name;
          })
          .sum(d => d.value)
          .sort(function(a, b) {
            return b.height - a.height || b.value - a.value;
          });
        that.rootNode.x = that.rootNode.y = 0;
        that.rootNode.x1 = that.width;
        that.rootNode.y1 = that.height;
        that.rootNode.depth = 0;
      }
    },
    // Calculates the accumulated value (sum of children values) of a node - its weight,
    // represented afterwards in the area of its square
    accumulate(d, context) {
      d._children = d.children;

      if (d._children) {
        d.value = d._children.reduce(function(p, v) {
          return p + context.accumulate(v, context);
        }, 0);
        return d.value;
      } else {
        return d.value;
      }
    },
    // Helper method - gets a node by its id attribute
    getNodeById(node, id, context) {
      if (node.id === id) {
        return node;
      } else if (node._children) {
        for (var i = 0; i < node._children.length; i++) {
          var nd = context.getNodeById(node._children[i], id, context);
          if (nd) {
            return nd;
          }
        }
      }
    },
    // When a user clicks a square, changes the selected data attribute
    // which fires the computed selectedNode, which in turn finds the Node by the id of the square clicked
    // and the template reflects the changes
    selectNode(event) {
      // console.log(event.target.id);
      // console.log(event.target);
      console.log(event.target.id);
      this.selected = event.target.id;

      // this.accumulate(this.selected,this)
    },
    XText(x0, x1) {
      return (x1 - x0) / 2 + x0;
    },
    YText(y0, y1) {
      return (y1 - y0) / 2 + y0 - 5;
    },
    YText2(y0, y1) {
      return (y1 - y0) / 4 + y0 - 5;
      // return (y1 - y0) / 2 +y0-7;
    },
    test(input) {
      return d3
        .scaleLinear()
        .domain([0, input])
        .range([0, this.width]);
    },
    test2(input) {
      return d3
        .scaleLinear()
        .domain([0, input])
        .range([0, this.height]);
    },
    // eslint-disable-next-line no-unused-vars
    mouse_move(key, eve) {
      return;
      // if (key.data.children != undefined) {
      //   this.tooltipHeaderName = key.data.name;
      //   let children = key.data.children;
      //   this.pageX = eve.pageX;
      //   this.pageY = eve.pageY;
      //   children.sort((a, b) => b.value - a.value);

      //   this.tooltipListOfChilds = children.slice(0, 15);

      //   this.tooltip = true;

      // }
    },
    mouse_moveChild(key, eve) {
      if (key.data != undefined) {
        this.tooltipChild = key.data;
        this.tooltipHeaderName = key.parent.data.name;
        let children = key.parent.data.children;
        this.pageX = eve.pageX;
        this.pageY = eve.pageY;
        children = children.filter(function(el) {
          return el.name != key.data.name;
        });
        children.sort((a, b) => b.value - a.value);
        this.tooltipListOfChilds = children.slice(0, 15);

        // console.log(eve, key.data);
        this.tooltip = true;
      }
    },
    BackButton() {
      console.log("back button clicked");
      this.selected = "نقشه بازار";
    },
    InnerScaleTreemap(input) {
      let t = d3
        .treemap()
        .size([this.width, this.height])
        .round(false)
        // .paddingRight(1)
        // .paddingLeft(1);
      // .paddingBottom(1);
      // return treemap(input)
      this.MainScaleNode = t(input);
      return this.MainScaleNode;
      // return this.MainScaleNode;
      // this.MainScaleNode = null;
    },
    InnerTickerTextFontSizeAdjust(children) {
      let width = children.parent.x1 - children.parent.x0;

      let height = children.parent.y1 - children.parent.y0;

      let c =
        ((children.x1 - children.x0) * (children.y1 - children.y0) * 100) /
        (height * width);
      if (c >= 4) return "font-size:1.4rem";
      if (c < 4 && c >= 3) return "font-size:1.3em";
      if (c < 3 && c >= 2) return "font-size:1.2em";
      if (c < 2 && c >= 1) return "font-size:1em";
      if (c < 1 && c >= 0.8) return "font-size:0.95rem";
      if (c < 0.8 && c >= 0.6) return "font-size:0.75rem";
      if (c < 0.6 && c >= 0.5) return "font-size:0.65rem";

      if (c < 0.5 && c >= 0.1) return "font-size:0.5rem";
      if (c < 0.1 && c >= 0.07) return "font-size:0.4rem";
      if (c < 0.07 && c >= 0.04) return "font-size:0.3rem";
    },
    tickerTextFontSizeAdjust(x0, x1, y0, y1) {
      let c = ((x1 - x0) * (y1 - y0) * 100) / (this.height * this.width);
      // console.log(c);
      let constant = 0.7335775996;
      // console.log(name);
      // console.log(Math.pow(c,0.2)/constant);
      if (c < 0.1) return "font-size:0rem";
      else return `font-size:${Math.pow(c, 0.5) / constant}em`;

      // if (c >= 4) return "font-size:2em";
      // if (c < 4 && c >= 3) return "font-size:2.6em";
      // if (c < 3 && c >= 2) return "font-size:1.2rem";
      // if (c < 2 && c >= 1) return "font-size:1rem";
      // if (c < 1 && c >= 0.8) return "font-size:0.95rem";
      // if (c < 0.8 && c >= 0.6) return "font-size:0.75rem";
      // if (c < 0.6 && c >= 0.5) return "font-size:0.65rem";

      // if (c < 0.5 && c >= 0.1) return "font-size:0.5rem";
      // if (c < 0.1) return "font-size:0rem";
    },
    getColor(val) {
      // console.log(this.positiveColor(0.05));

      // let color = this.colors[1];
      let color = "fill:#414554";
      // let min = -2.0;
      // let max = 5.0;
      // let positiveBase = (4.95) / 9.0;
      // let positiveBase = 0.49444444444444446;
      // let negativeBase = -0.22777777777777775;
      // val = parseFloat(val);
      if (0.05 > val && val > -0.05) {
        // console.log(val);
        // console.log("black");
        color = "fill:#414554"; // color 0
      } else if (0.05 <= val && val <= 6) {
        // console.log("pos");
        color = "fill:" + this.positiveColor(val);
      } else if (-2 <= val && val <= -0.05) {
        // console.log("neg");
        color = "fill:" + this.negativeColor(val);
      } else if (val > 6) color = "fill:#30cc5a";
      else if (val < -2) color = "fill:#f63538";

      return color;
    }
  }
};
</script>

<style scoped>
text {
  pointer-events: none;
}

.grandparent text {
  /* font-weight: bold; */
  fill: wheat;
  font-weight: 600;
}

rect {
  fill: none;
  stroke: #262931;
}

/* rect.parent,
.grandparent rect {
  stroke-width: 1px;
} */

.grandparent rect {
  fill: #1e1e2d;
  /* color: aliceblue; */
}
.parentSquare {
  stroke: #bbb;
}
.parentText {
  fill: blanchedalmond;
}
/* .grandparent:hover rect {
  fill: #ee9700;
} */
/* g .children {
  margin-top: 20px;
} */
.child {
  cursor: pointer;
  stroke: rgb(36, 30, 30);
  /* margin-bottom: 20px !important; */
}
.child:hover {
  opacity: 0.8 !important;
}
.childG:hover * {
  text-shadow: 1px 1px #000000;
}
.childTickerName {
  fill: white;
  text-anchor: middle;
  font-family: "Vazir-Medium-FD";
}
.childTickerValue {
  fill: white;
  text-align: center;
  text-anchor: middle;
  font-family: "Vazir-Medium-FD";
}
/* .parent:hover {
  cursor: pointer;
  stroke:yellow
} */

.children rect.parent,
.grandparent rect {
  cursor: pointer;
}
.parentSquareText {
  fill: white;
  font-size: 0.6rem;
  text-anchor: end;
}

.children rect.parent {
  fill: #bbb;
  fill-opacity: 0.9;
}

.children:hover rect.child {
  fill: #bbb;
}

.children text {
  font-size: 0.8em;
}

.grandparent text {
  font-size: 0.8em;
  /* color: rgb(255, 255, 255); */
}
.grandparentText {
  color: #bbb !important;
  text-anchor: middle;
}
.parentChildsText {
  fill: white;
  font-size: 0.6rem;
  text-anchor: start;
  font-family: "Vazir-Medium-FD";
}
.parentChildsValue {
  /* fill-opacity: 1; */
  fill: white;
  text-anchor: start;
  font-family: "Vazir-Medium-FD";
}
.parentSquare {
  /* fill: #262931; */
  /* fill: #262b42; */
  fill: #262931;
}
.littleSquare {
  fill: #262931;
}
.list-enter-active,
.list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active for <2.1.8 */ {
  opacity: 0;
}
.children:hover rect.child {
  stroke: #f5cc00;
  stroke-width: 2px;
}
.children:hover rect.parentSquare {
  stroke: #f5cc00;
  fill: #f5cc00 !important;
  stroke-width: 2px;
}
.children:hover rect.littleSquare {
  stroke: #f5cc00;
  fill: #f5cc00 !important;
  stroke-width: 2px;
}
.children:hover text.parentSquareText {
  fill: black !important;
}
/* .tooltipTreeMapHeader {
  display: flex;
  align-content: center;
  justify-content: center;
}
div#tooltipTreeMap {
  position: absolute;
  width: 220px;
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
.flex-container {
  display: -webkit-flex;
  display: flex;
  -webkit-justify-content: space-between;
  justify-content: space-between;
  -webkit-align-items: center;
  align-items: center;
}
.flex-items {
  display: block;
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: auto;
  align-self: auto;
  order: 0;
} */
div#tooltipTreeMap {
  position: absolute;
  /* top: 20px; */
  /* right: 0px; */
  width: auto;
  height: auto;
  padding: 15px;
  padding-right: 5px;
  padding-left: 5px;
  margin-left: 20px;
  margin-top: 20px;
  z-index: 1000;
  background-color: #f4f1de;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  -webkit-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  pointer-events: none;
}
.flex-container {
  display: flex;

  justify-content: space-between;
  align-items: center;
  /* flex-flow: row nowrap; */
  flex-direction: row;
  flex-wrap: nowrap;
}
.flex-item {
  /* background-color:brown; */
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  /* border:1px solid;
  border-color:crimson; */
  /* flex-grow: 0; */
  /* flex-shrink: ; */
  /* flex-basis: auto; */
  /* align-self: auto; */
  order: 0;
}
.flex-item2 {
  flex-grow: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tooltipTreeMapHeader {
  display: flex;
  align-content: center;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
  /* margin-bottom: 2px; */
  width: 100%;
  margin-right: 0px !important;
  margin-left: 0px !important;
}
.tooltipTreeMapRow {
  width: 100%;
  padding-top: 2px;
  margin-right: 0px !important;
  margin-left: 0px !important;
  padding-right: 0px;
  /* margin-bottom:1px; */

  /* border:1px solid; */
  /* border-color:crimson; */
}
.tooltipTreeMapRow2 {
  width: 100%;
  /* height: 120px; */
  padding-top: 5px;
  padding-bottom: 5px;
  margin-right: 0px !important;
  margin-left: 0px !important;
  padding-right: 0px;
  /* margin-bottom:1px; */

  /* border:1px solid; */
  /* border-color:crimson; */
}
/* .TreeMapToolbar /deep/ .v-sheet.theme--light.v-toolbar.v-toolbar--dense {
  height: 30px !important;
} */
.TreeMapToolbar /deep/ .v-toolbar__content {
  height: 30px !important;
}
</style>

<template>
  <div>
    <svg
    :width="width"
    :height="height"
    :viewBox="`0 0 ${width+2*margin},${height+2*margin}`"
    preserveAspectRatio="xMidYMid meet"
    >
    <g class="parentG">
    
    <g 
      class="boxt"
      :transform="`translate(${margin}, ${margin})`">

      <rect
        :x="0"
        :y="margin"
        :height="titleHeight"
        :width="boxwidth"
        style="fill:#fff"
      ></rect>
      <text
        class="title"
        :x="boxwidth*0.9"
        :y="margin+titleHeight*0.5"
        style="text-anchor:middle"
      >نام صنعت</text>
    </g>
    <g
      class="boxt"
      :transform="`translate(${margin}, ${margin})`"
    >
      <rect
      class="boxt"
      :x="0"
      :y="titleHeight+margin"
      :height="boxheight*1.3"
      :width="boxwidth"
      style="fill:#E41414;opacity:100%">

      </rect>
      <text
        class="title"
        :x="boxwidth*0.9"
        :y="margin+titleHeight+boxheight*0.7"
        style="fill:white"
      >Selected</text>
    </g>
    <g
      class="boxt"
      :transform="`translate(${margin}, ${margin})`"
    >
          <g v-for="item in tooltipListOfChilds"
              :key="item.name"
          >
          <rect
            class="boxt"
            :x="0"
            :y="yScale(uniqueNames.indexOf(item.name))"
            :height="boxheight"
            :width="boxwidth"
            style="fill:white"
          ></rect>
          <text
            style="fill:#000;font-size:14px;font-weight:700;text-anchor:middle"
            :x="boxwidth*0.9"
            :y="yScale(uniqueNames.indexOf(item.name))+boxheight*0.5"
          >
            {{ item.name }}
          </text>
          <!-- <path
            style="fill:none;stroke:#000;stroke-width:2;stroke-linejoin:round;stroke-linecap:round"
            :transform="`translate(${margin},${yScale(uniqueNames.indexOf(item.name))})`"
            :d="line"
            :datum="datumData(item.name)"
          ></path> -->
          <text
            class="pricetag"
            style="fill:green;text-anchor:middle"
            :x="boxwidth*0.3"
            :y="yScale(uniqueNames.indexOf(item.name))+boxheight*0.5"
          >
            {{ item.change+"%"}}
          </text>
          <text
            class="pricetag"
            style="text-anchor:middle;fill:#000;"
            :x="boxwidth*0.1"
            :y="yScale(uniqueNames.indexOf(item.name))+boxheight*0.5"
            >
            {{formatComma(item.close) }}
          </text>
          </g>
    </g>


    </g>

    </svg>
  </div>
</template>
<script>
import {scaleLinear, scaleOrdinal} from 'd3-scale'
import { timeParse } from "d3-time-format";
import { format } from "d3"
import { max, min } from "d3"
import { line } from "d3-shape"
let d3 = {
  scaleLinear: scaleLinear,
  scaleOrdinal: scaleOrdinal,
  max: max,
  min: min,
  format: format,
  timeParse: timeParse,
  line: line
}
import tooltipData from "../components/data/tooltipData2.json"
export default {
  data() {
    return {
      tooltipData2:[],
      uniqueNames:[],
      tooltipHeaderName:"شرکتهای چند رشته ای صنعتی",
      tooltipListOfChilds:[{
            "name": "اپرداز",
            "close": 24274,
            "change": -1.75,
            "value": 24274000000000,
            "tickerFull": "آتیه داده پرداز"
          },
          {
            "name": "اوان",
            "close": 52791,
            "change": 3.89,
            "value": 10558200000000,
            "tickerFull": "مبین وان کیش"
          },
          {
            "name": "های وب",
            "close": 26560,
            "change": 3.35,
            "value": 106240000000000,
            "tickerFull": "داده گسترعصرنوین-های وب"
          }],
      margin: 10,
      width: 960,
      height: 1000,
      titleHeight: 30,
      boxwidth: 400,
      boxheight: 80,
      data3:[
  {"r":7,"ID":826,"ticker":"های وب","engdate":"20210112","adjustedclosing":28350}, 
 {"r":1,"ID":826,"ticker":"های وب","engdate":"20210123","adjustedclosing":27550}, 
 {"r":3,"ID":826,"ticker":"های وب","engdate":"20210119","adjustedclosing":25670}, 
 {"r":4,"ID":826,"ticker":"های وب","engdate":"20210118","adjustedclosing":26880}, 
 {"r":6,"ID":826,"ticker":"های وب","engdate":"20210113","adjustedclosing":29020}, 
 {"r":2,"ID":826,"ticker":"های وب","engdate":"20210120","adjustedclosing":26560}, 
 {"r":5,"ID":826,"ticker":"های وب","engdate":"20210116","adjustedclosing":28230},      
 {"r":6,"ID":1035,"ticker":"اپرداز","engdate":"20210113","adjustedclosing":25896}, 
 {"r":3,"ID":1035,"ticker":"اپرداز","engdate":"20210119","adjustedclosing":24700}, 
 {"r":1,"ID":1035,"ticker":"اپرداز","engdate":"20210123","adjustedclosing":24929}, 
 {"r":4,"ID":1035,"ticker":"اپرداز","engdate":"20210118","adjustedclosing":24933}, 
 {"r":5,"ID":1035,"ticker":"اپرداز","engdate":"20210116","adjustedclosing":24967}, 
 {"r":7,"ID":1035,"ticker":"اپرداز","engdate":"20210112","adjustedclosing":27169}, 
 {"r":2,"ID":1035,"ticker":"اپرداز","engdate":"20210120","adjustedclosing":24274}, 
 {"r":5,"ID":969,"ticker":"اوان","engdate":"20210116","adjustedclosing":51297}, 
 {"r":2,"ID":969,"ticker":"اوان","engdate":"20210120","adjustedclosing":52791}, 
 {"r":1,"ID":969,"ticker":"اوان","engdate":"20210123","adjustedclosing":55010}, 
 {"r":4,"ID":969,"ticker":"اوان","engdate":"20210118","adjustedclosing":48760}, 
 {"r":3,"ID":969,"ticker":"اوان","engdate":"20210119","adjustedclosing":50734}, 
 {"r":7,"ID":969,"ticker":"اوان","engdate":"20210112","adjustedclosing":54728}, 
 {"r":6,"ID":969,"ticker":"اوان","engdate":"20210113","adjustedclosing":52216}],
      data2:[  
    {
        "name": "اطلاعات و ارتباطات",
        "children": [
          {
            "name": "اپرداز",
            "close": 24274,
            "change": -1.75,
            "value": 24274000000000,
            "tickerFull": "آتیه داده پرداز"
          },
          {
            "name": "اوان",
            "close": 52791,
            "change": 3.89,
            "value": 10558200000000,
            "tickerFull": "مبین وان کیش"
          },
          {
            "name": "های وب",
            "close": 26560,
            "change": 3.35,
            "value": 106240000000000,
            "tickerFull": "داده گسترعصرنوین-های وب"
          }
        ]
      }]
    }
  }, // end of data
  computed:{
    line() {
      return d3.line()
      .defined(d => !isNaN(d.date))
    .x(d =>this.xScalesub((d.date)))
    .y(d => this.yScalesub(d.info.adjustedclosing))
    },
    yScale() {
      return d3.scaleLinear()
    .domain([ this.tooltipListOfChilds.length-1, 0])
    .range([((this.uniqueNames.length)*this.boxheight)+this.titleHeight+this.margin, this.margin+this.titleHeight+this.boxheight*1.3])
    },

    
  }
  ,
  beforeCreate() {
    console.log("this is beforeCreate");
    // let that = this
    // this.datumData("اوان")
    // this.tooltipData2 = tooltipData
    // console.log(this.uniqueNames);
    // tooltipData.forEach(function(d) {
    //     d.date = that.parseTime(d.info.engdate);
    //   });

  },
  created(){
    let that = this
    // this.datumData("اوان")
    // this.tooltipData2 = tooltipData
    // console.log(this.uniqueNames);
    tooltipData.forEach(function(d) {
        d.date = that.parseTime(d.info.engdate);
      });
  },
  mounted(){
    this.uniqueNames = [...new Set(this.data2[0]['children'].map(({name})=>name))]

    console.log(this.uniqueNames);
    // this.yScale()
    console.log(tooltipData);
    console.log(this.yScale(0));
  },
  methods: {
    datumData(item) {
      let h = this.tooltipData2.filter(function(d) {
         if(d.ticker == item) return d
      }).filter(this.line().defined())
      console.log(h);
      return h
    },
    parseTime(input) {
      let p = d3.timeParse("%Y%m%d")
      return p(input)
    },
    formatComma(input){
      let f = d3.format(",")
      return f(input)
    },
    xScalesub(input) { 
      input.sort(function(a, b) { return a.date - b.date; });

      return d3.scaleTime()
        .domain(d3.extent(input, d => d.date))
        .range([this.margin+this.boxwidth*0.4, this.boxwidth*0.7])
    },
    //  yScale(d) {
    //   // console.log(this.uniqueNames);
    //   let t =  d3.scaleLinear()
    // .domain([ d3.max(this.uniqueNames, function(d) { return this.uniqueNames.indexOf(d); }), d3.min(this.uniqueNames, function(d) { return this.uniqueNames.indexOf(d) })])
    // .range([((this.uniqueNames.length)*this.boxheight)+this.titleHeight+this.margin, this.margin+this.titleHeight+this.boxheight*1.3])
    // return t
    // } 
  }
}
</script>
<style>
text.label {
  font-family: 'Vazir', sans-serif;
  font-size: 14px;
  font-weight: 400;
}
.title{
  font-size:14px;
  text-anchor:middle;
}
.pricetag{
  font-family: 'Dirooz FD', sans-serif;
  font-size: 14px;
  font-weight: 400;


}
.boxt{
  stroke-width:0.2;
  stroke:rgb(0,0,0)
}
</style>
<template>
  <div>
    <div class="col-xxl-12 mx-auto">
      <div id="charset" style="display: contents;"></div>
    </div>
  </div>
</template>
<script>
import data from "@/components/data/map2.json";
// import data from "../d3/data/map.json";
import * as d3 from "d3";
export default {
  data() {
    return {
      dataList: null,
      width: 960,
      height: 1060,
      colors: ["#AA2121", "#C84040", "#ED7171", "#33BA33", "#518651", "#215E2C"]
    }; // end of return
  }, // end of dynamic data

  beforeMount() {
    this.dataList = data;
  },
  mounted() {
    let vm = this;

    let chartDiv = document.getElementById("charset");
    // this.width = chartDiv.clientWidth;
    // this.height = chartDiv.clientHeight;
    // console.log(this.width);
    // console.log(this.height);
    this.width = 1340;
    this.height = 800;

    var svg = d3
      .select(chartDiv)
      .append("svg")

      .attr("width", this.width)
      .attr("height", this.height);

    var format = d3.format(",d");
    // var color = d3.scaleSequential([8,0],d3.interpolateMagma)
    // var stratify = d3.stratify().parentId(d => d.id.substring(0, d.id.lastIndexOf(".")));
    var treemap = d3
      .treemap()
      .tile(d3.treemapSquarify)
      .size([this.width, this.height])
      .paddingOuter(3)
      .paddingTop(12)
      .paddingInner(1)
      .round(true);
      

    var root = d3
      .hierarchy(this.dataList)
      .sum(d => d.value)
      .sort((a, b) => b.height - a.height || b.value - a.value);

    console.log(root.descendants());
    // console.log(root.leaves());
    // console.log(root.sum(d => d.value));
    console.log(root.descendants().filter(d => !d.children));
    treemap(root);

    var cell = svg
      .selectAll("node")
      // .selectAll("g")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`)
      // .attr("transform", d => "translate(" + d.x0 + "," + d.y0 +")")
      .attr("class", "node")
    // .each(d => d.node = this)
    // .on("mouseover",this.hovered(true))
    // .on("mouseout",this.hovered(false))
    //   .on("mouseover",hovered(true))
    //   .on("mouseout", function(d) {
    //       d3.selectAll(d.ancestors().map(function(d) { return d.node; }))
    //           .classed("node--hover", false)
    //         .select("rect")
    //           .attr("width", function(d) { return d.x1 - d.x0 - false; })
    //           .attr("height", function(d) { return d.y1 - d.y0 - false; });
    // })

    cell
      .append("rect")
      // .attr("id",d => "rect-" + d.id)
      // .attr("id",d => `rect-${d.id}`)
      .attr("id", d => (d.leafUid = "#leaf").id)
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      // .style("fill", d => color(d.depth))
      .style("fill", function(d) {
        if (d.depth == 0) {
          return "#fff";
        }
        if (d.depth == 1) {
        //   return "#3F3F3F";
          return "#000"
        }
        if (d.depth == 2) {
        //   return "#BFBFBF";
        return vm.getColor(Math.floor(d.data.change));
        }
        // } else {
        //   // return "#095B00"

        //   return vm.getColor(Math.floor(d.data.change));
        // }
      });
    

    cell
      .append("clipPath")
      // .attr("id", d => "clip-" + d.id)
      // .attr("id",d => `clip-${d.id}`)
      .attr("id", d => (d.clipUid = "#clip").id)
      .append("use")
      // .attr("xlink:href", d => "#rect-" + d.id)
      // .attr("xlink:href",d => `#rect-${d.id}`)
      .attr("xlink:href", d => d.leafUid.href);

    this.leaves = root.leaves();
    var tickerName = cell
      .append("text")
      // .attr("clip-path", d => "url(#clip-" + d.id + ")")

      .attr("clip-path", leaves => `url(#clip-${leaves.id})`)
      .attr("y", function() {
        let parentData = d3.select(this.parentNode).datum();
        return (parentData.y1 - parentData.y0) / 2;
      })
      .attr("text-anchor", "middle");

    var tickerValue = cell
      .append("text")
      .attr("clip-path", d => `url(#clip-${d.id})`)
      .attr("y", function() {
        let parentData = d3.select(this.parentNode).datum();
        return (parentData.y1 - parentData.y0) / 2;
      })
      .attr("text-anchor", "middle");

    // var industryTitle = cell.append("text")
    //   .attr("clip-path", d => `url(#clip-${d.id})`)
    //   .attr("y",function(){
    //         let parentData = d3.select(this.parentNode).datum();
    //         return (parentData.y1 - parentData.y0) /2 ;
    //       })
    //   .attr("text-anchor", "middle")
    svg
      .selectAll("indTitle")
      .data(root.descendants().filter(d => d.depth == 1))
      .enter()
      .append("text")
      .attr("x", d => d.x0 +2)
      .attr("y", d => d.y0 + 6)
      .text(d => d.data.name)
      // .attr("font-size", "15px")
      .attr("font-size", function(d) {
        let c = Math.floor((d.x1 - d.x0) / 25);
        // console.log(c);
        // if (c > 23) c = 22;
        if (c > 23) return "1.5rem";
        // if (c < 5) c = 0;
        if (c>=5 && c<=23) return "0.5rem"
        if (c < 5) return "0rem"
        // return c.toString() + "px";
        // return c.toString() + "rem";

      })
      .attr("fill", "#fff");
    
    //   cell.append("rect")
    //   .attr("id", d => (d.leafUid = "#leaf").id)
    //   .attr("width", 20)
    //   .attr("height", 20)
    //   .attr("x",12)
    //   .attr("y",-10)
    //   .attr("transform","rotate(45)")




    // for little squares ***************************************************************

    // svg
    // .selectAll("indTitle")
    // .data(root.descendants().filter(d => d.depth == 1))
    // .enter()
    // .append("circle")
    // .style("fill","red")
    // // .attr("id", d => (d.leafUid = "#leaf").id)
    // //   .attr("width", 10)
    //   .attr("r", 10)
    //   .attr("cx", d => d.x0 + 22)
    // //   .attr("y", d => d.y0)

    //   .attr("transform","rotate(45)")
    // //   .attr("y", d => d.y0 )
    //   .attr("cy", function(d){
    //       console.log(d);
    //       return d.y0
    //   })
      
//  *****************************************************************************************    

    // svg
    //   .selectAll("groupTitle")
    //   .data(root.descendants().filter(d => d.depth == 2))
    //   .enter()
    //   .append("text")
    //   .attr("x", d => d.x1 - 10)
    //   .attr("y", d => d.y0 + 16)
    //   .text(d => d.data.name)
    //   // .attr("font-size", "15px")
    //   .attr("font-size", function(d) {
    //     let c = Math.floor((d.x1 - d.x0) / 25);
    //     console.log(c);
    //     if (c > 23) c = 22;
    //     if (c < 5) c = 0;
    //     return c.toString() + "px";
    //   })
    //   .attr("fill", "#0A2853");

    // TICKER NAME
    tickerName
      .filter(d => !d.children)
      .append("tspan")
      .text(d => d.data.name)

      // .attr("dy", "-1.5em")
      .attr("x", function() {
        let parentData = d3.select(this.parentNode).datum();
        return (parentData.x1 - parentData.x0) / 2;
      })

      .attr("dy", "-1.4em")
      // .attr("text-anchor", "middle")
      .attr("fill", "#EAF2CE")

      .style("font-size", function(d) {
        // let d = d3.select(this.parentNode).datum()
        let c = Math.floor(Math.min(d.x1 - d.x0, d.y1 - d.y0) / 6);
        // console.log(c);
        if (c > 30) c = 35;
        return c.toString() + "px";
      });

    // TICKER VALUE
    tickerValue
      .filter(d => !d.children)

      .attr("dy", "0.8em")
      .append("tspan")
    //   .text(d => `\n${format(d.data.value)}`)
      .text(d => d.data.change + "%")
      .attr("x", function() {
        let parentData = d3.select(this.parentNode).datum();
        return (parentData.x1 - parentData.x0) / 2;
      })
      .attr("fill", "#F1F8A0")
      .style("font-size", function(d) {
        // let d = d3.select(this.parentNode).datum()
        let c = Math.floor(Math.min(d.x1 - d.x0, d.y1 - d.y0) / 6);
        // console.log(c);
        if (c > 30) c = 25;
        if (c < 4) c = 0;
        return c.toString() + "px";
      });
    // let here
    // // console.log(filter(d => d.children));
    // industryTitle.filter(d => d.depth ==1)

    //   .text( d => d.data.name)

    //   .append("tspan")
    //   .attr("x", 4 *10)
    //    .attr("y", (d, i) => 13 + i * 10)
    // .attr("x", function() {
    //   let parentData = d3.select(this.parentNode).datum();
    //   return (parentData.x1 - parentData.x0) /2
    // })
    // .attr("y",function(){
    //   let parentData = d3.select(this.parentNode).datum();
    //   return (parentData.y1 - parentData.y0) /2
    // // })
    // .style("fill","#FF1515")
    // .text(d => d)
    //  console.log(here)

    // label
    //   .filter(d => d.children)
    //   .selectAll("tspan")
    //     // .data( d => d.id.substring(d.id.lastIndexOf(".") + 1).split(/(?=[A-Z][^A-Z])/g).concat("\xa0" + format(d.value)))

    //     .data( d => d.data.name.split(/(?=[A-Z][^A-Z])/g).concat("\xa0" + format(d.value)))
    //   .enter().append("tspan")
    //     .attr("x", function() {
    //       let parentData = d3.select(this.parentNode).datum();
    //       return (parentData.x1 - parentData.x0) /2
    //     })
    //     .attr("y",function(){
    //       let parentData = d3.select(this.parentNode).datum();
    //       return (parentData.y1 - parentData.y0) /2
    //     })
    //     .attr("text-anchor", "middle")
    //     .text(d => d);

    // // leaf label
    //   label
    //     .filter(d => !d.children)
    //     .selectAll("tspan")
    //       // .data(d => d.id.substring(d.id.lastIndexOf(".") + 1).split(/(?=[A-Z][^A-Z])/g).concat(format(d.value)))
    //        .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g).concat("\x0a"+format(d.value)))
    //     .enter().append("tspan")
    //       // .attr("x", 4 *10)
    //       .attr("text-anchor", "middle")
    //       .attr("x",function() {
    //         let parentData = d3.select(this.parentNode).datum();
    //         return (parentData.x1 - parentData.x0) /2
    //       })
    //       // .attr("y", (d, i) => 13 + i * 10)
    //       .attr("y", function(){
    //         let parentData = d3.select(this.parentNode).datum();
    //         return (parentData.y1 - parentData.y0) /3
    //       })
    //       // .style("font-size",d => Math.min(d.x1 - d.x0, d.y1 - d.y0) / 6)
    //       .style("font-size",function(){
    //         let d = d3.select(this.parentNode).datum()
    //         let c = Math.floor(Math.min(d.x1 - d.x0, d.y1 - d.y0) / 6)
    //         console.log(c);
    //         if (c > 30)
    //         c = 35
    //         return c.toString()+'px'
    //       })
    //       .text(d => d)

    //       .style("fill", "white")

    cell.append("title").text(d => d.data.name + "\n" + format(d.value));

    // function hovered(hover) {
    //     return function(d) {
    //       d3.selectAll(d.ancestors().map(function(d) { return d.node; }))
    //           .classed("node--hover", hover)
    //         .select("rect")
    //           .attr("width", function(d) { return d.x1 - d.x0 - hover; })
    //           .attr("height", function(d) { return d.y1 - d.y0 - hover; });
    // };
    // }
  },

  methods: {
    getColor(val) {
      let color = "red";
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

    // hovered(hover,d) {
    //   return function(d) {
    //     d3.selectAll(
    //       d.ancestors().map(function(d) {
    //         return d.node;
    //       })
    //     )
    //       .classed("node--hover", hover)
    //     //   .select("rect")
    //     //   .attr("width", function(d) {
    //     //     return d.x1 - d.x0 - hover;
    //     //   })
    //     //   .attr("height", function(d) {
    //     //     return d.y1 - d.y0 - hover;
    //     //   })
    //       .style("fill","yellow")
    //   };
    // }
  }
}; // end of export default
</script>

<style scoped>
#charset {
  background: #212121;
  position: fixed;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  font-family: "Vazir", sans-serif;
}
/* 
#text {
  font: 8px sans-serif;
}

#tspan:last-child {
  font-size: 3px;
  fill-opacity: 0.8;
} */

.node rect {
  shape-rendering: crispEdges;
}

.node--hover rect {
  stroke: #000;
}
</style>
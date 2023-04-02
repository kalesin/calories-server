
"use strict";
const _ = require('lodash')
const fs = require('fs');

const data = JSON.parse(fs.readFileSync("data.json"));

let names = [];
for (let i = 0; i < data.length; i++) {
    names.push(data[i].NAME.split(/[^A-Za-z]/)[0])
}
let uniqueNames = [...new Set(names)]

let uniqueIDs = [];
for (let i = 0; i < uniqueNames.length; i++) {
    uniqueIDs.push(names.indexOf(uniqueNames[i]))
}

let uniqueIDslast = [];
for (let i = 0; i < uniqueNames.length; i++) {
    uniqueIDslast.push(names.lastIndexOf(uniqueNames[i]))
}
let groupedData = []
for (let i = 0; i < uniqueIDs.length; i++) {
    groupedData.push(data.slice(uniqueIDs[i], uniqueIDslast[i] + 1))
}

//better
let groupedData2 = _.groupBy(data, function (e) { return e.NAME.split(/[^A-Za-z]/)[0] })
/* console.log(groupedData2[names[4]]) */

let groupedByNamesSorted = [];
let sensitivityPerc = 0.8
let sensitivityAbs = 5
for (let i = 0; i < Object.keys(groupedData2).length; i++) {
    let groupedByName = groupedData2[uniqueNames[i]];
    if (groupedByName.length > 1) {
        let object = {
            name: uniqueNames[i], grouped: _.groupBy(groupedByName, function (e) {
                /* console.log(groupedByName[0].ID) */
                return 1 >= e.ENERGY / groupedByName[0].ENERGY >= sensitivityPerc && e.ID != groupedByName[0].ID &&
                    Math.abs(e.CARBOHYDRATES - groupedByName[0].CARBOHYDRATES) < sensitivityAbs &&
                    Math.abs(e.FAT - groupedByName[0].FAT) < sensitivityAbs &&
                    Math.abs(e.FIBER - groupedByName[0].FIBER) < sensitivityAbs &&
                    Math.abs(e.PROTEIN - groupedByName[0].PROTEIN) < sensitivityAbs
            })
        }
        groupedByNamesSorted.push(object)
        /* console.log('groupedByName',groupedByName)
        console.log('groupBy', _.groupBy(groupedByName, function (e) {
            return 0.9 < e.ENERGY/groupedByName[0].ENERGY < 1
        })) */
    }
}

for (let i = 25; i < 30; i++) {
    console.log('---------FALSE---------- \n', groupedByNamesSorted[i].grouped.false)
    console.log('--------TRUE----------- \n', groupedByNamesSorted[i].grouped.true)
}

let deleteIDs = [];
for (let i = 0; i < groupedByNamesSorted.length; i++) {
    if (groupedByNamesSorted[i].grouped.true) {
        for (let j = 0; j < groupedByNamesSorted[i].grouped.true.length; j++) {
            deleteIDs.push(groupedByNamesSorted[i].grouped.true[j].ID)
        }
    }
}
/* console.log(deleteIDs) */



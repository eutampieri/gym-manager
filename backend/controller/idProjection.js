const { Model } = require("mongoose");

const baseProjection = {
    _id: 0,
    id: { $toString: "$_id" },
};
/**
 * @param {Model} schema 
 */
function buildProjection(schema) {
    let p = JSON.parse(JSON.stringify(baseProjection));
    for (const f in schema.schema.obj) {
        p[f] = 1;
    }
    return p;
}

module.exports = buildProjection;

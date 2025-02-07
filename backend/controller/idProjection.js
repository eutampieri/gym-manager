import { Model } from "mongoose";

const baseProjection = {
    _id: 0,
    id: { $toString: "$_id" },
};
/**
 * @param {Model} schema 
 * @param {Set<string> | undefined} skipFields
 */
function buildProjection(schema, skipFields) {
    let skip = skipFields || new Set();
    let p = JSON.parse(JSON.stringify(baseProjection));
    for (const f in schema.schema.obj) {
        if (skip.has(f)) {
            continue;
        }
        p[f] = 1;
    }
    return p;
}

export default buildProjection;

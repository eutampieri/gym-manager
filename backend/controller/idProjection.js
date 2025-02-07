import { Model } from "mongoose";

/**
 * @param {Model} schema 
 * @param {Set<string> | undefined} skipFields
 */
function buildProjection(schema, skipFields) {
    let skip = skipFields || new Set();
    let p = {};
    for (const f in schema.schema.obj) {
        if (skip.has(f)) {
            p[f] = 0;
        }
        p[f] = 1;
    }
    return p;
}

export default buildProjection;

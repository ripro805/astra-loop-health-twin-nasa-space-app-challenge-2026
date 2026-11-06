"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.REFERENCE_STATS = exports.TREATMENT_TREES = exports.INDICATOR_DEFINITIONS = void 0;
__exportStar(require("./indicators.js"), exports);
__exportStar(require("./hazards.js"), exports);
__exportStar(require("./treatment-trees.js"), exports);
__exportStar(require("./reference-stats.js"), exports);
var indicators_js_1 = require("./indicators.js");
Object.defineProperty(exports, "INDICATOR_DEFINITIONS", { enumerable: true, get: function () { return indicators_js_1.INDICATOR_CATALOG; } });
var treatment_trees_js_1 = require("./treatment-trees.js");
Object.defineProperty(exports, "TREATMENT_TREES", { enumerable: true, get: function () { return treatment_trees_js_1.TREATMENT_DECISION_TREES; } });
var reference_stats_js_1 = require("./reference-stats.js");
Object.defineProperty(exports, "REFERENCE_STATS", { enumerable: true, get: function () { return reference_stats_js_1.SPACEFLIGHT_REFERENCE_STATS; } });

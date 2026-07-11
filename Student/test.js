const dom = require('jsdom');
const { JSDOM } = dom;
const html = `
<html>
<body>
<input type="text" id="comp-qty-1" value="1" readonly>
<span id="cart-badge">0</span>
</body>
</html>
`;
const domInst = new JSDOM(html);
global.document = domInst.window.document;

global.COMPONENTS_CATALOG = [{id:1, name:'A', maxPerRequest:3}];
global.componentCart = [];

const isComp = true;
const id = 1;
const delta = 1;

const catalog = isComp ? COMPONENTS_CATALOG : [];
const item = catalog.find(i => i.id === id);
const inputId = isComp ? `comp-qty-${id}` : `tool-qty-${id}`;
const input = document.getElementById(inputId);

let currentVal = parseInt(input.value) || 1;
let newVal = currentVal + delta;
if (newVal < 1) newVal = 1;
if (newVal > item.maxPerRequest) newVal = item.maxPerRequest;
input.value = newVal;

console.log("Input value is now:", input.value);

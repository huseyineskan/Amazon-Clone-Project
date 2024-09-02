import { formatCurrency } from "../scripts/utils/money.js";

console.group('Test Suite: formatCurrency');
console.log('Converts cents into dollars');

if (formatCurrency(2095) === '20.95') {
    console.log('%c passed', "color:green");
} else {
    console.error('%c failed'),"color:red";
}

console.log('Works with 0');

if (formatCurrency(0) === '0.00') {
    console.log('%c passed', "color:green");
} else {
    console.error('%c failed'),"color:red";
}

console.log('Rounds upp to the nearest cent');

if (formatCurrency(2000.5) === '20.01') {
    console.log('%c passed', "color:green");
} else {
    console.error('%c failed',"color:red")
}

console.log('Rounds down to the nearest cent');

if (formatCurrency(2000.4) === '20.00') {
    console.log('%c passed', "color:green");
} else {
    console.error('%c failed',"color:red")
}
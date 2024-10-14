// const a = {
//     value : 100
// }
// const b = a;
// b.value = 0;
// console.log(a.value)

const a = {
    name : 'a',
    type : 'a',
    price : 9
};
const b = { ...a,price: 0};
console.log(b.price)
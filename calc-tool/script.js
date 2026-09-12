const bills = [
    { name:"午餐", money:16, type:"餐饮" },
    { name:"公交", money:2, type:"交通" },
    { name:"零食", money:-8, type:"餐饮" },
    { name:"网购", money:120, type:"购物" },
    { name:"饮水", money:0, type:"日用" }
];
console.table(bills);
const cleanBill = list => list.filter(item => item.money > 0);

const calcTotal = list => {
    if(list.length === 0) return 0;
    return list.reduce((sum,item)=> sum + item.money,0).toFixed(2);
};

const getNameList = list => list.map(item => item.name);
const validList = cleanBill(bills);
console.log("清洗后账单：",validList);
console.log("全部消费名称：",getNameList(validList));
console.log("总花费：",calcTotal(validList));

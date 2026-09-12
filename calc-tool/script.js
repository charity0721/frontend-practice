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
const getReport = list =>{
    const data = cleanBill(list);
    if(data.length === 0){
        return "暂无有效消费记录";
    }
    return `有效消费${data.length}笔；消费项目：${getNameList(data).join('、')}；合计花费：${calcTotal(data)} 元`;
};
    const inputName = prompt("请输入消费名称");
    const inputMoney = Number(prompt("输入金额"));
    if(inputName && !isNaN(inputMoney)){
        bills.push({name:inputName,money:inputMoney,type:"自定义"});
    }
    console.log(getReport(bills));
}catch(err){
    console.error("记账出错：",err.message);
}


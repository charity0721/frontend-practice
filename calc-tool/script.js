//1、原始记账数据
const bills = [
   ];

//2‑1 数据清洗：金额大于0，剔除负数、0非法数据
const cleanBill = list => list.filter(item => item.money > 0);

//2‑2 计算总花费
const calcTotal = list => {
    if(list.length === 0) return 0;
    return list.reduce((sum,item)=> sum + item.money,0).toFixed(2);
};

//2‑3 获取消费项目名称数组 map
const getNameList = list => list.map(item => item.name);

//3、生成文字报告
const getReport = list =>{
    const data = cleanBill(list);
    if(data.length === 0){
        return "暂无有效消费记录";
    }
    return `有效消费${data.length}笔；消费项目：${getNameList(data).join('、')}；合计花费：${calcTotal(data)} 元`;
};

//执行输出
console.table(bills);
const validList = cleanBill(bills);
console.log("清洗后账单：",validList);
console.log("全部消费名称：",getNameList(validList));
console.log("总花费：",calcTotal(validList));
console.log(getReport(bills));

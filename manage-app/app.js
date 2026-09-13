const addForm = document.querySelector('#addForm');
const bookName = document.querySelector('#bookName');
const author = document.querySelector('#author');
const score = document.querySelector('#score');
const tip = document.querySelector('#tip');
const listWrap = document.querySelector('#listWrap');
const searchInput = document.querySelector('#searchInput');

//读取本地存储
let bookList = JSON.parse(localStorage.getItem('books') || '[]');

//保存函数
function saveData(){
    localStorage.setItem('books',JSON.stringify(bookList));
}

function render(){
    listWrap.innerHTML = '';
    //获取搜索关键词
    const keyword = searchInput.value.trim().toLowerCase();
    //筛选
    let showArr = bookList;
    if(keyword){
        showArr = bookList.filter(bk=>bk.name.toLowerCase().includes(keyword));
    }
    showArr.forEach((item,idx)=>{
        const div = document.createElement('div');
        div.className = "item";
        div.textContent = `书名：${item.name}｜作者：${item.author}｜评分：${item.score}分 `;
        const delBtn = document.createElement('button');
        delBtn.textContent="删除";
        delBtn.onclick = ()=>{
            bookList.splice(idx,1);
            saveData();
            render();
        }
        div.appendChild(delBtn);
        listWrap.appendChild(div);
    })
}

//新增
addForm.addEventListener('submit',e=>{
    e.preventDefault();
    tip.textContent = '';
    const nameVal = bookName.value.trim();
    const autVal = author.value.trim();
    const scoVal = Number(score.value);
    if(!nameVal || !autVal){
        tip.textContent = "书名、作者不能为空！";
        return;
    }
    bookList.push({
        name:nameVal,
        author:autVal,
        score:scoVal
    })
    saveData();
    bookName.value='';
    author.value='';
    score.value='';
    render();
})

//搜索监听
searchInput.oninput = render;

render();

const addForm = document.querySelector('#addForm');
const bookName = document.querySelector('#bookName');
const author = document.querySelector('#author');
const score = document.querySelector('#score');
const tip = document.querySelector('#tip');
const listWrap = document.querySelector('#listWrap');

let bookList = [];

function render(){
    listWrap.innerHTML = '';
    bookList.forEach((item,idx)=>{
        const div = document.createElement('div');
        div.className = "item";
        div.textContent = `书名：${item.name}｜作者：${item.author}｜评分：${item.score}分 `;
        //删除按钮
        const delBtn = document.createElement('button');
        delBtn.textContent="删除";
        delBtn.onclick = ()=>{
            bookList.splice(idx,1);
            render();
        }
        div.appendChild(delBtn);
        listWrap.appendChild(div);
    })
}

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
    bookName.value='';
    author.value='';
    score.value='';
    render();
})

render();

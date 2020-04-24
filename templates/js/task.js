const content1 = document.getElementById("#task1");
const content2 = document.getElementById("#task1");
const content3 = document.getElementById("#task1");
const content4 = document.getElementById("#task1");
const content5 = document.getElementById("#task1");

const seeTaskBtn=document.getElementById("#see_task");

seeTaskBtn.addEventListener('click',()=>{
    const country='us'
    content1.textContent='Loading...'
    content2.textContent='';
    fetch('/tasks/me').then((response)=>{
        response.json().then((data)=>{
            if(data.error){
                //paragraph 의 내용을 manipulate 가능
                content1.textContent=data.error
            }else{
                mess.textContent='My Task'
                mess1.textContent=data.news.title
                mess2.textContent=data.news.description;
                link1.textContent=data.news.url;
                link1.href = data.news.url;
                mess3.textContent=data.news2.title;
                mess4.textContent=data.news2.description
                link2.textContent=data.news2.url;
                link2.href = data.news.url;
               
            }
        })
    })
    })
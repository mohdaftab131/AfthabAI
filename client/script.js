 import bot from './assets/bot.svg';
 import user from './assets/user.svg';

 const form = document.querySelector('form');
 const chatContainer = document.querySelector('#chat_container');

 let loadInterval;
// load interval of AI
 function loader(element){   // this going to return the ..... 
  element.textContent = '';

  loadInterval  = setInterval(() =>{
    element.textContent += '.';

    if(element.textContent === '...'){
      element.textContent = '';
    }
  }, 300)
 }

// letter by letter fuction

function typeText(element, text){
  let index =0;
  let interval = setInterval(()=> {
    if(index <text.length){
      element.innerHTML += text.charAt(index);
      index++;
    }else{
      clearInterval(interval);
    }
  },20)
}
// genrating unique ID for very meassge
function generateUniqueId(){
  const timestamp =Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe (isAi, value,uniqueId){
  return (
    `
    <div class="wrapper ${isAi && 'ai'}">
    <div class="chat">
    <div class="profile">
    <img
    src="${isAi ? bot :user}"
    alt="${isAi ? 'bot' : 'user'}"/>
    </div>
    <div class="message" id=${uniqueId}>${value}</div>
    </div> 
    </div>
    `
  )
}
// trigger to get AI function
const handleSubmit = async (e) =>{
  e.preventDefault();

  const data = new FormData(form); //form in our html
   chatContainer.innerHTML += chatStripe(false,data.get('prompt')); // user's chatstripe

   form.reset();

   //bots chatstripe
   const uniqueId = generateUniqueId();
   chatContainer.innerHTML += chatStripe(true," ",uniqueId);

   chatContainer.scrollTop =chatContainer.scrollHeight;

   const meaasgeDiv = document.getElementById(uniqueId);
   
   loader(meaasgeDiv);

   // fetch data from server (Bt response)
   const response = await fetch('https://afthabai.onrender.com',{
    method : 'POST',
    headers :{
      'Content-Type': 'application/json'
    },
    body :JSON.stringify({
      prompt: data.get('prompt')
    })
   })

   clearInterval(loadInterval);
   meaasgeDiv.innerHTML ='';

   if(response.ok){
    const data = await response.json();
    const parsedData = data.bot.trim();

    typeText(meaasgeDiv,parsedData);
   }
   else{
    const err = await response.text();

    meaasgeDiv.innerHTML = "Somthing Went wrong broo!!! Listen to Afthab";

    alert(err);
   }
}

form.addEventListener('submit',handleSubmit);
form.addEventListener('keyup', (e) =>{
  if(e.keyCode === 13){
    handleSubmit(e);
  }
})
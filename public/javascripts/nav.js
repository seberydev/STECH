const navcontent1 = document.querySelector('#nav_content1');
const navcontent2 = document.querySelector('#nav_content2');
const navcontent3 = document.querySelector('#nav_content3');
const navmodal1 = document.querySelector('#nav_modal1');
const navmodal2 = document.querySelector('#nav_modal2');
const navmodal3 = document.querySelector('#nav_modal3');

navcontent1.addEventListener('mousemove', () =>{
navmodal1.classList.remove('hidden');
navmodal2.classList.add('hidden');
navmodal3.classList.add('hidden');
});
navcontent2.addEventListener('mousemove', () =>{
navmodal2.classList.remove('hidden');
navmodal1.classList.add('hidden');
navmodal3.classList.add('hidden');
});
navcontent3.addEventListener('mousemove', () =>{
navmodal3.classList.remove('hidden');
navmodal1.classList.add('hidden');
navmodal2.classList.add('hidden');
});



// Nav elements

const nav_element1 = document.querySelector('#nav_element1');
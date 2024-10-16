var tabSwitchAnimationDuration = 0.25;
// Modal
document.querySelectorAll('#show').forEach(function(el) {
  el.addEventListener('click', function() {
    var target = document.querySelector(el.getAttribute('data-target'));
    
    target.classList.add('is-active');
    
    target.querySelector('.modal-background').addEventListener('click',   function() {
        target.classList.remove('is-active');
     });

    target.querySelector('.modal-close').addEventListener('click',   function() {
        target.classList.remove('is-active');
     });
  });
});

// Tab
const colNum = 3;
var imageArr = [...document.querySelectorAll("#show")];


document.querySelectorAll(".art-subtitle").forEach(function(navEl) {
  navEl.onclick = function() { toggleTab(this.id, this.dataset.target); }
});

function applyImageTabFilter(id){
  gsap.to('#show', {duration: tabSwitchAnimationDuration, opacity:0});
  console.log(id);
  var filteredArr = imageArr.filter(el => el.dataset.target.includes(id));
  for (let i = 0; i < filteredArr.length; i++){
    var columnEl = document.getElementById(`col-${i % colNum}`);
    if(i < colNum){
      columnEl.innerHTML = '';
    }
    var childEl = filteredArr[i].getElementsByTagName('img')[0];
    childEl.classList.remove('project-img-1');
    childEl.classList.remove('project-img-2');
    if (i>filteredArr.length-3 && Math.floor(i/3)%2 === 0 ){
      childEl.classList.add('project-img-2');
    }else{
      if(i%2 === 0){
        childEl.classList.add('project-img-1');
      }else{
        childEl.classList.add('project-img-2');
      }
    }
    columnEl.appendChild(filteredArr[i])
  }
  gsap.to('#show', {duration: tabSwitchAnimationDuration, opacity:1, delay:tabSwitchAnimationDuration});

}

applyImageTabFilter('')


function toggleTab(selectedNav, targetId) {
  var navEls = document.querySelectorAll(".art-subtitle");

  navEls.forEach(function(navEl) {
    if (navEl.id == selectedNav) {
      navEl.classList.add("is-active");
      applyImageTabFilter(navEl.id);

    } else {
      if (navEl.classList.contains("is-active")) {
        navEl.classList.remove("is-active");
      }
    }
  });


  // var tabs = document.querySelectorAll(".tab-pane");

  // tabs.forEach(function(tab) {
  //   if (tab.id == targetId) {
  //     tab.style.display = "block";
  //   } else {
  //     tab.style.display = "none";
  //   }
  // });
}

// var imageArr = [...document.querySelectorAll("#show")];
// var id = "as"

// imageArr.forEach(function(el) {
//   var id = "as"
//   var a = imageArr.filter(el => el.dataset.target.includes(id));
//   console.log(a);
// });


// console.log(imageArr.filter(el => el.dataset.target.includes(id)))







import"./assets/modulepreload-polyfill-B5Qt9EMX.js";/* empty css                      */import{i}from"./assets/vendor-I1I71QQ2.js";const o=document.querySelector(".form");o.addEventListener("submit",l);function l(t){t.preventDefault();const s=parseInt(t.target.delay.value),r=t.target.state.value,m=new Promise((e,a)=>{setTimeout(()=>{r==="fulfilled"?e(s):a(s)},s)});o.reset(),m.then(e=>{i.success({title:"✅ Fulfilled",message:`promise in ${e}ms`,position:"topRight"})}).catch(e=>{i.error({title:"❌ Rejected",message:`promise in ${e}ms`,position:"topRight"})})}
//# sourceMappingURL=2-snackbar.js.map

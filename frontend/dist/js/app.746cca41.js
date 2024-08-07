(function(){"use strict";var e={3330:function(e,t,n){var a=n(3751),o=n(641);const s={id:"app"};function r(e,t,n,a,r,l){const i=(0,o.g2)("router-view");return(0,o.uX)(),(0,o.CE)("div",s,[(0,o.Lk)("main",null,[(0,o.bF)(i)])])}var l={name:"App"},i=n(6262);const c=(0,i.A)(l,[["render",r]]);var u=c,d=n(5220);const v=e=>((0,o.Qi)("data-v-b4668f50"),e=e(),(0,o.jt)(),e),p={class:"home-view"},h={class:"header"},m=v((()=>(0,o.Lk)("h1",null,"家庭日程",-1))),g={class:"layout"},f={class:"sidebar"},y={class:"main-content"};function k(e,t,n,a,s,r){const l=(0,o.g2)("CurrentDateTime"),i=(0,o.g2)("MonthlyCalendar"),c=(0,o.g2)("FamilyTabs"),u=(0,o.g2)("ScheduleView");return(0,o.uX)(),(0,o.CE)("div",p,[(0,o.Lk)("div",h,[m,(0,o.bF)(l)]),(0,o.Lk)("div",g,[(0,o.Lk)("div",f,[(0,o.bF)(i,{events:a.events,onDateSelected:a.handleDateSelected,onSearch:a.handleSearch},null,8,["events","onDateSelected","onSearch"]),(0,o.bF)(c)]),(0,o.Lk)("div",y,[(0,o.bF)(u,{events:a.filteredEvents},null,8,["events"])])])])}n(4114);var w=n(953),b=n(4335),C=n(33);const S={class:"family-tabs"},E=["onClick"],D=["src","alt"],L={class:"member-info"},I={class:"member-name"},M={class:"achievement-icons"},_={class:"stars"};function T(e,t,n,a,s,r){return(0,o.uX)(),(0,o.CE)("div",S,[((0,o.uX)(!0),(0,o.CE)(o.FK,null,(0,o.pI)(a.familyMembers,(e=>((0,o.uX)(),(0,o.CE)("div",{key:e.id,class:(0,C.C4)(["member-tab",{active:e.id===a.activeMember}]),onClick:t=>a.selectMember(e.id)},[(0,o.Lk)("img",{src:e.avatar,alt:e.name,class:"member-avatar"},null,8,D),(0,o.Lk)("div",L,[(0,o.Lk)("span",I,(0,C.v_)(e.name),1),(0,o.Lk)("div",M,[((0,o.uX)(!0),(0,o.CE)(o.FK,null,(0,o.pI)(e.achievements,((e,t)=>((0,o.uX)(),(0,o.CE)("span",{key:t,class:(0,C.C4)(t)},(0,C.v_)(a.getAchievementIcon(t)),3)))),128)),(0,o.Lk)("span",_,(0,C.v_)("⭐".repeat(e.stars)),1)])])],10,E)))),128)),(0,o.Lk)("button",{class:"add-event-btn",onClick:t[0]||(t[0]=(...e)=>a.addEvent&&a.addEvent(...e))},"+ 添加日程")])}var A={name:"FamilyTabs",setup(){const e=(0,w.KR)([{id:"dad",name:"爸爸",avatar:"/avatars/dad.png",stars:3,achievements:{moon:2,sun:1,crown:0}},{id:"mom",name:"妈妈",avatar:"/avatars/mom.png",stars:4,achievements:{moon:3,sun:1,crown:0}},{id:"son",name:"弟弟",avatar:"/avatars/son.png",stars:1,achievements:{moon:0,sun:0,crown:0}},{id:"daughter",name:"姐姐",avatar:"/avatars/daughter.png",stars:2,achievements:{moon:1,sun:0,crown:0}},{id:"grandma",name:"阿姨",avatar:"/avatars/grandma.png",stars:0,achievements:{moon:0,sun:0,crown:0}}]),t=(0,w.KR)(null);let n=null;function a(e){t.value=e,n&&clearTimeout(n),n=setTimeout((()=>{t.value=null}),3e4)}function s(){console.log("添加新事件")}function r(e){switch(e){case"moon":return"🌙";case"sun":return"☀️";case"crown":return"👑";default:return""}}return(0,o.sV)((()=>{})),(0,o.hi)((()=>{n&&clearTimeout(n)})),{familyMembers:e,activeMember:t,selectMember:a,addEvent:s,getAchievementIcon:r}},emits:["update:selectedMember"]};const X=(0,i.A)(A,[["render",T],["__scopeId","data-v-712fe435"]]);var F=X;const K={class:"schedule-view"},W={class:"hour-label"},O={class:"events-content"},j={class:"event-description"};var R={__name:"ScheduleView",props:{events:{type:Array,required:!0}},setup(e){const t=e,n=(0,w.KR)(null),a=(0,w.KR)(null),s=(0,w.KR)(new Date),r=Array.from({length:17},((e,t)=>t+6)),l=e=>`${e.toString().padStart(2,"0")}:00`,i=e=>{const t=new Date(e.startDate),n=new Date(e.endDate);return`${t.getHours().toString().padStart(2,"0")}:${t.getMinutes().toString().padStart(2,"0")} - ${n.getHours().toString().padStart(2,"0")}:${n.getMinutes().toString().padStart(2,"0")}`},c=(0,o.EW)((()=>{const e=[...t.events].sort(((e,t)=>new Date(e.startDate)-new Date(t.startDate))),n=[];let a=[];for(const t of e)if(0===a.length)a.push(t);else{const e=a[a.length-1];new Date(t.startDate)<new Date(e.endDate)?a.push(t):(n.push(a),a=[t])}return a.length>0&&n.push(a),n})),u=(e,t,n)=>{const a=new Date(e.startDate),o=new Date(e.endDate),s=60*(a.getHours()-6)+a.getMinutes(),r=(o-a)/6e4,l=100/n+"%",i=t/n*100+"%";return{top:`${s}px`,height:`${r}px`,width:l,left:i}},d=e=>{const t={"爸爸":"role-dad","妈妈":"role-mom","哥哥":"role-brother","姐姐":"role-sister","弟弟":"role-little-brother","妹妹":"role-little-sister","阿姨":"role-aunt"};return t[e]||"role-default"},v=(0,o.EW)((()=>{const e=60*(s.value.getHours()-6)+s.value.getMinutes();return{top:`${e}px`}})),p=()=>{s.value=new Date};let h;function m(e){n.value&&(n.value.scrollTop=e.target.scrollTop)}return(0,o.sV)((()=>{a.value&&a.value.addEventListener("scroll",m),h=setInterval(p,6e4)})),(0,o.hi)((()=>{a.value&&a.value.removeEventListener("scroll",m),clearInterval(h)})),(e,t)=>((0,o.uX)(),(0,o.CE)("div",K,[(0,o.Lk)("div",{class:"time-column",ref_key:"timeColumn",ref:n},[((0,o.uX)(!0),(0,o.CE)(o.FK,null,(0,o.pI)((0,w.R1)(r),(e=>((0,o.uX)(),(0,o.CE)("div",{key:e,class:"time-slot"},[(0,o.Lk)("span",W,(0,C.v_)(l(e)),1),((0,o.uX)(),(0,o.CE)(o.FK,null,(0,o.pI)([0,15,30,45],(e=>(0,o.Lk)("div",{key:e,class:"minute-mark"}))),64))])))),128))],512),(0,o.Lk)("div",{class:"events-column",ref_key:"eventsColumn",ref:a,onScroll:m},[(0,o.Lk)("div",O,[((0,o.uX)(!0),(0,o.CE)(o.FK,null,(0,o.pI)((0,w.R1)(r),(e=>((0,o.uX)(),(0,o.CE)("div",{key:e,class:"hour-slot"},[((0,o.uX)(),(0,o.CE)(o.FK,null,(0,o.pI)([0,15,30,45],(e=>(0,o.Lk)("div",{key:e,class:"minute-slot"}))),64))])))),128)),((0,o.uX)(!0),(0,o.CE)(o.FK,null,(0,o.pI)(c.value,((e,t)=>((0,o.uX)(),(0,o.CE)("div",{key:t,class:"event-group"},[((0,o.uX)(!0),(0,o.CE)(o.FK,null,(0,o.pI)(e,((t,n)=>((0,o.uX)(),(0,o.CE)("div",{key:t.startDate+t.title,class:(0,C.C4)(["event",d(t.role)]),style:(0,C.Tr)(u(t,n,e.length))},[(0,o.Lk)("h3",null,(0,C.v_)(t.title),1),(0,o.Lk)("p",null,(0,C.v_)(i(t)),1),(0,o.Lk)("p",j,(0,C.v_)(t.description),1)],6)))),128))])))),128)),(0,o.Lk)("div",{class:"current-time-line",style:(0,C.Tr)(v.value)},null,4)])],544)]))}};const $=(0,i.A)(R,[["__scopeId","data-v-f80e599c"]]);var x=$;const N={class:"current-date-time"};var P={__name:"CurrentDateTime",setup(e){const t=(0,w.KR)("");function n(){const e=new Date,n=e.toLocaleDateString("zh-CN",{year:"numeric",month:"long",day:"numeric"}),a=e.toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit"});t.value=`${n} ${a}`}let a;return(0,o.sV)((()=>{n(),a=setInterval(n,6e4)})),(0,o.hi)((()=>{clearInterval(a)})),(e,n)=>((0,o.uX)(),(0,o.CE)("div",N,(0,C.v_)(t.value),1))}};const V=(0,i.A)(P,[["__scopeId","data-v-80a1425c"]]);var Y=V;const z={class:"monthly-calendar"},U={class:"calendar-header"},q={class:"calendar-grid"},H=["onClick"],J={key:0,class:"event-indicator"};function Q(e,t,n,a,s,r){return(0,o.uX)(),(0,o.CE)("div",z,[(0,o.Lk)("div",U,[(0,o.Lk)("button",{onClick:t[0]||(t[0]=(...e)=>a.previousMonth&&a.previousMonth(...e))},"<"),(0,o.Lk)("span",null,(0,C.v_)(a.currentMonthYear),1),(0,o.Lk)("button",{onClick:t[1]||(t[1]=(...e)=>a.nextMonth&&a.nextMonth(...e))},">")]),(0,o.Lk)("div",q,[((0,o.uX)(!0),(0,o.CE)(o.FK,null,(0,o.pI)(a.weekdays,(e=>((0,o.uX)(),(0,o.CE)("div",{key:e,class:"weekday"},(0,C.v_)(e),1)))),128)),((0,o.uX)(!0),(0,o.CE)(o.FK,null,(0,o.pI)(a.calendarDays,(e=>((0,o.uX)(),(0,o.CE)("div",{key:e.date,class:(0,C.C4)(["calendar-day",{"current-month":e.isCurrentMonth,today:e.isToday,"has-events":e.hasEvents}]),onClick:t=>a.selectDate(e)},[(0,o.eW)((0,C.v_)(e.date)+" ",1),e.hasEvents?((0,o.uX)(),(0,o.CE)("div",J)):(0,o.Q3)("",!0)],10,H)))),128))])])}var B={name:"MonthlyCalendar",props:{events:{type:Array,default:()=>[]}},setup(e,{emit:t}){const n=(0,w.KR)(new Date),a=["日","一","二","三","四","五","六"],s=(0,o.EW)((()=>n.value.toLocaleString("zh-CN",{year:"numeric",month:"long"}))),r=(0,o.EW)((()=>{const t=n.value.getFullYear(),a=n.value.getMonth(),o=new Date(t,a,1),s=new Date(t,a+1,0),r=s.getDate(),l=o.getDay(),i=[],c=new Date;for(let e=l-1;e>=0;e--){const n=new Date(t,a,-e);i.push({date:n.getDate(),isCurrentMonth:!1,isToday:!1,hasEvents:!1})}for(let e=1;e<=r;e++){const n=new Date(t,a,e);i.push({date:e,isCurrentMonth:!0,isToday:n.toDateString()===c.toDateString(),hasEvents:!1})}const u=42-i.length;for(let e=1;e<=u;e++)i.push({date:e,isCurrentMonth:!1,isToday:!1,hasEvents:!1});return i.forEach((n=>{n.hasEvents=e.events.some((e=>{const o=new Date(e.date);return o.getDate()===n.date&&o.getMonth()===a&&o.getFullYear()===t}))})),i}));function l(){n.value=new Date(n.value.getFullYear(),n.value.getMonth()-1,1)}function i(){n.value=new Date(n.value.getFullYear(),n.value.getMonth()+1,1)}function c(e){if(e.isCurrentMonth){const a=new Date(n.value.getFullYear(),n.value.getMonth(),e.date);t("date-selected",a)}}return{currentMonthYear:s,weekdays:a,calendarDays:r,previousMonth:l,nextMonth:i,selectDate:c}}};const G=(0,i.A)(B,[["render",Q],["__scopeId","data-v-56816420"]]);var Z=G,ee={name:"HomeView",components:{FamilyTabs:F,ScheduleView:x,CurrentDateTime:Y,MonthlyCalendar:Z},setup(){const e=(0,w.KR)([]),t=(0,w.KR)(null),n=(0,w.KR)("");let a,s=!1;const r=(0,o.EW)((()=>e.value.filter((e=>{const a=!t.value||new Date(e.date).toDateString()===t.value.toDateString(),o=!n.value||e.title.toLowerCase().includes(n.value.toLowerCase());return a&&o}))));function l(e){t.value=e}function i(e){n.value=e}const c=()=>{const t="wss://family.aibigboom.com/ws";console.log("尝试连接到 WebSocket:",t),a=new WebSocket(t),a.onopen=()=>{console.log("WebSocket 连接已建立"),s=!1},a.onmessage=t=>{console.log("收到 WebSocket 消息:",t.data);try{const n=JSON.parse(t.data);"initial"===n.type?e.value=n.events:"newEvent"===n.type&&e.value.push(n.event)}catch(n){console.error("处理 WebSocket 消息时出错:",n)}},a.onerror=e=>{console.error("WebSocket 错误:",e),s||(console.log("切换到轮询模式"),u())},a.onclose=e=>{console.log(`WebSocket 连接关闭。代码: ${e.code}, 原因: ${e.reason}`),s||(console.log("5秒后尝试重新连接..."),setTimeout(c,5e3))}},u=async()=>{if(s)return;s=!0;const t=async()=>{try{const t=await b.A.get("/api/events");e.value=t.data,console.log("通过轮询获取到事件:",e.value)}catch(n){console.error("轮询错误:",n)}s&&setTimeout(t,5e3)};t()};return(0,o.sV)((()=>{c()})),(0,o.hi)((()=>{a&&a.close(),s=!1})),{events:e,filteredEvents:r,handleDateSelected:l,handleSearch:i}}};const te=(0,i.A)(ee,[["render",k],["__scopeId","data-v-b4668f50"]]);var ne=te;const ae=e=>((0,o.Qi)("data-v-2789af02"),e=e(),(0,o.jt)(),e),oe={class:"schedule-input-view"},se=ae((()=>(0,o.Lk)("h2",null,"日程安排输入",-1))),re=["disabled"],le={key:0,class:"response-area"},ie=ae((()=>(0,o.Lk)("h3",null,"响应：",-1)));function ce(e,t,n,s,r,l){return(0,o.uX)(),(0,o.CE)("div",oe,[se,(0,o.bo)((0,o.Lk)("textarea",{"onUpdate:modelValue":t[0]||(t[0]=e=>r.scheduleInput=e),placeholder:"输入您的日程安排...",rows:"4"},null,512),[[a.Jo,r.scheduleInput]]),(0,o.Lk)("button",{onClick:t[1]||(t[1]=(...e)=>l.submitSchedule&&l.submitSchedule(...e)),disabled:r.isSubmitting},(0,C.v_)(r.isSubmitting?"提交中...":"提交日程"),9,re),r.response?((0,o.uX)(),(0,o.CE)("div",le,[ie,(0,o.Lk)("pre",null,(0,C.v_)(r.response),1)])):(0,o.Q3)("",!0)])}var ue={name:"ScheduleInputView",data(){return{scheduleInput:"",apiKey:"app-zyuogN6iPjys8j4R7fTj8M2z",apiUrl:"https://api.dify.ai/v1/workflows/run",userId:"your-user-id",response:null,isSubmitting:!1}},methods:{async submitSchedule(){if(!this.isSubmitting){this.isSubmitting=!0;try{console.log("正在发送请求..."),console.log("API URL:",this.apiUrl),console.log("API Key (前5个字符):",this.apiKey.substring(0,5));const e={inputs:{input:this.scheduleInput},response_mode:"blocking",user:this.userId};console.log("请求体:",JSON.stringify(e));const t=await(0,b.A)({method:"post",url:this.apiUrl,data:e,headers:{"Content-Type":"application/json",Authorization:`Bearer ${this.apiKey.trim()}`}});console.log("响应:",t.data),t.data&&t.data.data&&t.data.data.outputs&&t.data.data.outputs.text?this.response=t.data.data.outputs.text:(this.response="未找到有效的输出",console.log("API 响应中没有找到预期的输出结构"))}catch(e){console.error("提交日程时出错:",e.message),e.response?(console.error("错误数据:",e.response.data),console.error("错误状态:",e.response.status),console.error("错误头部:",e.response.headers),this.response="错误: "+JSON.stringify(e.response.data,null,2)):e.request?(console.error("未收到响应:",e.request),this.response="错误: 未收到服务器响应"):this.response="错误: "+e.message}finally{this.isSubmitting=!1}}}}};const de=(0,i.A)(ue,[["render",ce],["__scopeId","data-v-2789af02"]]);var ve=de;const pe=[{path:"/",name:"home",component:ne},{path:"/schedule-input",name:"scheduleInput",component:ve}],he=(0,d.aE)({history:(0,d.LA)("/"),routes:pe});var me=he,ge=n(3723);(0,ge.k)("/service-worker.js",{ready(){console.log("App is being served from cache by a service worker.\nFor more details, visit https://goo.gl/AFskqB")},registered(e){console.log("Service worker has been registered."),setInterval((()=>{e.update()}),36e5)},cached(){console.log("Content has been cached for offline use.")},updatefound(){console.log("New content is downloading.")},updated(e){console.log("New content is available; please refresh.");const t=e.waiting;window.confirm("新版本可用。是否刷新页面？")&&(t.postMessage({type:"SKIP_WAITING"}),window.location.reload())},offline(){console.log("No internet connection found. App is running in offline mode.")},error(e){console.error("Error during service worker registration:",e)}}),b.A.defaults.baseURL="https://family.aibigboom.com";const fe=(0,a.Ef)(u);fe.use(me);const ye=()=>{"wakeLock"in navigator?navigator.wakeLock.request("screen").then((()=>{console.log("Screen will stay awake")})).catch((e=>{console.error(`${e.name}, ${e.message}`)})):console.warn("Wake Lock API not supported")};if("serviceWorker"in navigator){navigator.serviceWorker.ready.then((e=>{e.addEventListener("updatefound",(()=>{const t=e.installing;t.addEventListener("statechange",(()=>{if("installed"===t.state&&navigator.serviceWorker.controller){const e=window.confirm("新版本可用。是否立即更新？");e&&(t.postMessage({type:"SKIP_WAITING"}),window.location.reload())}}))}))}));let e=!1;navigator.serviceWorker.addEventListener("controllerchange",(()=>{e||(window.location.reload(),e=!0)}))}fe.mount("#app"),ye()}},t={};function n(a){var o=t[a];if(void 0!==o)return o.exports;var s=t[a]={exports:{}};return e[a].call(s.exports,s,s.exports,n),s.exports}n.m=e,function(){var e=[];n.O=function(t,a,o,s){if(!a){var r=1/0;for(u=0;u<e.length;u++){a=e[u][0],o=e[u][1],s=e[u][2];for(var l=!0,i=0;i<a.length;i++)(!1&s||r>=s)&&Object.keys(n.O).every((function(e){return n.O[e](a[i])}))?a.splice(i--,1):(l=!1,s<r&&(r=s));if(l){e.splice(u--,1);var c=o();void 0!==c&&(t=c)}}return t}s=s||0;for(var u=e.length;u>0&&e[u-1][2]>s;u--)e[u]=e[u-1];e[u]=[a,o,s]}}(),function(){n.d=function(e,t){for(var a in t)n.o(t,a)&&!n.o(e,a)&&Object.defineProperty(e,a,{enumerable:!0,get:t[a]})}}(),function(){n.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){n.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){var e={524:0};n.O.j=function(t){return 0===e[t]};var t=function(t,a){var o,s,r=a[0],l=a[1],i=a[2],c=0;if(r.some((function(t){return 0!==e[t]}))){for(o in l)n.o(l,o)&&(n.m[o]=l[o]);if(i)var u=i(n)}for(t&&t(a);c<r.length;c++)s=r[c],n.o(e,s)&&e[s]&&e[s][0](),e[s]=0;return n.O(u)},a=self["webpackChunkfrontend"]=self["webpackChunkfrontend"]||[];a.forEach(t.bind(null,0)),a.push=t.bind(null,a.push.bind(a))}();var a=n.O(void 0,[504],(function(){return n(3330)}));a=n.O(a)})();
//# sourceMappingURL=app.746cca41.js.map
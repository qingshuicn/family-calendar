(function(){"use strict";var e={447:function(){try{self["workbox:precaching:7.0.0"]&&_()}catch(e){}},365:function(){try{self["workbox:core:7.0.0"]&&_()}catch(e){}},227:function(){try{self["workbox:routing:7.0.0"]&&_()}catch(e){}},225:function(){try{self["workbox:core:7.0.0"]&&_()}catch(e){}},390:function(){try{self["workbox:strategies:7.0.0"]&&_()}catch(e){}},448:function(){try{self["workbox:core:7.0.0"]&&_()}catch(e){}}},t={};function s(n){var a=t[n];if(void 0!==a)return a.exports;var r=t[n]={exports:{}};return e[n](r,r.exports,s),r.exports}s(365);const n=(e,...t)=>{let s=e;return t.length>0&&(s+=` :: ${JSON.stringify(t)}`),s},a=n;class r extends Error{constructor(e,t){const s=a(e,t);super(s),this.name=e,this.details=t}}const i={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!==typeof registration?registration.scope:""},c=e=>[i.prefix,e,i.suffix].filter((e=>e&&e.length>0)).join("-"),o=e=>{for(const t of Object.keys(i))e(t)},h={updateDetails:e=>{o((t=>{"string"===typeof e[t]&&(i[t]=e[t])}))},getGoogleAnalyticsName:e=>e||c(i.googleAnalytics),getPrecacheName:e=>e||c(i.precache),getPrefix:()=>i.prefix,getRuntimeName:e=>e||c(i.runtime),getSuffix:()=>i.suffix};function l(e,t){const s=t();return e.waitUntil(s),s}s(447);const u="__WB_REVISION__";function f(e){if(!e)throw new r("add-to-cache-list-unexpected-type",{entry:e});if("string"===typeof e){const t=new URL(e,location.href);return{cacheKey:t.href,url:t.href}}const{revision:t,url:s}=e;if(!s)throw new r("add-to-cache-list-unexpected-type",{entry:e});if(!t){const e=new URL(s,location.href);return{cacheKey:e.href,url:e.href}}const n=new URL(s,location.href),a=new URL(s,location.href);return n.searchParams.set(u,t),{cacheKey:n.href,url:a.href}}class d{constructor(){this.updatedURLs=[],this.notUpdatedURLs=[],this.handlerWillStart=async({request:e,state:t})=>{t&&(t.originalRequest=e)},this.cachedResponseWillBeUsed=async({event:e,state:t,cachedResponse:s})=>{if("install"===e.type&&t&&t.originalRequest&&t.originalRequest instanceof Request){const e=t.originalRequest.url;s?this.notUpdatedURLs.push(e):this.updatedURLs.push(e)}return s}}}class p{constructor({precacheController:e}){this.cacheKeyWillBeUsed=async({request:e,params:t})=>{const s=(null===t||void 0===t?void 0:t.cacheKey)||this._precacheController.getCacheKeyForURL(e.url);return s?new Request(s,{headers:e.headers}):e},this._precacheController=e}}let g;function y(){if(void 0===g){const t=new Response("");if("body"in t)try{new Response(t.body),g=!0}catch(e){g=!1}g=!1}return g}async function w(e,t){let s=null;if(e.url){const t=new URL(e.url);s=t.origin}if(s!==self.location.origin)throw new r("cross-origin-copy-response",{origin:s});const n=e.clone(),a={headers:new Headers(n.headers),status:n.status,statusText:n.statusText},i=t?t(a):a,c=y()?n.body:await n.blob();return new Response(c,i)}s(448);const m={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!==typeof registration?registration.scope:""},R=e=>[m.prefix,e,m.suffix].filter((e=>e&&e.length>0)).join("-"),v=e=>{for(const t of Object.keys(m))e(t)},C={updateDetails:e=>{v((t=>{"string"===typeof e[t]&&(m[t]=e[t])}))},getGoogleAnalyticsName:e=>e||R(m.googleAnalytics),getPrecacheName:e=>e||R(m.precache),getPrefix:()=>m.prefix,getRuntimeName:e=>e||R(m.runtime),getSuffix:()=>m.suffix},b=(e,...t)=>{let s=e;return t.length>0&&(s+=` :: ${JSON.stringify(t)}`),s},U=b;class q extends Error{constructor(e,t){const s=U(e,t);super(s),this.name=e,this.details=t}}const k=e=>{const t=new URL(String(e),location.href);return t.href.replace(new RegExp(`^${location.origin}`),"")};function x(e,t){const s=new URL(e);for(const n of t)s.searchParams.delete(n);return s.href}async function L(e,t,s,n){const a=x(t.url,s);if(t.url===a)return e.match(t,n);const r=Object.assign(Object.assign({},n),{ignoreSearch:!0}),i=await e.keys(t,r);for(const c of i){const t=x(c.url,s);if(a===t)return e.match(c,n)}}class N{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}const T=new Set;async function P(){for(const e of T)await e()}function K(e){return new Promise((t=>setTimeout(t,e)))}s(390);function E(e){return"string"===typeof e?new Request(e):e}class O{constructor(e,t){this._cacheKeys={},Object.assign(this,t),this.event=t.event,this._strategy=e,this._handlerDeferred=new N,this._extendLifetimePromises=[],this._plugins=[...e.plugins],this._pluginStateMap=new Map;for(const s of this._plugins)this._pluginStateMap.set(s,{});this.event.waitUntil(this._handlerDeferred.promise)}async fetch(e){const{event:t}=this;let s=E(e);if("navigate"===s.mode&&t instanceof FetchEvent&&t.preloadResponse){const e=await t.preloadResponse;if(e)return e}const n=this.hasCallback("fetchDidFail")?s.clone():null;try{for(const e of this.iterateCallbacks("requestWillFetch"))s=await e({request:s.clone(),event:t})}catch(r){if(r instanceof Error)throw new q("plugin-error-request-will-fetch",{thrownErrorMessage:r.message})}const a=s.clone();try{let e;e=await fetch(s,"navigate"===s.mode?void 0:this._strategy.fetchOptions);for(const s of this.iterateCallbacks("fetchDidSucceed"))e=await s({event:t,request:a,response:e});return e}catch(i){throw n&&await this.runCallbacks("fetchDidFail",{error:i,event:t,originalRequest:n.clone(),request:a.clone()}),i}}async fetchAndCachePut(e){const t=await this.fetch(e),s=t.clone();return this.waitUntil(this.cachePut(e,s)),t}async cacheMatch(e){const t=E(e);let s;const{cacheName:n,matchOptions:a}=this._strategy,r=await this.getCacheKey(t,"read"),i=Object.assign(Object.assign({},a),{cacheName:n});s=await caches.match(r,i);for(const c of this.iterateCallbacks("cachedResponseWillBeUsed"))s=await c({cacheName:n,matchOptions:a,cachedResponse:s,request:r,event:this.event})||void 0;return s}async cachePut(e,t){const s=E(e);await K(0);const n=await this.getCacheKey(s,"write");if(!t)throw new q("cache-put-with-no-response",{url:k(n.url)});const a=await this._ensureResponseSafeToCache(t);if(!a)return!1;const{cacheName:r,matchOptions:i}=this._strategy,c=await self.caches.open(r),o=this.hasCallback("cacheDidUpdate"),h=o?await L(c,n.clone(),["__WB_REVISION__"],i):null;try{await c.put(n,o?a.clone():a)}catch(l){if(l instanceof Error)throw"QuotaExceededError"===l.name&&await P(),l}for(const u of this.iterateCallbacks("cacheDidUpdate"))await u({cacheName:r,oldResponse:h,newResponse:a.clone(),request:n,event:this.event});return!0}async getCacheKey(e,t){const s=`${e.url} | ${t}`;if(!this._cacheKeys[s]){let n=e;for(const e of this.iterateCallbacks("cacheKeyWillBeUsed"))n=E(await e({mode:t,request:n,event:this.event,params:this.params}));this._cacheKeys[s]=n}return this._cacheKeys[s]}hasCallback(e){for(const t of this._strategy.plugins)if(e in t)return!0;return!1}async runCallbacks(e,t){for(const s of this.iterateCallbacks(e))await s(t)}*iterateCallbacks(e){for(const t of this._strategy.plugins)if("function"===typeof t[e]){const s=this._pluginStateMap.get(t),n=n=>{const a=Object.assign(Object.assign({},n),{state:s});return t[e](a)};yield n}}waitUntil(e){return this._extendLifetimePromises.push(e),e}async doneWaiting(){let e;while(e=this._extendLifetimePromises.shift())await e}destroy(){this._handlerDeferred.resolve(null)}async _ensureResponseSafeToCache(e){let t=e,s=!1;for(const n of this.iterateCallbacks("cacheWillUpdate"))if(t=await n({request:this.request,response:t,event:this.event})||void 0,s=!0,!t)break;return s||t&&200!==t.status&&(t=void 0),t}}class M{constructor(e={}){this.cacheName=C.getRuntimeName(e.cacheName),this.plugins=e.plugins||[],this.fetchOptions=e.fetchOptions,this.matchOptions=e.matchOptions}handle(e){const[t]=this.handleAll(e);return t}handleAll(e){e instanceof FetchEvent&&(e={event:e,request:e.request});const t=e.event,s="string"===typeof e.request?new Request(e.request):e.request,n="params"in e?e.params:void 0,a=new O(this,{event:t,request:s,params:n}),r=this._getResponse(a,s,t),i=this._awaitComplete(r,a,s,t);return[r,i]}async _getResponse(e,t,s){let n;await e.runCallbacks("handlerWillStart",{event:s,request:t});try{if(n=await this._handle(t,e),!n||"error"===n.type)throw new q("no-response",{url:t.url})}catch(a){if(a instanceof Error)for(const r of e.iterateCallbacks("handlerDidError"))if(n=await r({error:a,event:s,request:t}),n)break;if(!n)throw a}for(const r of e.iterateCallbacks("handlerWillRespond"))n=await r({event:s,request:t,response:n});return n}async _awaitComplete(e,t,s,n){let a,r;try{a=await e}catch(r){}try{await t.runCallbacks("handlerDidRespond",{event:n,request:s,response:a}),await t.doneWaiting()}catch(i){i instanceof Error&&(r=i)}if(await t.runCallbacks("handlerDidComplete",{event:n,request:s,response:a,error:r}),t.destroy(),r)throw r}}class S extends M{constructor(e={}){e.cacheName=h.getPrecacheName(e.cacheName),super(e),this._fallbackToNetwork=!1!==e.fallbackToNetwork,this.plugins.push(S.copyRedirectedCacheableResponsesPlugin)}async _handle(e,t){const s=await t.cacheMatch(e);return s||(t.event&&"install"===t.event.type?await this._handleInstall(e,t):await this._handleFetch(e,t))}async _handleFetch(e,t){let s;const n=t.params||{};if(!this._fallbackToNetwork)throw new r("missing-precache-entry",{cacheName:this.cacheName,url:e.url});{0;const a=n.integrity,r=e.integrity,i=!r||r===a;if(s=await t.fetch(new Request(e,{integrity:"no-cors"!==e.mode?r||a:void 0})),a&&i&&"no-cors"!==e.mode){this._useDefaultCacheabilityPluginIfNeeded();await t.cachePut(e,s.clone());0}}return s}async _handleInstall(e,t){this._useDefaultCacheabilityPluginIfNeeded();const s=await t.fetch(e),n=await t.cachePut(e,s.clone());if(!n)throw new r("bad-precaching-response",{url:e.url,status:s.status});return s}_useDefaultCacheabilityPluginIfNeeded(){let e=null,t=0;for(const[s,n]of this.plugins.entries())n!==S.copyRedirectedCacheableResponsesPlugin&&(n===S.defaultPrecacheCacheabilityPlugin&&(e=s),n.cacheWillUpdate&&t++);0===t?this.plugins.push(S.defaultPrecacheCacheabilityPlugin):t>1&&null!==e&&this.plugins.splice(e,1)}}S.defaultPrecacheCacheabilityPlugin={async cacheWillUpdate({response:e}){return!e||e.status>=400?null:e}},S.copyRedirectedCacheableResponsesPlugin={async cacheWillUpdate({response:e}){return e.redirected?await w(e):e}};class W{constructor({cacheName:e,plugins:t=[],fallbackToNetwork:s=!0}={}){this._urlsToCacheKeys=new Map,this._urlsToCacheModes=new Map,this._cacheKeysToIntegrities=new Map,this._strategy=new S({cacheName:h.getPrecacheName(e),plugins:[...t,new p({precacheController:this})],fallbackToNetwork:s}),this.install=this.install.bind(this),this.activate=this.activate.bind(this)}get strategy(){return this._strategy}precache(e){this.addToCacheList(e),this._installAndActiveListenersAdded||(self.addEventListener("install",this.install),self.addEventListener("activate",this.activate),this._installAndActiveListenersAdded=!0)}addToCacheList(e){const t=[];for(const s of e){"string"===typeof s?t.push(s):s&&void 0===s.revision&&t.push(s.url);const{cacheKey:e,url:n}=f(s),a="string"!==typeof s&&s.revision?"reload":"default";if(this._urlsToCacheKeys.has(n)&&this._urlsToCacheKeys.get(n)!==e)throw new r("add-to-cache-list-conflicting-entries",{firstEntry:this._urlsToCacheKeys.get(n),secondEntry:e});if("string"!==typeof s&&s.integrity){if(this._cacheKeysToIntegrities.has(e)&&this._cacheKeysToIntegrities.get(e)!==s.integrity)throw new r("add-to-cache-list-conflicting-integrities",{url:n});this._cacheKeysToIntegrities.set(e,s.integrity)}if(this._urlsToCacheKeys.set(n,e),this._urlsToCacheModes.set(n,a),t.length>0){const e=`Workbox is precaching URLs without revision info: ${t.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(e)}}}install(e){return l(e,(async()=>{const t=new d;this.strategy.plugins.push(t);for(const[a,r]of this._urlsToCacheKeys){const t=this._cacheKeysToIntegrities.get(r),s=this._urlsToCacheModes.get(a),n=new Request(a,{integrity:t,cache:s,credentials:"same-origin"});await Promise.all(this.strategy.handleAll({params:{cacheKey:r},request:n,event:e}))}const{updatedURLs:s,notUpdatedURLs:n}=t;return{updatedURLs:s,notUpdatedURLs:n}}))}activate(e){return l(e,(async()=>{const e=await self.caches.open(this.strategy.cacheName),t=await e.keys(),s=new Set(this._urlsToCacheKeys.values()),n=[];for(const a of t)s.has(a.url)||(await e.delete(a),n.push(a.url));return{deletedURLs:n}}))}getURLsToCacheKeys(){return this._urlsToCacheKeys}getCachedURLs(){return[...this._urlsToCacheKeys.keys()]}getCacheKeyForURL(e){const t=new URL(e,location.href);return this._urlsToCacheKeys.get(t.href)}getIntegrityForCacheKey(e){return this._cacheKeysToIntegrities.get(e)}async matchPrecache(e){const t=e instanceof Request?e.url:e,s=this.getCacheKeyForURL(t);if(s){const e=await self.caches.open(this.strategy.cacheName);return e.match(s)}}createHandlerBoundToURL(e){const t=this.getCacheKeyForURL(e);if(!t)throw new r("non-precached-url",{url:e});return s=>(s.request=new Request(e),s.params=Object.assign({cacheKey:t},s.params),this.strategy.handle(s))}}let A;const I=()=>(A||(A=new W),A);s(225);const j=(e,...t)=>{let s=e;return t.length>0&&(s+=` :: ${JSON.stringify(t)}`),s},D=j;class F extends Error{constructor(e,t){const s=D(e,t);super(s),this.name=e,this.details=t}}s(227);const H="GET",B=e=>e&&"object"===typeof e?e:{handle:e};class ${constructor(e,t,s=H){this.handler=B(t),this.match=e,this.method=s}setCatchHandler(e){this.catchHandler=B(e)}}class G extends ${constructor(e,t,s){const n=({url:t})=>{const s=e.exec(t.href);if(s&&(t.origin===location.origin||0===s.index))return s.slice(1)};super(n,t,s)}}class J{constructor(){this._routes=new Map,this._defaultHandlerMap=new Map}get routes(){return this._routes}addFetchListener(){self.addEventListener("fetch",(e=>{const{request:t}=e,s=this.handleRequest({request:t,event:e});s&&e.respondWith(s)}))}addCacheListener(){self.addEventListener("message",(e=>{if(e.data&&"CACHE_URLS"===e.data.type){const{payload:t}=e.data;0;const s=Promise.all(t.urlsToCache.map((t=>{"string"===typeof t&&(t=[t]);const s=new Request(...t);return this.handleRequest({request:s,event:e})})));e.waitUntil(s),e.ports&&e.ports[0]&&s.then((()=>e.ports[0].postMessage(!0)))}}))}handleRequest({request:e,event:t}){const s=new URL(e.url,location.href);if(!s.protocol.startsWith("http"))return void 0;const n=s.origin===location.origin,{params:a,route:r}=this.findMatchingRoute({event:t,request:e,sameOrigin:n,url:s});let i=r&&r.handler;const c=e.method;if(!i&&this._defaultHandlerMap.has(c)&&(i=this._defaultHandlerMap.get(c)),!i)return void 0;let o;try{o=i.handle({url:s,request:e,event:t,params:a})}catch(l){o=Promise.reject(l)}const h=r&&r.catchHandler;return o instanceof Promise&&(this._catchHandler||h)&&(o=o.catch((async n=>{if(h){0;try{return await h.handle({url:s,request:e,event:t,params:a})}catch(r){r instanceof Error&&(n=r)}}if(this._catchHandler)return this._catchHandler.handle({url:s,request:e,event:t});throw n}))),o}findMatchingRoute({url:e,sameOrigin:t,request:s,event:n}){const a=this._routes.get(s.method)||[];for(const r of a){let a;const i=r.match({url:e,sameOrigin:t,request:s,event:n});if(i)return a=i,(Array.isArray(a)&&0===a.length||i.constructor===Object&&0===Object.keys(i).length||"boolean"===typeof i)&&(a=void 0),{route:r,params:a}}return{}}setDefaultHandler(e,t=H){this._defaultHandlerMap.set(t,B(e))}setCatchHandler(e){this._catchHandler=B(e)}registerRoute(e){this._routes.has(e.method)||this._routes.set(e.method,[]),this._routes.get(e.method).push(e)}unregisterRoute(e){if(!this._routes.has(e.method))throw new F("unregister-route-but-not-found-with-method",{method:e.method});const t=this._routes.get(e.method).indexOf(e);if(!(t>-1))throw new F("unregister-route-route-not-registered");this._routes.get(e.method).splice(t,1)}}let V;const Q=()=>(V||(V=new J,V.addFetchListener(),V.addCacheListener()),V);function z(e,t,s){let n;if("string"===typeof e){const a=new URL(e,location.href);0;const r=({url:e})=>e.href===a.href;n=new $(r,t,s)}else if(e instanceof RegExp)n=new G(e,t,s);else if("function"===typeof e)n=new $(e,t,s);else{if(!(e instanceof $))throw new F("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});n=e}const a=Q();return a.registerRoute(n),n}function X(e,t=[]){for(const s of[...e.searchParams.keys()])t.some((e=>e.test(s)))&&e.searchParams.delete(s);return e}function*Y(e,{ignoreURLParametersMatching:t=[/^utm_/,/^fbclid$/],directoryIndex:s="index.html",cleanURLs:n=!0,urlManipulation:a}={}){const r=new URL(e,location.href);r.hash="",yield r.href;const i=X(r,t);if(yield i.href,s&&i.pathname.endsWith("/")){const e=new URL(i.href);e.pathname+=s,yield e.href}if(n){const e=new URL(i.href);e.pathname+=".html",yield e.href}if(a){const e=a({url:r});for(const t of e)yield t.href}}class Z extends ${constructor(e,t){const s=({request:s})=>{const n=e.getURLsToCacheKeys();for(const a of Y(s.url,t)){const t=n.get(a);if(t){const s=e.getIntegrityForCacheKey(t);return{cacheKey:t,integrity:s}}}};super(s,e.strategy)}}function ee(e){const t=I(),s=new Z(t,e);z(s)}function te(e){const t=I();t.precache(e)}function se(e,t){te(e),ee(t)}const ne={cacheWillUpdate:async({response:e})=>200===e.status||0===e.status?e:null};class ae extends M{constructor(e={}){super(e),this.plugins.some((e=>"cacheWillUpdate"in e))||this.plugins.unshift(ne),this._networkTimeoutSeconds=e.networkTimeoutSeconds||0}async _handle(e,t){const s=[];const n=[];let a;if(this._networkTimeoutSeconds){const{id:r,promise:i}=this._getTimeoutPromise({request:e,logs:s,handler:t});a=r,n.push(i)}const r=this._getNetworkPromise({timeoutId:a,request:e,logs:s,handler:t});n.push(r);const i=await t.waitUntil((async()=>await t.waitUntil(Promise.race(n))||await r)());if(!i)throw new q("no-response",{url:e.url});return i}_getTimeoutPromise({request:e,logs:t,handler:s}){let n;const a=new Promise((t=>{const a=async()=>{t(await s.cacheMatch(e))};n=setTimeout(a,1e3*this._networkTimeoutSeconds)}));return{promise:a,id:n}}async _getNetworkPromise({timeoutId:e,request:t,logs:s,handler:n}){let a,r;try{r=await n.fetchAndCachePut(t)}catch(i){i instanceof Error&&(a=i)}return e&&clearTimeout(e),!a&&r||(r=await n.cacheMatch(t)),r}}class re extends M{constructor(e={}){super(e),this.plugins.some((e=>"cacheWillUpdate"in e))||this.plugins.unshift(ne)}async _handle(e,t){const s=t.fetchAndCachePut(e).catch((()=>{}));t.waitUntil(s);let n,a=await t.cacheMatch(e);if(a)0;else{0;try{a=await s}catch(r){r instanceof Error&&(n=r)}}if(!a)throw new q("no-response",{url:e.url,error:n});return a}}async function ie(){}se([{'revision':null,'url':'/css/app.7d7a872b.css'},{'revision':'c143985a3074f340361e69b8e450a4bc','url':'/index.html'},{'revision':null,'url':'/js/app.0f2b4730.js'},{'revision':null,'url':'/js/chunk-vendors.ac89096d.js'},{'revision':'7b8aa09f301bc12c8e356034bd0e616f','url':'/manifest.json'},{'revision':'b6216d61c03e6ce0c9aea6ca7808f7ca','url':'/robots.txt'}]),z((({url:e})=>e.pathname.startsWith("/api/")),new ae({cacheName:"api-cache"})),z((({request:e})=>"style"===e.destination||"script"===e.destination||"image"===e.destination),new re({cacheName:"static-resources"})),self.addEventListener("sync",(e=>{"sync-new-events"===e.tag&&e.waitUntil(ie())})),self.addEventListener("push",(e=>{if(e.data){const t=e.data.json();e.waitUntil(self.registration.showNotification(t.title,{body:t.body,icon:"/img/icons/android-chrome-192x192.png"}))}})),self.addEventListener("install",(e=>{console.log("Service Worker installed")})),self.addEventListener("activate",(e=>{console.log("Service Worker activated")}))})();
//# sourceMappingURL=service-worker.js.map
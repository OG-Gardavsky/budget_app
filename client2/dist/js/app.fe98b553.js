(function(e){function t(t){for(var r,s,c=t[0],i=t[1],u=t[2],d=0,f=[];d<c.length;d++)s=c[d],Object.prototype.hasOwnProperty.call(a,s)&&a[s]&&f.push(a[s][0]),a[s]=0;for(r in i)Object.prototype.hasOwnProperty.call(i,r)&&(e[r]=i[r]);l&&l(t);while(f.length)f.shift()();return o.push.apply(o,u||[]),n()}function n(){for(var e,t=0;t<o.length;t++){for(var n=o[t],r=!0,c=1;c<n.length;c++){var i=n[c];0!==a[i]&&(r=!1)}r&&(o.splice(t--,1),e=s(s.s=n[0]))}return e}var r={},a={app:0},o=[];function s(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.m=e,s.c=r,s.d=function(e,t,n){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},s.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)s.d(n,r,function(t){return e[t]}.bind(null,r));return n},s.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="/";var c=window["webpackJsonp"]=window["webpackJsonp"]||[],i=c.push.bind(c);c.push=t,c=c.slice();for(var u=0;u<c.length;u++)t(c[u]);var l=i;o.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"21bb":function(e,t,n){"use strict";n("2dad")},"2dad":function(e,t,n){},"56d7":function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var r=n("2b0e"),a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("router-view")],1)},o=[],s=(n("5c0b"),n("2877")),c={},i=Object(s["a"])(c,a,o,!1,null,null,null),u=i.exports,l=n("8c4f"),d=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"mainContent"}},[n("h1",[e._v("Log in, please.")]),n("LoginPage",{on:{"on-login":e.onLogin}})],1)},f=[],p=n("1da1"),m=(n("96cf"),n("d3b7"),function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("section",[n("md-field",[n("label",[e._v("Enter your email")]),n("md-input",{attrs:{type:"email",placeholder:"Email"},model:{value:e.email,callback:function(t){e.email=t},expression:"email"}})],1),n("md-field",[n("label",[e._v("Enter you password")]),n("md-input",{attrs:{type:"password",placeholder:"Password"},model:{value:e.password,callback:function(t){e.password=t},expression:"password"}})],1),n("md-button",{staticClass:"md-raised md-primary",on:{click:e.onLogin}},[e._v("Log in")])],1)}),h=[],g=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("button",{on:{click:e.onClick}},[e._v(e._s(e.textOfButton))])},v=[],w={name:"customButton",props:{textOfButton:String},methods:{onClick:function(){this.$emit("on-click")}}},b=w,x=(n("dd03"),Object(s["a"])(b,g,v,!1,null,"2f3ce2fc",null)),k=x.exports,_={name:"LoginPage",components:{CustomButton:k},data:function(){return{email:"",password:""}},methods:{onLogin:function(e){if(e.preventDefault(),""===this.email||""===this.password)return alert("fill email and password");var t={email:this.email,password:this.password};this.$emit("on-login",t)}}},y=_,O=(n("57de"),Object(s["a"])(y,m,h,!1,null,"2ce6a204",null)),j=O.exports,T={name:"Login",components:{LoginPage:j},data:function(){return{userInfo:{}}},methods:{onLogin:function(e){return Object(p["a"])(regeneratorRuntime.mark((function t(){var n,r;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,fetch("api/users/login",{method:"POST",headers:{"Content-type":"application/json"},body:JSON.stringify(e)});case 2:if(n=t.sent,200!==n.status){t.next=12;break}return t.next=6,n.json();case 6:return r=t.sent,localStorage.setItem("userToken",r.token),t.next=10,Q.push("home");case 10:t.next=13;break;case 12:alert("unable to login");case 13:case"end":return t.stop()}}),t)})))()},getUserInfo:function(){var e=this;return Object(p["a"])(regeneratorRuntime.mark((function t(){var n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,fetch("api/users",{method:"GET",headers:{Authorization:"Bearer "+localStorage.getItem("userToken")}});case 2:return n=t.sent,t.next=5,n.json();case 5:e.userInfo=t.sent;case 6:case"end":return t.stop()}}),t)})))()}},created:function(){var e=this;return Object(p["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(!localStorage.getItem("userToken")){t.next=6;break}return t.next=3,e.getUserInfo();case 3:if(e.userInfo.hasOwnProperty("error")){t.next=6;break}return t.next=6,Q.push("home");case 6:case"end":return t.stop()}}),t)})))()}},I=T,S=Object(s["a"])(I,d,f,!1,null,null,null),A=S.exports,R=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("div",{staticClass:"home"},[n("Header"),e.displayH2?n("h2",[e._v("Welcome to budget app, "+e._s(e.userInfo.name))]):e._e()],1),n("div",{attrs:{id:"accounts"}},e._l(e.accountsBalance,(function(t){return n("span",{key:t.accountId,on:{click:function(n){return e.showTransactionsOfSpecificAccount(t)}}},[n("p",[e._v(e._s(t.accountName))]),n("p",[e._v(e._s(t.balance)+" "+e._s(t.currency))])])})),0),n("md-button",{staticClass:"md-raised md-primary",on:{click:e.refresh}},[e._v("Refresh")]),n("md-button",{staticClass:"md-raised md-primary",on:{click:e.showAddTranscaction}},[e._v("Add transaction")]),n("modal-window",{attrs:{"show-dialog":e.showDialog},on:{"on-closeModal":e.closeAddTransaction}}),n("div",{attrs:{id:"transactions"}},e._l(e.transactions,(function(t){return n("div",{key:t._id},[n("p",[e._v(" "+e._s(t.name)+" - "+e._s(t.type)+" : "+e._s(t.amount)+" "+e._s(t.currency))])])})),0)],1)},B=[],C=(n("25f0"),function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("h1",[e._v("Budget app")]),n("md-button",{staticClass:"md-primary md-raised",on:{click:e.logOut}},[e._v("log out")])],1)}),E=[],P={name:"Header",components:{CustomButton:k},methods:{logOut:function(){return Object(p["a"])(regeneratorRuntime.mark((function e(){var t,n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(t=window.confirm("Are you sure you want to log out?"),t){e.next=3;break}return e.abrupt("return");case 3:return e.next=5,fetch("api/users/logout",{method:"POST",headers:{Authorization:"Bearer "+localStorage.getItem("userToken")}});case 5:n=e.sent,200!==n.status&&401!==n.status||(localStorage.removeItem("userToken"),Q.push("/"));case 7:case"end":return e.stop()}}),e)})))()}}},D=P,L=(n("992a"),Object(s["a"])(D,C,E,!1,null,"a92da1b6",null)),$=L.exports,M=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("md-dialog",{attrs:{"md-active":e.showDialog},on:{"update:mdActive":function(t){e.showDialog=t},"update:md-active":function(t){e.showDialog=t}}},[n("md-dialog-title",[e._v("Add transaction")]),n("md-field",[n("label",[e._v("Enter name of transaction")]),n("md-input",{attrs:{type:"",placeholder:"Name"},model:{value:e.password,callback:function(t){e.password=t},expression:"password"}})],1),n("md-field",[n("label",[e._v("Enter name of transaction")]),n("md-input",{attrs:{type:"",placeholder:"AMount"},model:{value:e.password,callback:function(t){e.password=t},expression:"password"}})],1),n("md-dialog-actions",[n("md-button",{staticClass:"md-primary",on:{click:e.closeDialog}},[e._v("Close")]),n("md-button",{staticClass:"md-primary",on:{click:function(e){}}},[e._v("Save")])],1)],1)],1)},H=[],z={name:"ModalWindow",props:{showDialog:Boolean},methods:{closeDialog:function(){this.$emit("on-closeModal")}}},G=z,U=Object(s["a"])(G,M,H,!1,null,"0aac7131",null),F=U.exports,J={name:"Home",components:{ModalWindow:F,CustomButton:k,Header:$},data:function(){return{accountsBalance:[],transactions:[],userInfo:{},displayH2:!0,showDialog:!1}},methods:{showAddTranscaction:function(){this.showDialog=!0},closeAddTransaction:function(){this.showDialog=!1},showTransactionsOfSpecificAccount:function(e){var t=this;return Object(p["a"])(regeneratorRuntime.mark((function n(){var r;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,fetch("api/accounts/id:"+e.accountId.toString()+"/transactions",{method:"GET",headers:{Authorization:"Bearer "+localStorage.getItem("userToken")}});case 2:return r=n.sent,t.transactions=[],n.next=6,r.json();case 6:t.transactions=n.sent;case 7:case"end":return n.stop()}}),n)})))()},refresh:function(){var e=this;return Object(p["a"])(regeneratorRuntime.mark((function t(){var n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e.displayH2=!1,t.next=3,e.checkCredentials();case 3:if(n=t.sent,0===n){t.next=6;break}return t.abrupt("return");case 6:e.displayFinancialInfo();case 7:case"end":return t.stop()}}),t)})))()},displayFinancialInfo:function(){this.showTransactionsOfAllAccounts(),this.showBalanceOfAccounts()},showBalanceOfAccounts:function(){var e=this;return Object(p["a"])(regeneratorRuntime.mark((function t(){var n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,fetch("api/accounts/balance",{method:"GET",headers:{Authorization:"Bearer "+localStorage.getItem("userToken")}});case 2:return n=t.sent,t.next=5,n.json();case 5:e.accountsBalance=t.sent;case 6:case"end":return t.stop()}}),t)})))()},showTransactionsOfAllAccounts:function(){var e=this;return Object(p["a"])(regeneratorRuntime.mark((function t(){var n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,fetch("api/transactions",{method:"GET",headers:{Authorization:"Bearer "+localStorage.getItem("userToken")}});case 2:return n=t.sent,t.next=5,n.json();case 5:e.transactions=t.sent;case 6:case"end":return t.stop()}}),t)})))()},getUserInfo:function(){var e=this;return Object(p["a"])(regeneratorRuntime.mark((function t(){var n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,fetch("api/users",{method:"GET",headers:{Authorization:"Bearer "+localStorage.getItem("userToken")}});case 2:return n=t.sent,t.next=5,n.json();case 5:e.userInfo=t.sent;case 6:case"end":return t.stop()}}),t)})))()},checkCredentials:function(){var e=this;return Object(p["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(null!==localStorage.getItem("userToken")){t.next=3;break}return alert("You are not authenticated, please logged in"),t.abrupt("return",Q.push("/"));case 3:return t.next=5,e.getUserInfo();case 5:if(!e.userInfo.hasOwnProperty("error")){t.next=9;break}return localStorage.removeItem("userToken"),alert("You are not authenticated, please logged in"),t.abrupt("return",Q.push("/"));case 9:return t.abrupt("return",0);case 10:case"end":return t.stop()}}),t)})))()}},created:function(){this.checkCredentials(),this.displayFinancialInfo()}},N=J,W=(n("21bb"),Object(s["a"])(N,R,B,!1,null,null,null)),Y=W.exports;r["default"].use(l["a"]);var q=[{path:"/",name:"Login",component:A},{path:"/home",name:"home",component:Y}],K=new l["a"]({routes:q}),Q=K,V=n("43f9"),X=n.n(V);n("51de"),n("e094");r["default"].use(X.a),r["default"].config.productionTip=!1,new r["default"]({router:Q,render:function(e){return e(u)}}).$mount("#app")},"57de":function(e,t,n){"use strict";n("ec26")},"5c0b":function(e,t,n){"use strict";n("9c0c")},"98ab":function(e,t,n){},"992a":function(e,t,n){"use strict";n("98ab")},"9c0c":function(e,t,n){},ccf2:function(e,t,n){},dd03:function(e,t,n){"use strict";n("ccf2")},ec26:function(e,t,n){}});
//# sourceMappingURL=app.fe98b553.js.map
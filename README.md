# Firebase

*  <a href="#installation">Installation</a>
*  <a href="#config">Config</a>
*  <a href="#firestore">firestore</a>
    *  <a href="#get">get</a>
    *  <a href="#set">set</a>
    *  <a href="#add">add</a>
*  <a href="#auth">auth</a>


## Installation
```npm install --save-dev firebase```

web(引入你需要用到的部分)  
```
<script src="node_modules/firebase/firebase-app.js"></script>
<script src="node_modules/firebase/firebase-auth.js"></script>
<script src="node_modules/firebase/firebase-firestore.js"></script>
```

## Config
**firebaseConfig**  
專案設定(左上齒輪) => 您的應用程式 => 新增應用程式
```
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};
```

## firestore

### get


### set


### add
# Firebase

*  <a href="#installation">Installation</a>
*  <a href="#config">Config</a>
*  <a href="#firestore">firestore</a>
    *  <a href="#get">get</a>
    *  <a href="#set">set</a>
    *  <a href="#add">add</a>
*  <a href="#auth">auth</a>
*  <a href="#firesotre-initmy-function">iresotre-init(my function)</a>


## Installation
```npm install --save-dev firebase```

web(引入你需要用到的部分)  
```
<script src="node_modules/firebase/firebase-app.js"></script>
<script src="node_modules/firebase/firebase-auth.js"></script>
<script src="node_modules/firebase/firebase-firestore.js"></script>
```

js  
```
const firebase = require('firebase/app');
require('firebase/firestore');
require('firebase/auth');

const firebaseConfig = {};

const firestore = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export { firebase, db };
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


## auth


## firesotre-init(my function)

### clearCollection(db, coll)
清光指定Collection的全部資料
```
function clearCollection(db, coll) {
    console.log('clearCollection', coll);
    db.collection(coll).get().then((shotsnap) => {
        shotsnap.forEach((doc) => {
            index++;
            db.collection(coll).doc(doc.id).delete();
        });
    });
}
```

### setNewData(db, coll, data)
新增一筆或多筆資料進Collection(coll = collection name)  
```
function setNewData(db, coll, data) {
    console.log('setNewData', coll, data.length);
    if(Array.isArray(data)) {
        data.forEach(function(d) {
            db.collection(coll).doc().set(d);
        })
    } else {
        db.collection(coll).doc().set(data);
    }
}
```
### initCollection(db, coll, data)
初始化這個collection(先清空，再放入)，會用到setNewData(db, coll, data)
```
// 刪除Collection全部資料後再放進去
function initCollection(db, coll, data) {
    console.log('initCollection', coll, data.length);
    let index = 0;
    db.collection(coll).get()
    .then((shotsnap) => {
        if(shotsnap.docs.length == 0) {
            console.log('沒資料 直接Set進去');
            setNewData(db, coll, data);
        } else {
            console.log('先清光資料，再Set進去(最後一筆時代表index == docs.length')
            shotsnap.forEach((doc) => {
                index++;
                db.collection(coll).doc(doc.id).delete();
                if(index == shotsnap.docs.length)
                    setNewData(db, coll, data);
            });
        }
    })
    .catch(function(error) { console.log("initCollection Error:", error) });
}
```
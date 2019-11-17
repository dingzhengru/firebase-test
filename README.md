# Firebase

*  <a href="#installation">Installation</a>
*  <a href="#config">Config</a>
*  <a href="#firestore">firestore</a>
    *  <a href="#get">get</a>
    *  <a href="#set">set</a>
    *  <a href="#add">add</a>
*  <a href="#auth">auth</a>
    *  <a href="#onAuthStateChanged">onAuthStateChanged</a>
    *  <a href="#createUserWithEmailAndPassword">createUserWithEmailAndPassword</a>
    *  <a href="#signInWithEmailAndPassword">signInWithEmailAndPassword</a>
    *  <a href="#signInWithEmailAndPassword">signOut</a>
    *  <a href="#signInWithEmailAndPassword">sendEmailVerification</a>

    *  <a href="#user.updateProfile">user.updateProfile</a>


*  <a href="#my-function">my function</a>
*  <a href="#備份">備份</a>

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
**shotsnap.docs.length**: 這collections資料筆數  
**doc.id**: 這筆資料的id  
**doc.data()**: 這筆資料的value  
```
db.collection('coll')
.get()
.then((snapshot) => {
    snapshot.forEach((doc) => {
        console.log(doc.id, doc.data());        
    });
});
```

### set

*  有的話就修改該doc，若沒有那個id，則會直接新增一筆資料，並把這筆資料設為此id
*  修改會根據你給的欄位修改，沒指定到的不會更動，指定到沒有的會新增進去
```db.collection("coll").doc('doc_id').set(data)```  

### add
*  會直接用產生自動ID的方式新增資料
```db.collection("coll").add(data)```

## auth

### firebase.auth().onAuthStateChanged
*  設置一個watcher，當auth有改變時就會進入
*  參數是目前的user，若目前沒有user登入，則會是null
```
firebase.auth().onAuthStateChanged((user) => {
    if (user) {

    }
});
```

### createUserWithEmailAndPassword
### signInWithEmailAndPassword
### signOut
### sendEmailVerification

## my function

### clearCollection(db, coll)
清光指定Collection的全部資料
```
function clearCollection(db, coll) {
    console.log('clearCollection', coll);
    db.collection(coll).get().then((shotsnap) => {
        shotsnap.forEach((doc) => {
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


## 備份
*  官方只提供使用Google Cloud的方法:https://firebase.google.com/docs/firestore/manage-data/export-import)
*  其他備份資料的方法: https://github.com/steadyequipment/node-firestore-backup

**先到專案設定 => 服務帳戶 => 產生新的私密金鑰 (會載一個json檔案下來)**  

以下是 firestore-backup
```
npm install -g firestore-backup

firestore-backup -a path/to/credentials/file.json -b /backups/myDatabase

-a, --accountCredentials <path> - 剛剛的json檔路徑
-B, --backupPath <path>- 備份到哪的路徑

// 其他選項 
-P --prettyPrint 會將備份的json排版
-S, --databaseStartPath <path> - The database collection or document path to begin backup.
-L, --requestCountLimit <number> - The maximum number of requests to be made in parallel.
-E, --excludeCollections <id> - Top level collection id(s) to exclude from backing up.
```
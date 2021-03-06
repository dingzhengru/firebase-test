# Firebase
*  <a href="#installation">Installation</a>
*  <a href="#config">Config</a>
*  <a href="#data-type">data type</a>
*  <a href="#firestore">firestore</a>
    *  <a href="#get">get</a>
    *  <a href="#set">set</a>
    *  <a href="#add">add</a>
    *  <a href="#where">where</a>
    *  <a href="#orderby">orderBy</a>
    *  <a href="#limit">limit</a>
    *  <a href="#startat-endat">startAt, endAt</a>
*  <a href="#auth">auth</a>
    *  <a href="#onAuthStateChanged">onAuthStateChanged</a>
    *  <a href="#actionCodeSettings">actionCodeSettings</a>
    *  <a href="#createUserWithEmailAndPassword">createUserWithEmailAndPassword</a>
    *  <a href="#signInWithEmailAndPassword">signInWithEmailAndPassword</a>
    *  <a href="#signInWithEmailAndPassword">signOut</a>
    *  <a href="#signInWithEmailAndPassword">sendEmailVerification</a>
    *  <a href="#userupdateprofile">user.updateprofile</a>
*  <a href="#my-function">my function</a>
*  <a href="#備份">備份</a>
*  <a href="#firebase-in-vuex">firebase in vuex</a>
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

firebase.initializeApp(firebaseConfig);
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

## data type
*  string
*  boolean
*  number
*  date: 使用date資料 data.toDate(), date.toMillis(), date.fromDate(), date.fromMillis()
*  array
*  object
*  geopoint: 經緯度{x: , y:}
*  reference: 類似關聯式中的外鍵，但還是得用get()來取得資料，且存取時需附上uid
*  null

**關於date，可以用dayjs: dayjs(date.toMillis()).format('YYYY/MM/DD hh:mm:ss')**  

```
// example
const docData = {
    string: "Hello world!",
    boolean: true,
    number: 3.14159265,
    date: firebase.firestore.Timestamp.fromDate(new Date("December 10, 1815")),
    dataNow: firebase.firestore.Timestamp.fromDate(new Date()),
    array: [5, true, "hello"],
    map: {},
    geopoint: {x: 123, y: 456},
    reference: '/users/gwNmt83L2JCUEpeR9VLs'
    null: null,
};
雖然firebase可以直接存取 new Date() 但建議還是用firebase.firestore.Timestamp.fromDate(new Date())  
因為使用上不同，代表你需要重新取得資料後才能調用方法(toMillis())  
```
**reference**  
```
// 存取範例 直接給 doc (其實不是很好用，直接存給變數會有問題)
let data = {
    userRef: db.doc('users/' + firebase.auth().currentUser.uid)
};

// 讀取範例 ref.get()，並用exists確認是否存在  
db.collection(coll).get().then((shotsnap) => {
    shotsnap.forEach((doc) => {
        let userRef = doc.data().userRef;

        userRef.get().then((d) => {
            console.log(d.exists);
            console.log(d.data());
        })
    })
})
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
*  doc() 直接擺空的話，就會是新增一筆資料，uid會自動生成  
```db.collection("coll").doc().set(data)```

### add
*  會直接用產生自動ID的方式新增資料
```db.collection("coll").add(data)```

## where
**利用條件篩選**  
*  使用範圍篩選時(>,<,<=,>=)，第一個orderBy必須跟前者為同一個欄位
```
// basic
db.collection("users")
  .where("name", "==", "Jhon")
  .get()

// good
citiesRef.where("population", ">", 100000).orderBy("population")

//bad
citiesRef.where("population", ">", 100000).orderBy("country")
```
## orderBy
**指定欄位排序**  
*  第二參數決定升降序(兩種值: 'asc', 'desc')
```
db.collection("users")
  .orderBy("name", "desc")
  .get()
```
## limit
**設定讀取數量**  
```
db.collection("users")
  .orderBy("name", "desc")
  .limit(2)
  .get()
```
## startAt, endAt
**根據排序欄位的值做篩選(其實where就能做到，且更詳細，但這個相對具有可讀性)**
*  這兩種是屬於包含的類型(>=, <=)
```
// population >= 1000
citiesRef.orderBy("population").startAt(1000)

// population <= 1000
citiesRef.orderBy("population").endAt(1000)
```

## auth

### onAuthStateChanged
*  設置一個watcher，當auth有改變時就會進入
*  參數是目前的user，若目前沒有user登入，則會是null
```
firebase.auth().onAuthStateChanged((user) => {
    if (user) {

    }
});
```
### actionCodeSettings

*  有些方法需要引入此設定(驗證信箱)
*  url: 重新導向的url
```
const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be whitelisted in the Firebase Console.
    url: 'http://localhost:8081',

    // This must be true.
    handleCodeInApp: true,

    iOS: {
        bundleId: 'com.example.ios'
    },
    android: {
        packageName: 'com.example.android',
        installApp: true,
        minimumVersion: '12'
    },
    dynamicLinkDomain: 'example.page.link'
};
```
### createUserWithEmailAndPassword
*  創建使用者(使用email, password)
*  result.user 可以取得新創的這個user
```
firebase.auth().createUserWithEmailAndPassword(email, password)
.then((result) => {
    
})
.catch((error) => {
    
})
```
### signInWithEmailAndPassword
*  登入(使用email, password)
*  result.user 可以取得登入的這個user
```
firebase.auth().signInWithEmailAndPassword(email, password)
.then((result) => {
    
})
.catch((error) => {
    
});
```
### signOut
*  登出
```
firebase.auth().signOut().then(() => {

}).catch((error) =>  {

});
```

### sendEmailVerification

*  驗證信箱
```
user.sendEmailVerification(actionCodeSettings)
.then(() => {
    
}).catch((error) => {
    
});
```

### user.updateProfile

*  user的屬性與方法都在這: https://firebase.google.com/docs/reference/js/firebase.User
*  可以用於更改user的一些非必要屬性

```
user.updateProfile({
    displayName: 'username',
    photoURL: ''
})
```
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
        data.forEach((d) =>  {
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
    .catch((error) => { console.log("initCollection Error:", error) });
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

## firebase in vuex

*  vuex-store-firebase-user.js
*  vuex-store-firebase-product.js

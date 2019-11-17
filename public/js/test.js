const firebaseConfig = {
    apiKey: "AIzaSyA1v-8vqcbl-kvKKUybHKQkJdimDNs2Ykk",
    authDomain: "vue-demo-92774.firebaseapp.com",
    databaseURL: "https://vue-demo-92774.firebaseio.com",
    projectId: "vue-demo-92774",
    storageBucket: "vue-demo-92774.appspot.com",
    messagingSenderId: "293558852778",
    appId: "1:293558852778:web:e0b38cd9525f765ba6c4d3"
};

var defaultProject = firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();


// *Auth


// var email = 'qws7869vdx@gmail.com'
// var password = 'default'

// firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
//   // Handle Errors here.
//   var errorCode = error.code;
//   var errorMessage = error.message;
//   // ...
// });

// *---------------------------------------------------------------*
// *Add and manage data


// 創一個測試用的資料
testDocRef = db.collection('cities').doc('test');
testDocRef.set({
    name: 'test-city',
    state: "TW",
    country: "Tapei"
});



// *add data 新增資料(ID自動產生)
// db.collection("users").add({
//     first: "asdasd",
//     last: "zxczxc",
//     born: 1815
// })
// .then(function(docRef) {
//     console.log("Document written with ID: ", docRef.id);
// })
// .catch(function(error) {
//     console.error("Error adding document: ", error);
// });


// *Read data
// db.collection('cities').get().then((querySnapshot) => {
//     querySnapshot.forEach((doc) => {
//         console.log(doc.id, doc.data());        
//     });
// });

// *篩選+排序
// var usersRef = db.collection('users');
// usersRef.where('first', '==', 'Ada').get().then((querySnapshot) => {
//     querySnapshot.forEach((doc) => {
//         console.log(doc.data());
//     });
// })

// *Add data to Cloud Firestore
// *Add 用於新增自動產生ID的資料
// *Set 用於有定義KEY的情況 或 覆蓋資料時

// 沒辦法db.collection("cities").doc('test02').add()
// db.collection("cities").doc('test02').set({
//     name: "test-city02",
//     state: "CA",
//     country: "USA"
// })
// .then(function() {
//     console.log("Document successfully written!");
// })
// .catch(function(error) {
//     console.error("Error writing document: ", error);
// });

// // 覆蓋
// db.collection("cities").doc('test02').set({
//     name: "Los Angeles",
//     state: "CA",
// })

// example types data
// var docData = {
//     stringExample: "Hello world!",
//     booleanExample: true,
//     numberExample: 3.14159265,
//     dateExample: firebase.firestore.Timestamp.fromDate(new Date("December 10, 1815")),
//     dataNowExample: firebase.firestore.Timestamp.fromDate(new Date(Date.now())),
//     arrayExample: [5, true, "hello"],
//     nullExample: null,
//     objectExample: {
//         a: 5,
//         b: {
//             nested: "foo"
//         }
//     }
// };
// 從Firestore獲取時間需用toDate,toMillis()這兩個方法獲取Date跟Mil
// ex: 前端顯示可以用dayjs(date.toMillis())

// db.collection("data").doc("one").set(docData).then(function() {
//     console.log("Document successfully written!");
// });

// *以下的set會自動產生ID = db.collection("cities").add(data);
// var newCityRef = db.collection("cities").doc();
// newCityRef.set({ name: "Los", state: "TW" });

// *Update a document(以不覆蓋整個資料的方法更新)
testDocRef.update({state: "Japan"});

// *Server Timestamp(傳回修改的時間(現在) = new Date(Date.now()) 上面example有)
// washingtonRef.update({ timestamp: firebase.firestore.FieldValue.serverTimestamp() })

// *Update fields in nested objects 更新Object(object[color]用object.color修改)
// Create an initial document to update.
var frankDocRef = db.collection("users").doc("frank");
frankDocRef.set({
    name: "Frank",
    favorites: { food: "Pizza", color: "Blue", subject: "recess" },
    age: 12
});

// To update age and favorite color:
db.collection("users").doc("frank").update({
    "age": 13,
    "favorites.color": "Red"
}).then(function() {console.log("Document successfully updated!");});

// *Update elements in an array(更新陣列 可以用arrayUnion 或 一般直接覆蓋)
testDocRef.update({
    aa: [1,3],
    regions: firebase.firestore.FieldValue.arrayUnion("east_coast","greater_virginia", "ajsdflksjf")
});

// *Remove elements in an array(刪除陣列中的element)
testDocRef.update({
    regions: firebase.firestore.FieldValue.arrayRemove("east_coast")
});

// *遞增數值(population會一直+5)
testDocRef.update({
    population: firebase.firestore.FieldValue.increment(5)
});

// *---------------------------------------------------------------*

// *Transactions and Batched Writes 
// Transactions: 對一個或多個文檔的一組"讀寫"操作(會"平行"執行)
// Batched Writes: 批量寫入，對一個或多個文檔的一組"寫入"操作(只有寫入，可以累積一連串操作後，再一次提交)

// *Transactions(事務)
// *使用Transactions的注意事項
// 1.讀取必須在寫入之前進行
// 2.如果某個修改操作會影響某個事務讀取的文檔，則同時並發的調用該事務函數可能會運行多次。
// 3.不應該直接修改應用狀態。
testDocRef.update({ population: 0 });
// db.runTransaction(function(transaction) {
//     // This code may get re-run multiple times if there are conflicts.
//     return transaction.get(testDocRef).then(function(testDoc) {
//         if (!testDoc.exists) { throw "Document does not exist!"; }

//         // 更新population，不用Transactions也可以實現此功能(上面的increment)
//         var newPopulation = testDoc.data().population + 1;
//         transaction.update(testDocRef, { population: newPopulation });
//     });
// }).then(function() {console.log("Transaction successfully committed!");
// }).catch(function(error) {console.log("Transaction failed: ", error);});

//* 將訊息傳到外面(成功與失敗後 then(message), catch(message))
db.runTransaction(function(transaction) {
    return transaction.get(testDocRef).then(function(testDoc) {
        if (!testDoc.exists) {throw "Document does not exist!";}

        var newPopulation = testDoc.data().population + 1;
        if (newPopulation <= 1000000) {
            transaction.update(testDocRef, { population: newPopulation });
            return newPopulation;
        } else {
            return Promise.reject("Sorry! Population is too big.");
        }
    });
}).then(function(newPopulation) {
    console.log("Population increased to ", newPopulation);
}).catch(function(err) {
    // This will be an "population is too big" error.
    console.error(err);
});

// *Batched writes
// 包含set(), update(), or delete()這些操作，可以累積完一串操作後再一次提交
// 若提交失敗(中途操作有錯誤)，則會全都不會修改。

var batch = db.batch();
// Set the value of 'NYC'
var nycRef = db.collection("cities").doc("NYC");
batch.set(nycRef, {name: "New York City"});

// Update the population of 'SF'
var sfRef = db.collection("cities").doc("SF");
batch.update(sfRef, {"population": 1000000});

// // Delete the city 'LA'
var laRef = db.collection("cities").doc("LA");
batch.delete(laRef);

// Commit the batch
batch.commit().then(function () {
    console.log('Batch success')
});

// *---------------------------------------------------------------*
// *Delete data from Cloud Firestore
// *Delete documents
// *delete 可以找到doc之後用doc.ref回到上一層就可以用delete()
// *可以先用where()篩選在刪除 -> where().get().then... doc.ref.delete()
db.collection("cities").doc("DC").delete().then(function() {
    console.log("Document successfully deleted!");
}).catch(function(error) {
    console.error("Error removing document: ", error);
});
// *Delete fields (firebase.firestore.FieldValue.delete())
testDocRef.update({
    capital: firebase.firestore.FieldValue.delete()
});
// *Delete collections (不推薦在web client刪除)
// Deleting collections from a Web client is not recommended.

// *---------------------------------------------------------------*
// *備份資料 (官方只提供使用Google Cloud的方法:https://firebase.google.com/docs/firestore/manage-data/export-import)
// 其他備份資料的方法: https://github.com/steadyequipment/node-firestore-backup
// 先到專案設定 => 服務帳戶 => 產生新的私密金鑰 (會載一個json檔案下來)

// npm install -g firestore-backup
// -a, --accountCredentials <path> - 剛剛的json檔路徑
// -B, --backupPath <path>- 備份到哪的路徑
// firestore-backup -a path/to/credentials/file.json -b /backups/myDatabase

//其他選項 
// -P --prettyPrint 會將備份的json排版
// -S, --databaseStartPath <path> - The database collection or document path to begin backup.
// -L, --requestCountLimit <number> - The maximum number of requests to be made in parallel.
// -E, --excludeCollections <id> - Top level collection id(s) to exclude from backing up.

// *---------------------------------------------------------------*
// *Read Data
// 創一些測試用的資料
citiesRef = db.collection('cities');
citiesRef.doc("SF").set({
    name: "San Francisco", state: "CA", country: "USA",
    capital: false, population: 30000,
    regions: ["west_coast", "norcal"] });
citiesRef.doc("LA").set({
    name: "Los Angeles", state: "CA", country: "USA",
    capital: false, population: 100000,
    regions: ["west_coast", "socal"] });
citiesRef.doc("DC").set({
    name: "Washington, D.C.", state: null, country: "USA",
    capital: true, population: 60000,
    regions: ["east_coast"] });
citiesRef.doc("TOK").set({
    name: "Tokyo", state: null, country: "Japan",
    capital: true, population: 9000000,
    regions: ["kanto", "honshu"] });
citiesRef.doc("BJ").set({
    name: "Beijing", state: null, country: "China",
    capital: true, population: 21500000,
    regions: ["jingjinji", "hebei"] });

// Get a document

// citiesRef.doc("SF").get().then(function(doc) {
//     if (doc.exists) {
//         console.log("Document data:", doc.data());
//     } else {
//         // doc.data() will be undefined in this case
//         console.log("No such document!");
//     }
// }).catch(function(error) {
//     console.log("Error getting document:", error);
// });
// Source Options
// Valid options for source are 'server', 'cache', 'default'
// See https://firebase.google.com/docs/reference/js/firebase.firestore.GetOptions
var getOptions = {source: 'cache'};
// ref.doc.get(getOptions)

// Get all documents in a collection
// db.collection("cities").get().then(function(querySnapshot) {
//     querySnapshot.forEach(function(doc) {
//         console.log(doc.id, " => ", doc.data());
//     });
// });

// Get multiple documents from a collection
// 用where篩選、orderby排序
// db.collection("cities").where("capital", "==", true)
//     .get()
//     .then(function(querySnapshot) {
//         querySnapshot.forEach(function(doc) {
//             console.log(doc.id, " => ", doc.data());
//         });
//     }).catch(function(error) {
//         console.log("Error getting documents: ", error);
//     });
// *---------------------------------------------------------------*
// *Get realtime updates with Cloud Firestore
// 監聽資料，資料變動就會調用方法
db.collection("cities").doc("SF")
    .onSnapshot(function(doc) {
        console.log("update data, current: ", doc.data());
    });

// Events for local changes (辨別變更資料的是local還是server)
// hasPendingWrites: 在本地進行資料的變動，資料還尚未寫進去 Server
db.collection("cities").doc("SF")
    .onSnapshot(function(doc) {
        var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
        console.log(source, " data: ", doc.data());
    });

// 監聽多個 可以使用where進行篩選
db.collection("cities").where("state", "==", "CA")
    .onSnapshot(function(querySnapshot) {
        var cities = [];
        querySnapshot.forEach(function(doc) {
            cities.push(doc.data().name);
        });
        console.log("Current cities in CA: ", cities.join(", "));
    });

// 監聽(使用snapshot.docChanges與change.type對應各種情況)
db.collection("cities").where("state", "==", "CA")
    .onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
            if (change.type === "added") {
                console.log("New city: ", change.doc.data());
            }
            if (change.type === "modified") {
                console.log("Modified city: ", change.doc.data());
            }
            if (change.type === "removed") {
                console.log("Removed city: ", change.doc.data());
            }
        });
    });
// *Detach a listener 停用監聽(把監聽給一個參數，在執行他本身就好)
var unsubscribe = db.collection("cities")
    .onSnapshot(function (){});
// Stop listening to changes
unsubscribe();

// *Handle listen errors
db.collection("cities")
    .onSnapshot(function(snapshot) {
        //...
    }, function(error) {
        // Handle errors
    });

//* Query(where的各種用法)
// Query operators:<, <=, ==, >, >=, array-contains
citiesRef.where("state", "==", "CA")
citiesRef.where("population", "<", 100000)
citiesRef.where("name", ">=", "San Francisco")
citiesRef.where("regions", "array-contains", "west_coast")

// Compound queries(複合式)
citiesRef.where("state", "==", "CO").where("name", "==", "Denver")
citiesRef.where("state", "==", "CA").where("population", "<", 1000000)

// 複合式的注意事項:最多包含一個<, <=, >, >= 與一個array-contains
// good: citiesRef.where("state", "==", "CA").where("population", ">", 1000000)
// good: citiesRef.where("state", ">=", "CA").where("state", "<=", "IN")
// error: citiesRef.where("state", ">=", "CA").where("population", ">", 100000)

// *Order and limit data(排序與限制數量)
// orderBy 會排序外還會篩選掉沒有該欄位的資料

citiesRef.orderBy("name").limit(3) // 列出前三個
citiesRef.orderBy("name", "desc").limit(3) //列出倒數三個
citiesRef.orderBy("state").orderBy("population", "desc")
citiesRef.where("population", ">", 100000).orderBy("population").limit(2)

// *使用範圍篩選時(>,<,<=,>=)，第一個orderBy必須跟前者為同一個欄位
//good: citiesRef.where("population", ">", 100000).orderBy("population")
//error: citiesRef.where("population", ">", 100000).orderBy("country")

// *Use a document snapshot to define the query cursor
// 也可以直接用doc當作條件citiesRef.orderBy("population").startAt(doc)

//* Paginate data with query cursors
// startAt會包含(>=)，startAfter會不包含(>)
// endAt(<=)， endBefore(<) 同理
citiesRef.orderBy("population").startAt(60000).get().then((snopsoht) => {
    snopsoht.forEach((doc) => {
        console.log('startAt', doc.data().population);
    })
})
citiesRef.orderBy("population").endAt(60000).get().then((snopsoht) => {
    snopsoht.forEach((doc) => {
        console.log('endAt', doc.data().population);
    })
})

// *Paginate a query 分頁(利用limit達到分頁效果)
var first = citiesRef.orderBy("population").limit(2);

first.get().then(function (snapshots) {
    // Get the last visible document(取得最後一個資料)
    var lastVisible = snapshots.docs[snapshots.docs.length-1];
    console.log("last", lastVisible);

    // Construct a new query starting at this document,
    // get the next 2 cities.
    var next = db.collection("cities")
          .orderBy("population")
          .startAfter(lastVisible)
          .limit(2);
    next.get().then(function(s){
        s.forEach(function(doc) {
            console.log('next', doc.data().population);
        });
    });
});
// Set multiple cursor conditions 設多個cursors
// Will return all Springfields
// 此會依序對應，此會
db.collection("cities")
   .orderBy("name")
   .orderBy("state")
   .startAt("Tepei")

// Will return "Springfield, Missouri" and "Springfield, Wisconsin"
// Tepei會對應到name，Missouri對應到state
db.collection("cities")
   .orderBy("name")
   .orderBy("state")
   .startAt("Tepei", "Missouri")

// *---------------------------------------------------------------*
// *Security Rules

// *Basic read/write rules
// Match any document in the 'cities' collection
// match /cities/{city} {
//   allow read: if <condition>;
//   allow write: if <condition>;
// }

// *Basic auth(登入後才能寫資料，讀取則是都可以)
// allow read, write: if request.auth.uid != null;


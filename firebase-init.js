// 刪除Collection全部資料
function clearCollection(db, coll) {
    console.log('clearCollection', coll);
    db.collection(coll).get().then((shotsnap) => {
        shotsnap.forEach((doc) => {
            db.collection(coll).doc(doc.id).delete();
        });
    });
}

// 新增資料進去(自動ID)
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

let list = [
    {
        id: 0,
        name: 'list0'
    },
    {
        id: 1,
        name: 'list1'
    },
    {
        id: 2,
        name: 'list2'
    },
]



// initCollection(db, 'list', list)




db.collection('list').get().then((shotsnap) => {
    shotsnap.forEach((doc) => {
        let userRef = doc.data().user;
        userRef.get().then((d) => {
            console.log(d.exists);
            console.log(d.data());
        })
    })
})
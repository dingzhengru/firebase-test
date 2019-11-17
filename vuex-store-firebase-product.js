// import { firebase, db } from '../firebase.js'

const firestoreProduct = {
    namespaced: true,
    state: {
        data: null,
        status: null,
        error: null,
        sort: {
            orderByField: 'id',
            isAsc: true
        },
        search: {
            text: '',
            field: '',
        },
        pagination: {
            currentPage: null,
            pageSize: null
        }
    },
    getters: {
        getSortData: (state) => {
            let data = state.data || [];
            let field = state.sort.orderByField;
            let isAsc = state.sort.isAsc;

            return data.sort(function (a, b) {
                if(isAsc)
                    return a[field] > b[field] ? 1 : -1;
                else
                    return a[field] < b[field] ? 1 : -1;
            });
        },
        getSearchData: (state) => {
            let data = state.data || [];
            let searchText = state.search.text;
            let searchField = state.search.field;

            if(_.isEmpty(searchField))
                return data.filter(function(p) {
                    for(let x in p) {
                        if(String(p[x]).toLowerCase().includes(searchText.toLowerCase())) 
                            return p;
                    }
                })
            else {
                return data.filter((p) => {
                    if(String(p[searchField]).toLowerCase().includes(searchText.toLowerCase())) 
                        return p;
                })
            }
        },
        getPageData(state) {
            let currentPage = state.pagination.currentPage;
            let pageSize = state.pagination.pageSize;
            let startAt = pageSize * (currentPage - 1);
            let endAt = startAt + pageSize;

            let data = state.data || [];

            return data.slice(startAt, endAt);
        },
        getFilterData(state, getters) {
            // 取搜尋後再分割頁面的資料

            // page
            let currentPage = state.pagination.currentPage;
            let pageSize = state.pagination.pageSize;
            let startAt = pageSize * (currentPage - 1);
            let endAt = startAt + pageSize;

            // search
            let searchText = state.search.text;
            let searchField = state.search.field;

            // sort
            let field = state.sort.orderByField;
            let isAsc = state.sort.isAsc;

            // sort => search => page
            let data = getters.getSortData;

            if(_.isEmpty(searchField)) {
                data = data
                       .filter(function(d) {
                        for(let x in d) {
                            if(String(d[x]).toLowerCase().includes(searchText.toLowerCase())) 
                                return d;
                            }
                        })
            }
            else {
                data = data
                       .filter((d) => {
                            if(String(d[searchField]).toLowerCase().includes(searchText.toLowerCase())) 
                                return d;
                        })
            }

            data = data.slice(startAt, endAt)
            return data;
        }
    },
    mutations: {
        setData(state, payload) {
            console.log('setData', payload);
            state.data = payload;
        },
        setStatus(state, payload) {
            state.status = payload;
        },
        setError(state, payload) {
            state.error = payload
        },
        setSort(state, payload) {
            state.sort = payload;
        },
        setSearch(state, payload) {
            console.log('setSearch', payload);
            state.search = payload;
        },
        setPage(state, payload) {
            console.log('setPage', payload);
            state.pagination = payload;
        }
    },
    actions: {
        getDataAction({ state, commit }, payload) {
            console.log('getDataAction');


            // Order (使用state.sort排序)
            let orderByField = state.sort.orderByField;
            let isAsc = state.sort.isAsc;
            let sort = 'asc'
            if(!isAsc)
                sort = 'desc'

            return new Promise((resolve, reject) => {
                db.collection('products')
                .orderBy(orderByField, sort)
                .get()
                .then((shotsnap) => {
                    let products = shotsnap.docs.map(doc => doc.data());
                    commit('setData', products);
                    resolve(products);
                })
                .catch((error) => {
                    reject(error);
                })
            })
        },
        addDataAction({ dispatch, commit }, payload) {
            console.log('addDataAction');

            let product = payload;

            // 直接從資料庫找最大的ID，+1之後當新資料的ID
            return new Promise((resolve, reject) => {
                db.collection('products').orderBy('id', 'desc').limit(1).get()
                .then((shotsnap) => {
                    shotsnap.forEach((doc) => {
                        product.id = Number(doc.data().id) + 1;
                        product.price = Number(product.price);
                        db.collection('products').add(product);

                        // update data(更新state的資料)
                        dispatch('getDataAction');

                        resolve(product);
                    })
                })
                .catch((error) => {
                    reject(error.message);
                })
            })
        },
        removeDataAction({ dispatch, commit }, payload) {
            console.log('removeDataAction');

            let product = payload;

            return new Promise((resolve, reject) => {
                db.collection('products').where('id', '==', product.id).get()
                .then((shotsnap) => {
                    shotsnap.forEach((doc) => {
                        doc.ref.delete();

                        // update data(更新state的資料)
                        dispatch('getDataAction');

                        resolve(product);
                    })
                })
                .catch((error) => {
                    reject(error.message);
                })
            })
        },
        updateDataAction({ dispatch, commit }, payload) {
            console.log('updateDataAction');
            // 這裡不使用 dispatch('getDataAction') 更新，避免執行太多次

            let product = payload;

            return new Promise((resolve, reject) => {
                db.collection('products')
                .where('id', '==', product.id).get()
                .then((shotsnap) => {
                    shotsnap.forEach((doc) => {
                        doc.ref.update(product);
                        resolve(product);
                    })
                })
                .catch((error) => {
                    reject(error);
                })
            })
        }
    },
}


export { firestoreProduct }
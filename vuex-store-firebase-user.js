// import { firebase } from '../firebase.js'

const storeUser = {
    namespaced: true,
    state: {
        data: null,
        status: null,
        error: null
    },
    getters: {
        
    },
    mutations: {
        setData(state, payload) {
            console.log('user: setData', payload);
            state.data = payload;
        },
        clearData(state, payload) {
            console.log('user: clearData');
            state.data = null;
        },
        setStatus(state, payload) {
            state.status = payload;
        },
        setError(state, payload) {
            state.error = payload
        },
    },
    actions: {
        setAuthStateChanged({ commit }, payload) {
            console.log('setAuthStateChanged')
            return new Promise((resolve, reject) => {
                firebase.auth().onAuthStateChanged((user) => {
                    if (user) {
                        commit('setData', user);
                        resolve(user);
                    } else {
                        commit('clearData');
                        reject('User is not logged in.');
                    }
                });
            });
        },
        signUpAction({ commit }, payload) {
            console.log('signUpAction');

            let username = payload.username;
            let email = payload.email;
            let password = payload.password;

            return new Promise((resolve, reject) => {
                firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((result) => {
                    // update profile
                    result.user.updateProfile({
                        displayName: username
                    });
                    resolve(result);
                })
                .catch((error) => {
                    reject('createUserError: ' + error.message);
                })
            })
        },
        signInAction({ commit }, payload) {
            console.log('signInAction');

            let email = payload.email;
            let password = payload.password;

            return new Promise((resolve, reject) => {
                firebase.auth().signInWithEmailAndPassword(email, password)
                .then((result) => {
                    commit('setData', result.user);
                    resolve(result);
                })
                .catch((error) => {
                    reject(error);
                });
            });
        },
        signOutAction({ commit }, payload) {
            console.log('signOutAction');
            return new Promise((resolve, reject) => {
                firebase.auth().signOut().then(function() {
                    resolve('sign out')
                }).catch(function(error) {
                    reject(error.message);
                });
            });
        },
        sendEmailVerification(context, payload) {
            console.log('sendEmailVerification');

            // this user is auth user
            let user = context.state.data || payload;

            return new Promise((resolve, reject) => {
                user.sendEmailVerification(actionCodeSettings)
                .then(() => {
                    resolve();
                }).catch(function(error) {
                    reject(error.message);
                });
            });
        },
    },
}


export { storeUser }
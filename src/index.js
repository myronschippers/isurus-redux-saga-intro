import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';
import registerServiceWorker from './registerServiceWorker';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import { takeEvery, put } from 'redux-saga/effects';
import axios from 'axios';

const firstReducer = (state = 0, action) => {
    if (action.type === 'BUTTON_ONE') {
        console.log('firstReducer state', state);
        console.log('Button 1 was clicked!');
        return state + 1;
    }
    return state;
};

const secondReducer = (state = 100, action) => {
    if (action.type === 'BUTTON_TWO') {
        console.log('secondReducer state', state);
        console.log('Button 2 was clicked!');
        return state - 1;
    }
    return state;
};

const elementListReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_ELEMENTS':
            return action.payload;
        default:
            return state;
    }
};    

function* firstSaga(action) {
    console.log('firstSaga has been hit - action: ', action);
}

function* getElements() {
    try {

        const response = yield axios.get('/api/element');
        // Dispatches action to reducers (store)
        yield put({ type: 'SET_ELEMENTS', payload: response.data });
    } catch(err) {
        console.log('Error on GET: ', err);
    }
}

function* putElement(action) {
    try {
        yield axios.post('/api/element', action.payload);
        yield put({ type: 'GET_ELEMENTS' });
    } catch(err) {
        console.log('Error POST:', err);

    }
}

// this is the saga that will watch for actions
function* watcherSaga() {
    yield takeEvery('SET_ELEMENTS', firstSaga);
    yield takeEvery('GET_ELEMENTS', getElements);
    yield takeEvery('PUT_ELEMENT', putElement);
}


const sagaMiddleware = createSagaMiddleware();

// This is creating the store
// the store is the big JavaScript Object that holds all of the information for our application
const storeInstance = createStore(
    // This function is our first reducer
    // reducer is a function that runs every time an action is dispatched
    combineReducers({
        firstReducer,
        secondReducer,
        elementListReducer,
    }),
    applyMiddleware(sagaMiddleware, logger),
);

// Just kicks off our Saga(s)
sagaMiddleware.run(watcherSaga);

ReactDOM.render(<Provider store={storeInstance}><App/></Provider>, document.getElementById('root'));
registerServiceWorker();

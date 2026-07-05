import { legacy_createStore as createStore } from 'redux'

const initialState = {
  sidebarShow: true,
  theme: 'light',
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store


// import { legacy_createStore as createStore } from 'redux';

// // Initial state
// const initialState = {
//   sidebarShow: true,
//   theme: 'light',
//   carNumbers: [],  // Array to store car numbers
// };

// // Action Types
// const SET = 'set';
// const ADD_CAR_NUMBER = 'ADD_CAR_NUMBER';
// const REMOVE_CAR_NUMBER = 'REMOVE_CAR_NUMBER';

// // Reducer
// const changeState = (state = initialState, action) => {
//   switch (action.type) {
//     case SET:
//       return { ...state, ...action.rest };

//     case ADD_CAR_NUMBER: {
//       const { payload: carNumber } = action;
//       // Check if carNumber already exists in the array
//       if (!state.carNumbers.includes(carNumber)) {
//         return {
//           ...state,
//           carNumbers: [...state.carNumbers, carNumber],
//         };
//       }
//       return state;  // If carNumber exists, return the current state
//     }

//     case REMOVE_CAR_NUMBER:
//       return {
//         ...state,
//         carNumbers: state.carNumbers.filter(carNumber => carNumber !== action.payload),
//       };

//     default:
//       return state;
//   }
// };

// // Create the store
// const store = createStore(changeState);
// export default store;

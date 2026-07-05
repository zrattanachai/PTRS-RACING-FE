export const addCarNumber = (carNumber) => ({
    type: 'ADD_CAR_NUMBER',
    payload: carNumber,
});

export const removeCarNumber = (carNumber) => ({
    type: 'REMOVE_CAR_NUMBER',
    payload: carNumber,
});

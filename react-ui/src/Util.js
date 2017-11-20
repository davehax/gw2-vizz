const jsonFetchResponse = function (response) {
    // debugger;
    if (response.ok) {
        return response.json();
    }
    else {
        // throw new Error('Network response was not ok.');
        throw response;
    }
};

export default jsonFetchResponse;
const jsonFetchResponse = (response) => {
    // debugger;
    if (response.ok) {
        return response.json();
    }
    else {
        // throw new Error('Network response was not ok.');
        throw response;
    }
};

// Util function to reduce fetch code clutter elsewhere
// D.R.Y af
const getJson = (url, headers) => {
    headers = headers || new Headers({
        "Accept": "application/json"
    });

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: "GET",
            headers: headers
        })
            .then(jsonFetchResponse)
            .then((data) => { resolve(data); }) // pass through data
            .catch((error) => { reject(error); }); // pass through error
    })
}

export default jsonFetchResponse;
export {
    getJson
};
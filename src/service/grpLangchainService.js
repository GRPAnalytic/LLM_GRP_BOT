const fetch = require('node-fetch');

const postQuestion = async (message, context = "", includeTables = []) => {
    const res = await fetch("http://172.16.30.170:8000/answer/", {
        body: JSON.stringify({
            context,
            question: message,
            include_tables: includeTables
        }),
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });
    console.log('res', JSON.stringify(res, null, 2));

    const data = await res.json();

    return data;
}

module.exports = {
    postQuestion,
}
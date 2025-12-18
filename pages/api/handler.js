import { webdatadecrypt, webdataencrypt } from "@/utils";
import { createOrUpdate, retrieveOrRemove } from "@/utils/fetchUtils";


export default async function handler(req, res) {

    if (req.method === 'GET') {
        // Handle GET request
        res.status(200).json({ message: 'This is a GET request' });
    } else if (req.method === 'POST') {
        if (req?.body?.data) {
            let bodyData = JSON.parse(webdatadecrypt(req.body.data))
            // Handle POST request
            let api = bodyData.api
            let method = bodyData.method
            let payload = bodyData.payload
            let isauth = bodyData?.isauth ?? false

            if (method === "GET") {
                const response = await retrieveOrRemove(method, api, isauth)
                res.status(200).json({ response: webdataencrypt(JSON.stringify(response)) });
            } else if (method === "POST" || method === 'PUT' || method === 'PATCH') {
                const response = await createOrUpdate(payload, method, api, isauth)
                res.status(200).json({ response: webdataencrypt(JSON.stringify(response ?? "")) });
            } else {
            }
        }
        res.status(200).json({ message: 'This is a POST request' });
    } else if (req.method === 'PUT') {
        const response = await retrieveOrRemove("GET", api, false)
        // Handle PUT request
        res.status(200).json({ message: 'This is a PUT request' });
    } else {
        res.status(404).json({ message: 'Invalid request method' });
    }
}
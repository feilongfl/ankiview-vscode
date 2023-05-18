import axios, { AxiosError, AxiosResponse } from 'axios';

interface AnkiConnectResponse {
    error?: string
    result: any
}

export interface AnkiConnectResponse_Miscellaneous_Version extends AnkiConnectResponse {
    result: string
};

export interface AnkiConnectResponse_Graphical_GuiCurrentCard extends AnkiConnectResponse {
    result: {
        "answer": string,
        "question": string,
        "deckName": string,
        "modelName": string,
        "fieldOrder": number,
        "fields": any,
        "template": string,
        "css": string,
        "cardId": number,
        "buttons": Array<number>,
        "nextReviews": Array<string>
    }
};

export class AnkiConnect {
    acResponseBody = <T>(response: AxiosResponse<T>) => response.data;

    acRequest = {
        //   get: <T>(url: string) => axios.get<T>(url).then(acResponseBody),
        post: <T>(url: string, body: {}) =>
            axios.post<T>(url, {...body, "version": 6}).then(this.acResponseBody),
    };

    Api = {
        Graphical: {
            GuiCurrentCard: () => this.acRequest.post<AnkiConnectResponse_Graphical_GuiCurrentCard>('/', {
                "action": "guiCurrentCard",
            }),
        },
        Miscellaneous: {
            Version: () => this.acRequest.post<AnkiConnectResponse_Miscellaneous_Version>('/', {
                "action": "version",
            }),
            Sync: () => this.acRequest.post<AnkiConnectResponse>('/', {
                "action": "sync",
            }),
        },
    };

    constructor(baseURL: string) {
        axios.defaults.baseURL = baseURL;
    }
}

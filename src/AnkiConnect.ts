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
            axios.post<T>(url, { ...body, "version": 6 }).then(this.acResponseBody),
    };

    api = {
        graphical: {
            guiCurrentCard: () => this.acRequest.post<AnkiConnectResponse_Graphical_GuiCurrentCard>('/', {
                "action": "guiCurrentCard",
            }),
            guiShowQuestion: () => this.acRequest.post<AnkiConnectResponse>('/', {
                "action": "guiShowQuestion",
            }),
            guiShowAnswer: () => this.acRequest.post<AnkiConnectResponse>('/', {
                "action": "guiShowAnswer",
            }),
            guiAnswerCard: (ease: number) => this.acRequest.post<AnkiConnectResponse>('/', {
                "action": "guiAnswerCard",
                "params": {
                    "ease": ease,
                },
            }),
        },
        miscellaneous: {
            version: () => this.acRequest.post<AnkiConnectResponse_Miscellaneous_Version>('/', {
                "action": "version",
            }),
            sync: () => this.acRequest.post<AnkiConnectResponse>('/', {
                "action": "sync",
            }),
        },
    };

    constructor(baseURL: string) {
        axios.defaults.baseURL = baseURL;
    }
}

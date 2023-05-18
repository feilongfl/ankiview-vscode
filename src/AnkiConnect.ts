import axios, { AxiosError, AxiosResponse } from 'axios';

interface AnkiConnectResponse {
    error?: string
    result: any
}

export interface AnkiConnectResponse_Miscellaneous_Version extends AnkiConnectResponse {
    result: string
};

export class AnkiConnect {
    acResponseBody = <T>(response: AxiosResponse<T>) => response.data;

    acRequest = {
        //   get: <T>(url: string) => axios.get<T>(url).then(acResponseBody),
        post: <T>(url: string, body: {}) =>
            axios.post<T>(url, {...body, "version": 6}).then(this.acResponseBody),
    };

    Api = {
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

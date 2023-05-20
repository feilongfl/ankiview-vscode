import axios, { AxiosError, AxiosResponse } from 'axios';

interface AnkiConnectResponse {
    error?: string
    result: any
}

export interface AnkiConnectResponse_Deck_GetDeckConfig extends AnkiConnectResponse {
    result: {
        "id": number,
        "mod": number,
        "name": string,
        "usn": number,
        "maxTaken": number,
        "autoplay": boolean,
        "timer": number,
        "replayq": boolean,
        "new": any,
        "rev": any,
        "lapse": any,
        "dyn": boolean,
        "newMix": number,
        "newPerDayMinimum": number,
        "interdayLearningMix": number,
        "reviewOrder": number,
        "newSortOrder": number,
        "newGatherPriority": number,
        "buryInterdayLearning": boolean,
        "reminder": any,
    }
};

export interface AnkiConnectResponse_Deck_GetDeckStats_ResultItem {
    "deck_id": number,
    "name": string,
    "new_count": number,
    "learn_count": number,
    "review_count": number,
    "total_in_deck": number
}

export interface AnkiConnectResponse_Deck_GetDeckStats_Result {
    [Key: string]: AnkiConnectResponse_Deck_GetDeckStats_ResultItem;
}

export interface AnkiConnectResponse_Deck_GetDeckStats extends AnkiConnectResponse {
    result: AnkiConnectResponse_Deck_GetDeckStats_Result,
}

export interface AnkiConnectResponse_Media_RetrieveMediaFile extends AnkiConnectResponse {
    result: string
};

export interface AnkiConnectResponse_Miscellaneous_Version extends AnkiConnectResponse {
    result: string
};

export interface AnkiConnectResponse_Graphical_DeckNames extends AnkiConnectResponse {
    result: [string],
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
        deck: {
            deckNames: () => this.acRequest.post<AnkiConnectResponse_Graphical_DeckNames>('/', {
                "action": "deckNames",
            }),
            getDeckConfig: (deck: string) => this.acRequest.post<AnkiConnectResponse_Deck_GetDeckConfig>('/', {
                "action": "getDeckConfig",
                "params": {
                    "deck": deck,
                },
            }),
            getDeckStats: (decks: [string]) => this.acRequest.post<AnkiConnectResponse_Deck_GetDeckStats>('/', {
                "action": "getDeckStats",
                "params": {
                    "decks": decks,
                },
            }),
            getDeckStat: async (deck: string) => {
                let result = (await this.api.deck.getDeckStats([deck])).result;
                for (let k in result) {
                    return result[k]; // return first value
                }
                return undefined;
            },
        },
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
            guiUndo: () => this.acRequest.post<AnkiConnectResponse>('/', {
                "action": "guiUndo",
            }),
            guiAnswerCard: (ease: number) => this.acRequest.post<AnkiConnectResponse>('/', {
                "action": "guiAnswerCard",
                "params": {
                    "ease": ease,
                },
            }),
            guiDeckReview: (name: string) => this.acRequest.post<AnkiConnectResponse>('/', {
                "action": "guiDeckReview",
                "params": {
                    "name": name,
                },
            }),
        },
        media: {
            retrieveMediaFile: (fileName: string) => this.acRequest.post<AnkiConnectResponse_Media_RetrieveMediaFile>('/', {
                "action": "retrieveMediaFile",
                "params": {
                    "filename": fileName,
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

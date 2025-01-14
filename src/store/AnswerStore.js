import { makeAutoObservable } from 'mobx';

export default class AnswerStore {
    constructor() {
        this._answers = [];
        makeAutoObservable(this);
    }

    setAnswers({rows}) {
        this._answers = rows || []; 
    }

    get answers() {
        return this._answers;
    }

}

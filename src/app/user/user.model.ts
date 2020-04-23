export class User {
    constructor(
        public email: string, 
        public id: string,
        private _token: string,
        private _tokenExpirationDate: Date
    ) {}

    // U can access this getter using user.token
    // U can't set value to a getter like user.token ="cjkdcd"
    // U can do it using setter
    get token() {
        if(!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
            return null;
        }
        return this._token;
    }
}
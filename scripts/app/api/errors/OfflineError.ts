export class OfflineError extends Error {
    constructor() {
        super("Offline");
        this.name = "OfflineError";
    }
}

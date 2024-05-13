export class SelectedEvent {
    static dispatch(element, id, location) {
        const evt = new Event("getaddress-location-native-selected", { bubbles: true });
        evt["location"] = location;
        evt["id"] = id;
        element.dispatchEvent(evt);
    }
}
export class SelectedFailedEvent {
    static dispatch(element, id, status, message) {
        const evt = new Event("getaddress-location-native-selected-failed", { bubbles: true });
        evt["status"] = status;
        evt["message"] = message;
        evt["id"] = id;
        element.dispatchEvent(evt);
    }
}
export class SuggestionsEvent {
    static dispatch(element, query, suggestions) {
        const evt = new Event("getaddress-location-native-suggestions", { bubbles: true });
        evt["suggestions"] = suggestions;
        evt["query"] = query;
        element.dispatchEvent(evt);
    }
}
export class SuggestionsFailedEvent {
    static dispatch(element, query, status, message) {
        const evt = new Event("getaddress-location-native-suggestions-failed", { bubbles: true });
        evt["status"] = status;
        evt["message"] = message;
        evt["query"] = query;
        element.dispatchEvent(evt);
    }
}
//# sourceMappingURL=Events.js.map
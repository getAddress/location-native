import { LocationAddress, LocationSuggestion } from "getaddress-api";
export declare class SelectedEvent {
    static dispatch(element: HTMLElement | Document, id: string, location: LocationAddress): void;
}
export declare class SelectedFailedEvent {
    static dispatch(element: HTMLElement | Document, id: string, status: number, message: string): void;
}
export declare class SuggestionsEvent {
    static dispatch(element: HTMLElement | Document, query: string, suggestions: LocationSuggestion[]): void;
}
export declare class SuggestionsFailedEvent {
    static dispatch(element: HTMLElement | Document, query: string, status: number, message: string): void;
}

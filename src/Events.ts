import { LocationAddress, LocationSuggestion } from "getaddress-api";

export class SelectedEvent 
{
    static dispatch(element:HTMLElement|Document,id:string,location:LocationAddress){
        
        const evt  = new Event("getaddress-location-native-selected",{bubbles:true});
        evt["location"] = location;
        evt["id"] = id;
        element.dispatchEvent(evt);
    }
}

export class SelectedFailedEvent 
{
    static dispatch(element:HTMLElement|Document,id:string, status:number, message:string){
        
        const evt  = new Event("getaddress-location-native-selected-failed",{bubbles:true});
        evt["status"] = status;
        evt["message"] = message;
        evt["id"] = id;

        element.dispatchEvent(evt);
    }
}

export class SuggestionsEvent 
{
    static dispatch(element:HTMLElement|Document,query:string,suggestions:LocationSuggestion[]){
        
        const evt  = new Event("getaddress-location-native-suggestions",{bubbles:true});
        evt["suggestions"] = suggestions;
        evt["query"] = query;
        element.dispatchEvent(evt);
    }
}

export class SuggestionsFailedEvent 
{
    static dispatch(element:HTMLElement|Document, query:string,status:number, message:string){
        
        const evt  = new Event("getaddress-location-native-suggestions-failed",{bubbles:true});
        evt["status"] = status;
        evt["message"] = message;
        evt["query"] = query;
        element.dispatchEvent(evt);
    }
}


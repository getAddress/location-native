import {LocationFilter, AutocompleteFilter} from "getaddress-api";
import { IOutputFields } from "./OutputFields";

export class Options 
{
    id_prefix?:string = "getAddress-location-native";
    output_fields:IOutputFields = undefined;
    delay:number = 200;
    minimum_characters:number = 2; 
    clear_list_on_select = true;
    select_on_focus = true;
    alt_location_url:string = undefined;
    alt_get_location_url:string = undefined;
    suggestion_count = 6;
    filter:LocationFilter=undefined;
    bind_output_fields=true;
    input_focus_on_select=true;
    debug=false;
    enable_get_location=true;
    set_default_output_field_names=true;

    constructor(options:IOptions = {})
    {
        for (const prop in options) {
            if (options.hasOwnProperty(prop) && typeof options[prop] !== 'undefined') {
                this[prop] = options[prop];
            }
        }
    }
}

export interface IOptions{
    id_prefix?:string;
    css_prefix?:string;
    delay?:number;
    minimum_characters?:number;
    clear_list_on_select?:boolean;
    select_on_focus?:boolean;
    alt_location_url?:string;
    alt_get_location_url?:string;
    suggestion_count?:number;
    filter?:LocationFilter;
    bind_output_fields?:boolean;
    output_fields?:IOutputFields;
    input_focus_on_select?:boolean;
    debug?:boolean;
    enable_get_location?:boolean;
    set_default_output_field_names?:boolean;
}


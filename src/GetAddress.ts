import Location from "./Location";
import { IOptions, Options } from "./Options";
import Client from 'getaddress-api';
import { OutputFields } from "./OutputFields";
import AttributeValues from "./AttributeValues";

class InstanceCounter
{
    public static instances:Location[] = [];

    static add(location:Location){
        this.instances.push(location);
    }

}

export function location(id:string,api_key:string, options?: IOptions)
{

    if(!id){
        return;
    }

    const allOptions = new Options(options);

    let textbox = document.getElementById(id) as HTMLInputElement;
    if(!textbox){
        textbox = document.querySelector(id) as HTMLInputElement;
    }
    if(!textbox){
        return;
    }
    
    const client = new Client(api_key,undefined,undefined,allOptions.alt_location_url,
        allOptions.alt_get_location_url);
    
    const outputFields = new OutputFields(allOptions.output_fields,allOptions.set_default_output_field_names);
    
    const index = InstanceCounter.instances.length;

    const attributeValues = new AttributeValues(allOptions,index);
    
    const location = new Location(textbox,client,outputFields,attributeValues);
    location.build();
    

    InstanceCounter.add(location);
}

export function destroy()
{
    for(const instance of InstanceCounter.instances){
        instance.destroy();
    }
    InstanceCounter.instances = [];
}
export class OutputFields{
    
    area:string;
    town_or_city:string;
    county:string;
    country:string;
    postcode:string;
    outcode:string;
    latitude:string;
    longitude:string;
    

    constructor(outputFields:IOutputFields = {}, setDefaults:boolean)
    {
        if(setDefaults){
            this.setDefaultValues();
        }
        
        for (const prop in outputFields) {
            if (outputFields.hasOwnProperty(prop) && typeof outputFields[prop] !== 'undefined') {
                this[prop] = outputFields[prop];
            }
        }
    }

    private setDefaultValues()
    {
        this.town_or_city= "town_or_city";
        this.county= "county";
        this.country= "country";
        this.postcode= "postcode";
        this.latitude= "latitude";
        this.longitude= "longitude";
        this.outcode= "outcode";
        this.area= "area";
    }
}
         
export interface IOutputFields{
    
    area?:string;
    town_or_city?:string;
    county?:string;
    country?:string;
    postcode?:string;
    outcode?:string;
    latitude?:string;
    longitude?:string;
   
}
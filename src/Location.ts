import AttributeValues from "./AttributeValues";
import Client, { LocationAddress, LocationOptions, LocationSuggestion } from 'getaddress-api';
import { OutputFields } from "./OutputFields";
import { SelectedEvent, SelectedFailedEvent, SuggestionsEvent, SuggestionsFailedEvent } from "./Events";


export default class Location
{

    private filterTimer?: ReturnType<typeof setTimeout>
    private blurTimer?: ReturnType<typeof setTimeout>
    private list?: HTMLDataListElement = undefined;
   

    constructor(readonly input:HTMLInputElement,readonly client:Client,
        readonly output_fields:OutputFields, readonly attributeValues:AttributeValues)
    {
        
    }

    public destroy(){
        this.destroyInput();
        this.destroyList();
    }

    private destroyList()
    {
        if(this.list){
            this.list.remove();
        }
    }

    

    private destroyInput(){

        this.input.removeAttribute('list');
        this.input.removeEventListener('focus',this.onInputFocus);
        this.input.removeEventListener('paste',this.onInputPaste); 
        this.input.removeEventListener('keydown', this.onKeyDown);
        this.input.removeEventListener('keyup', this.onKeyUp); 
        this.input.removeEventListener('input', this.onInput); 
    }

    private onInputFocus =  () => {
        if(this.attributeValues.options.select_on_focus){
            this.input.select();
        }
    };

    private onInputPaste = () => {
        setTimeout(()=>{this.populateList();},100);
    };

    
    public build()
    {

        this.input.setAttribute('list', `${this.attributeValues.listId}`);
        this.input.addEventListener('focus', this.onInputFocus);
        this.input.addEventListener('paste', this.onInputPaste);
        this.input.addEventListener('keydown', this.onKeyDown);
        this.input.addEventListener('keyup', this.onKeyUp);
        this.input.addEventListener('input', this.onInput);

        this.list = document.createElement('DATALIST') as HTMLDataListElement;
        this.list.id = this.attributeValues.listId;
        
        this.input.insertAdjacentElement("afterend",this.list);
    }

    private onInput =(e:Event) => {
        if((e instanceof InputEvent == false) && e.target instanceof HTMLInputElement)
        {
            const input = e.target as HTMLInputElement;
            if(this.list){
                Array.from(this.list.querySelectorAll("option"))
                .every(
                    (o:HTMLOptionElement) => {
                        if(o.innerText === input.value){
                            this.handleSuggestionSelected(o);
                            return false;
                        }
                        return true;
                    });
            }
        }
    }

    private onKeyUp = (event:KeyboardEvent) => {
        this.debug(event);
        this.handleKeyUp(event);
    };  

    private onKeyDown = (event:KeyboardEvent) => {
        this.debug(event);
        this.handleKeyDownDefault(event);
    }; 

    private debug = (data:any)=>{
        if(this.attributeValues.options.debug){
            console.log(data);
        }
    };

   
    handleComponentBlur = (force: boolean = false) =>{
        
        clearTimeout(this.blurTimer);

        const delay: number = force ? 0 : 100;
        this.blurTimer = setTimeout(() => {
            this.clearList();
            
        }, delay);
    }



    handleSuggestionSelected = async (suggestion:HTMLOptionElement)=>{

        if(!this.attributeValues.options.enable_get_location){
            this.clearList();
        }
        else
        {
            this.input.value = '';

            if(this.attributeValues.options.clear_list_on_select){
                this.clearList();
            }

            const id = suggestion.dataset.id;
            if(id){
                const locationResult = await this.client.getLocation(id);
                if(locationResult.isSuccess){
                    let success = locationResult.toSuccess();
                    
                    this.bind(success.location);
                    SelectedEvent.dispatch(this.input,id,success.location);
                    
                    if(this.attributeValues.options.input_focus_on_select){
                        this.input.focus();
                        this.input.setSelectionRange(this.input.value.length,this.input.value.length+1);
                    }
                }
                else{
                    const failed = locationResult.toFailed();
                    SelectedFailedEvent.dispatch(this.input,id,failed.status,failed.message);
                }
            }
        }
            
    };

    private bind = (location:LocationAddress)=>
    {
        if(location && this.attributeValues.options.bind_output_fields)
        {
            this.setOutputfield(this.output_fields.latitude,location.latitude.toString());
            this.setOutputfield(this.output_fields.longitude,location.longitude.toString());

            this.setOutputfield(this.output_fields.country,location.country);
            this.setOutputfield(this.output_fields.county,location.county);

            this.setOutputfield(this.output_fields.town_or_city,location.town_or_city);
            this.setOutputfield(this.output_fields.area,location.area);

            this.setOutputfield(this.output_fields.postcode,location.postcode);
            this.setOutputfield(this.output_fields.outcode,location.outcode);
        }
    };

    private setOutputfield = (fieldName:string|undefined, fieldValue:string) =>
    {
            if(!fieldName){
                return;
            }

            let element = document.getElementById(fieldName) as HTMLElement;
            
            if(!element){
                element = document.querySelector(fieldName) as HTMLElement;
            }

            if(element)
            {
               if(element instanceof HTMLInputElement){
                element.value = fieldValue;
               }
               else{
                element.innerText = fieldValue;
               }
            }
            return element;
    }

    handleKeyDownDefault = (event: KeyboardEvent)=>{
        
        let isPrintableKey = event.key && (event.key.length === 1 || event.key === 'Unidentified');
        if(isPrintableKey)
        {
            clearTimeout(this.filterTimer);
            
            this.filterTimer = setTimeout(() => 
            {
                if(this.input.value.length >= this.attributeValues.options.minimum_characters){
                    this.populateList();
                }
                else{
                    this.clearList(); 
                }
            },this.attributeValues.options.delay);
        }
       
    };

    

    handleKeyUp = (event: KeyboardEvent)=>{
        if(event.code === 'Backspace' || event.code === 'Delete')
        {
            if(event){
                const target =(event as Event).target
                if (target == this.input)
                {
                    if(this.input.value.length < this.attributeValues.options.minimum_characters)
                    {
                        this.clearList(); 
                    }
                    else 
                    {
                        this.populateList();
                    }
                } 
            }
        }
    };



    populateList = async ()=>{
            
            const locationOptions:Partial<LocationOptions> = {
                top : this.attributeValues.options.suggestion_count
            };
            
            if(this.attributeValues.options.filter){
                locationOptions.filter = this.attributeValues.options.filter;
            }
            
            const query = this.input.value?.trim();
            const result = await this.client.location(query, locationOptions);

            if(result.isSuccess){

                const success = result.toSuccess();
                const newItems:Node[] = [];

                if(success.suggestions.length)
                {
                  
                    for(let i = 0; i< success.suggestions.length; i++){
                        
                        const li = this.getListItem(success.suggestions[i]);
                        newItems.push(li);
                    }
                    if(this.list){
                        this.list.replaceChildren(...newItems);
                    }

                }
                else
                {
                    this.clearList(); 
                }
                SuggestionsEvent.dispatch(this.input,query, success.suggestions);
            }
            else
            {
                const failed = result.toFailed();
                SuggestionsFailedEvent.dispatch(this.input,query,failed.status,failed.message);
            }
    };

    
    clearList = ()=>{
        if(this.list){
            this.list.replaceChildren(...[]);
        }
    };

    getListItem = (suggestion:LocationSuggestion)=>
    {
        const option = document.createElement('OPTION') as HTMLOptionElement;

        let location = suggestion.location;

        option.innerText = location;
        option.dataset.id =suggestion.id;
        
        return option;
    };

    


}
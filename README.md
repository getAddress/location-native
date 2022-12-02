Javascript - Native Autocomplete.

## Install

###  From NPM
```
npm install getaddress-location-native
```
### Or CDN
```
<script src="https://cdn.getaddress.io/scripts/getaddress-location-native-1.0.0.min.js"></script>
```

## Usage
```
  <input type="text" id="textbox_id" > 
  <br/>

  <label>Postcode</label>
  <div><input id="postcode" type="text"></div>

  <label>Outcode</label>
  <div><input id="outcode" type="text"></div>

  <label>Area</label>
  <div><input id="area" type="text"></div>

  <label>Town or City</label>
  <div><input id="town_or_city" type="text"></div>

  <label>County</label>
  <div><input id="county" type="text"></div>

  <label>Country</label>
  <div><input id="country" type="text"></div>

  <label>Latitude</label>
  <div><input id="latitude" type="text"></div>

  <label>Longitude</label>
  <div><input id="longitude" type="text"></div>
  
  <script>
    getAddress.location("textbox_id","API Key");
  </script>
```
## Options
The full list of options, and their defaults:
```
getAddress.location(
        'textbox_id',
        'API_KEY',
        /*options*/{
          output_fields:{
            latitude:'latitude',  /* The id of the element bound to 'latitude' */
            longitude:'longitude',  /* The id of the element bound to 'longitude' */
            area:'area',/* The id of the element bound to 'area' */
            town_or_city:'town_or_city',/* The id of the element bound to 'town_or_city' */
            county:'county',  /* The id of the element bound to 'county' */
            country:'country',  /* The id of the element bound to 'country' */
            postcode:'postcode',  /* The id of the element bound to 'postcode' */
            outcode:'outcode'  /* The id of the element bound to 'outcode' */
          },
          id_prefix:'getAddress-autocomplete-native' ,  /* The id of the textbox and list container */
          delay:200, /* millisecond delay between keypress and API call */
          minimum_characters:2,  /* minimum characters to initiate an API call */
          select_on_focus:true,  /* if true, highlights textbox characters on focus*/
          alt_location_url:undefined,  /* alterative local location URL (when API key is not used) */
          alt_get_location_url:undefined,  /* alterative local get location URL (when API key is not used) */
          suggestion_count:6, /* number of retreived suggestions (max 20) */
          filter:undefined, /* the suggestion filter (see Location API)*/
          bind_output_fields:true, /* if true, bind the output_fields to the address*/
          input_focus_on_select:true,  /* if true, sets the focus to the textbox after selecting an address*/
          debug:false, /* if true, logs behavior */
          enable_get_location:true /* if true, retreives location on select */,
          set_default_output_field_names:true /* if true, defaults output field names to JSON field names*/
        }
    );
```
## Events
```
document.addEventListener("getaddress-location-native-suggestions", function(e){
    console.log(e.suggestions);
})

document.addEventListener("getaddress-location-native-suggestions-failed", function(e){
    console.log(e.status);
    console.log(e.message);
})

document.addEventListener("getaddress-location-native-selected", function(e){
    console.log(e.location);
})

document.addEventListener("getaddress-location-native-selected-failed", function(e){
    console.log(e.status);
    console.log(e.message);
})
```

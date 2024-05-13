import Location from "./Location";
import { Options } from "./Options";
import Client from 'getaddress-api';
import { OutputFields } from "./OutputFields";
import AttributeValues from "./AttributeValues";
class InstanceCounter {
    static add(location) {
        this.instances.push(location);
    }
}
InstanceCounter.instances = [];
function location(id, api_key, options) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    if (!id) {
        return;
    }
    const allOptions = new Options(options);
    let textbox = document.getElementById(id);
    if (!textbox) {
        textbox = document.querySelector(id);
    }
    if (!textbox) {
        return;
    }
    const client = new Client(api_key, undefined, undefined, allOptions.alt_location_url, allOptions.alt_get_location_url);
    const outputFields = new OutputFields(allOptions.output_fields);
    if (allOptions.set_default_output_field_names) {
        outputFields.area = (_a = outputFields.area) !== null && _a !== void 0 ? _a : "area";
        outputFields.town_or_city = (_b = outputFields.town_or_city) !== null && _b !== void 0 ? _b : "town_or_city";
        outputFields.county = (_c = outputFields.county) !== null && _c !== void 0 ? _c : "county";
        outputFields.country = (_d = outputFields.country) !== null && _d !== void 0 ? _d : "country";
        outputFields.postcode = (_e = outputFields.postcode) !== null && _e !== void 0 ? _e : "postcode";
        outputFields.outcode = (_f = outputFields.outcode) !== null && _f !== void 0 ? _f : "outcode";
        outputFields.latitude = (_g = outputFields.latitude) !== null && _g !== void 0 ? _g : "latitude";
        outputFields.longitude = (_h = outputFields.longitude) !== null && _h !== void 0 ? _h : "longitude";
    }
    const index = InstanceCounter.instances.length;
    const attributeValues = new AttributeValues(allOptions, index);
    const location = new Location(textbox, client, outputFields, attributeValues);
    location.build();
    InstanceCounter.add(location);
}
function destroy() {
    for (const instance of InstanceCounter.instances) {
        instance.destroy();
    }
    InstanceCounter.instances = [];
}
export { location, destroy, Options };
//# sourceMappingURL=Index.js.map
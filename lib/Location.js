var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SelectedEvent, SelectedFailedEvent, SuggestionsEvent, SuggestionsFailedEvent } from "./Events";
export default class Location {
    constructor(input, client, output_fields, attributeValues) {
        this.input = input;
        this.client = client;
        this.output_fields = output_fields;
        this.attributeValues = attributeValues;
        this.list = undefined;
        this.onInputFocus = () => {
            if (this.attributeValues.options.select_on_focus) {
                this.input.select();
            }
        };
        this.onInputPaste = () => {
            setTimeout(() => { this.populateList(); }, 100);
        };
        this.onInput = (e) => {
            if ((e instanceof InputEvent == false) && e.target instanceof HTMLInputElement) {
                const input = e.target;
                if (this.list) {
                    Array.from(this.list.querySelectorAll("option"))
                        .every((o) => {
                        if (o.innerText === input.value) {
                            this.handleSuggestionSelected(o);
                            return false;
                        }
                        return true;
                    });
                }
            }
        };
        this.onKeyUp = (event) => {
            this.debug(event);
            this.handleKeyUp(event);
        };
        this.onKeyDown = (event) => {
            this.debug(event);
            this.handleKeyDownDefault(event);
        };
        this.debug = (data) => {
            if (this.attributeValues.options.debug) {
                console.log(data);
            }
        };
        this.handleComponentBlur = (force = false) => {
            clearTimeout(this.blurTimer);
            const delay = force ? 0 : 100;
            this.blurTimer = setTimeout(() => {
                this.clearList();
            }, delay);
        };
        this.handleSuggestionSelected = (suggestion) => __awaiter(this, void 0, void 0, function* () {
            if (!this.attributeValues.options.enable_get_location) {
                this.clearList();
            }
            else {
                this.input.value = '';
                if (this.attributeValues.options.clear_list_on_select) {
                    this.clearList();
                }
                const id = suggestion.dataset.id;
                if (id) {
                    const locationResult = yield this.client.getLocation(id);
                    if (locationResult.isSuccess) {
                        let success = locationResult.toSuccess();
                        this.bind(success.location);
                        SelectedEvent.dispatch(this.input, id, success.location);
                        if (this.attributeValues.options.input_focus_on_select) {
                            this.input.focus();
                            this.input.setSelectionRange(this.input.value.length, this.input.value.length + 1);
                        }
                    }
                    else {
                        const failed = locationResult.toFailed();
                        SelectedFailedEvent.dispatch(this.input, id, failed.status, failed.message);
                    }
                }
            }
        });
        this.bind = (location) => {
            if (location && this.attributeValues.options.bind_output_fields) {
                this.setOutputfield(this.output_fields.latitude, location.latitude.toString());
                this.setOutputfield(this.output_fields.longitude, location.longitude.toString());
                this.setOutputfield(this.output_fields.country, location.country);
                this.setOutputfield(this.output_fields.county, location.county);
                this.setOutputfield(this.output_fields.town_or_city, location.town_or_city);
                this.setOutputfield(this.output_fields.area, location.area);
                this.setOutputfield(this.output_fields.postcode, location.postcode);
                this.setOutputfield(this.output_fields.outcode, location.outcode);
            }
        };
        this.setOutputfield = (fieldName, fieldValue) => {
            if (!fieldName) {
                return;
            }
            let element = document.getElementById(fieldName);
            if (!element) {
                element = document.querySelector(fieldName);
            }
            if (element) {
                if (element instanceof HTMLInputElement) {
                    element.value = fieldValue;
                }
                else {
                    element.innerText = fieldValue;
                }
            }
            return element;
        };
        this.handleKeyDownDefault = (event) => {
            let isPrintableKey = event.key && (event.key.length === 1 || event.key === 'Unidentified');
            if (isPrintableKey) {
                clearTimeout(this.filterTimer);
                this.filterTimer = setTimeout(() => {
                    if (this.input.value.length >= this.attributeValues.options.minimum_characters) {
                        this.populateList();
                    }
                    else {
                        this.clearList();
                    }
                }, this.attributeValues.options.delay);
            }
        };
        this.handleKeyUp = (event) => {
            if (event.code === 'Backspace' || event.code === 'Delete') {
                if (event) {
                    const target = event.target;
                    if (target == this.input) {
                        if (this.input.value.length < this.attributeValues.options.minimum_characters) {
                            this.clearList();
                        }
                        else {
                            this.populateList();
                        }
                    }
                }
            }
        };
        this.populateList = () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const locationOptions = {
                top: this.attributeValues.options.suggestion_count
            };
            if (this.attributeValues.options.filter) {
                locationOptions.filter = this.attributeValues.options.filter;
            }
            const query = (_a = this.input.value) === null || _a === void 0 ? void 0 : _a.trim();
            const result = yield this.client.location(query, locationOptions);
            if (result.isSuccess) {
                const success = result.toSuccess();
                const newItems = [];
                if (success.suggestions.length) {
                    for (let i = 0; i < success.suggestions.length; i++) {
                        const li = this.getListItem(success.suggestions[i]);
                        newItems.push(li);
                    }
                    if (this.list) {
                        this.list.replaceChildren(...newItems);
                    }
                }
                else {
                    this.clearList();
                }
                SuggestionsEvent.dispatch(this.input, query, success.suggestions);
            }
            else {
                const failed = result.toFailed();
                SuggestionsFailedEvent.dispatch(this.input, query, failed.status, failed.message);
            }
        });
        this.clearList = () => {
            if (this.list) {
                this.list.replaceChildren(...[]);
            }
        };
        this.getListItem = (suggestion) => {
            const option = document.createElement('OPTION');
            let location = suggestion.location;
            option.innerText = location;
            option.dataset.id = suggestion.id;
            return option;
        };
    }
    destroy() {
        this.destroyInput();
        this.destroyList();
    }
    destroyList() {
        if (this.list) {
            this.list.remove();
        }
    }
    destroyInput() {
        this.input.removeAttribute('list');
        this.input.removeEventListener('focus', this.onInputFocus);
        this.input.removeEventListener('paste', this.onInputPaste);
        this.input.removeEventListener('keydown', this.onKeyDown);
        this.input.removeEventListener('keyup', this.onKeyUp);
        this.input.removeEventListener('input', this.onInput);
    }
    build() {
        this.input.setAttribute('list', `${this.attributeValues.listId}`);
        this.input.addEventListener('focus', this.onInputFocus);
        this.input.addEventListener('paste', this.onInputPaste);
        this.input.addEventListener('keydown', this.onKeyDown);
        this.input.addEventListener('keyup', this.onKeyUp);
        this.input.addEventListener('input', this.onInput);
        this.list = document.createElement('DATALIST');
        this.list.id = this.attributeValues.listId;
        this.input.insertAdjacentElement("afterend", this.list);
    }
}
//# sourceMappingURL=Location.js.map
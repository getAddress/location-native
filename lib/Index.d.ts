import { Options } from "./Options";
declare function location(id: string, api_key: string, options: Partial<Options>): void;
declare function destroy(): void;
export { location, destroy, Options };

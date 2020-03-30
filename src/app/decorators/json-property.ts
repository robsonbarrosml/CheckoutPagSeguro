const jsonMetadataKey = "jsonProperty";
export interface IJsonMetaData {
    	name?: string
}
export function JsonProperty(metadata:string): any {
	return Reflect.metadata(jsonMetadataKey, <IJsonMetaData>{
		name: metadata
	});
}

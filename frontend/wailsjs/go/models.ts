export namespace archive {
	
	export class ZIPEntry {
	    name: string;
	    compressed_size: number;
	    uncompressed_size: number;
	    modified: string;
	
	    static createFrom(source: any = {}) {
	        return new ZIPEntry(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.compressed_size = source["compressed_size"];
	        this.uncompressed_size = source["uncompressed_size"];
	        this.modified = source["modified"];
	    }
	}

}

export namespace contracts {
	
	export class ToolError {
	    code: string;
	    message: string;
	
	    static createFrom(source: any = {}) {
	        return new ToolError(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.code = source["code"];
	        this.message = source["message"];
	    }
	}
	export class ToolResult___changeme_internal_core_archive_ZIPEntry_ {
	    success: boolean;
	    data?: archive.ZIPEntry[];
	    error?: ToolError;
	    trace_id: string;
	
	    static createFrom(source: any = {}) {
	        return new ToolResult___changeme_internal_core_archive_ZIPEntry_(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.success = source["success"];
	        this.data = this.convertValues(source["data"], archive.ZIPEntry);
	        this.error = this.convertValues(source["error"], ToolError);
	        this.trace_id = source["trace_id"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ToolResult___changeme_internal_infra_toolregistry_Tool_ {
	    success: boolean;
	    data?: toolregistry.Tool[];
	    error?: ToolError;
	    trace_id: string;
	
	    static createFrom(source: any = {}) {
	        return new ToolResult___changeme_internal_infra_toolregistry_Tool_(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.success = source["success"];
	        this.data = this.convertValues(source["data"], toolregistry.Tool);
	        this.error = this.convertValues(source["error"], ToolError);
	        this.trace_id = source["trace_id"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ToolResult_changeme_internal_core_text_WordStats_ {
	    success: boolean;
	    data?: text.WordStats;
	    error?: ToolError;
	    trace_id: string;
	
	    static createFrom(source: any = {}) {
	        return new ToolResult_changeme_internal_core_text_WordStats_(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.success = source["success"];
	        this.data = this.convertValues(source["data"], text.WordStats);
	        this.error = this.convertValues(source["error"], ToolError);
	        this.trace_id = source["trace_id"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ToolResult_float64_ {
	    success: boolean;
	    data?: number;
	    error?: ToolError;
	    trace_id: string;
	
	    static createFrom(source: any = {}) {
	        return new ToolResult_float64_(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.success = source["success"];
	        this.data = source["data"];
	        this.error = this.convertValues(source["error"], ToolError);
	        this.trace_id = source["trace_id"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ToolResult_int64_ {
	    success: boolean;
	    data?: number;
	    error?: ToolError;
	    trace_id: string;
	
	    static createFrom(source: any = {}) {
	        return new ToolResult_int64_(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.success = source["success"];
	        this.data = source["data"];
	        this.error = this.convertValues(source["error"], ToolError);
	        this.trace_id = source["trace_id"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ToolResult_int_ {
	    success: boolean;
	    data?: number;
	    error?: ToolError;
	    trace_id: string;
	
	    static createFrom(source: any = {}) {
	        return new ToolResult_int_(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.success = source["success"];
	        this.data = source["data"];
	        this.error = this.convertValues(source["error"], ToolError);
	        this.trace_id = source["trace_id"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ToolResult_string_ {
	    success: boolean;
	    data?: string;
	    error?: ToolError;
	    trace_id: string;
	
	    static createFrom(source: any = {}) {
	        return new ToolResult_string_(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.success = source["success"];
	        this.data = source["data"];
	        this.error = this.convertValues(source["error"], ToolError);
	        this.trace_id = source["trace_id"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace text {
	
	export class WordStats {
	    characters: number;
	    characters_no_spaces: number;
	    words: number;
	    sentences: number;
	    paragraphs: number;
	    estimated_reading_min: number;
	
	    static createFrom(source: any = {}) {
	        return new WordStats(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.characters = source["characters"];
	        this.characters_no_spaces = source["characters_no_spaces"];
	        this.words = source["words"];
	        this.sentences = source["sentences"];
	        this.paragraphs = source["paragraphs"];
	        this.estimated_reading_min = source["estimated_reading_min"];
	    }
	}

}

export namespace toolregistry {
	
	export class Tool {
	    id: string;
	    category: string;
	    status: string;
	    dependencies?: string[];
	    description?: string;
	
	    static createFrom(source: any = {}) {
	        return new Tool(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.category = source["category"];
	        this.status = source["status"];
	        this.dependencies = source["dependencies"];
	        this.description = source["description"];
	    }
	}

}


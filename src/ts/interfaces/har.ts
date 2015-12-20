export interface Creator {
	name: string
	version: string
}

export interface NameValueObj {
	name: string
	value: string
}

export interface Cookie {
	expires: Date
	httpOnly: boolean
	name: string
	secure: boolean
	value: string
}

export interface Request {
	bodySize: number
	cookies: Array<Cookie>
	headers: Array<NameValueObj>
	headersSize: number
	httpVersion: string
	method: string
	queryString: Array<NameValueObj>
	url: string
}

export interface Content {
	encoding: string
	mimeType: string
	size: number
	text: string
}

export interface Response {
	_transferSize: number
	bodySize: number
	content: Content
	cookies: Array<Cookie>
	headers: Array<NameValueObj>
	headersSize: number
	httpVersion: string
	redirectURL: string
	status: number
	statusText: string
}

export interface Entry {
	cache: Object
	connection: string
	pageref: string
	request: Request
	response: Response
	startedDateTime: Date
	time: number
	timings: Object
}

export interface PageTimings {
	onContentLoad: number
	onLoad: number
}

export interface Page {
	id: string
	pageTimings: PageTimings
	startedDateTime: Date
	title: string
}

export interface Har {
	label: string
	creator: Creator
	entries: Array<Entry>
	pages: Array<Page>
	version: string
}
export function convertEncryptedStreamIdToShareUrl(streamId) {
	const  link = window.location.origin+"/retrieve/" + streamId;
	console.log("Share link: "+ link)
	localStorage.setItem('message', link)
	localStorage.setItem('shareUrl', link)
	return link
}

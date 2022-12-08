//Chrome Android, Opera Android, not support
globalThis.addEventListener('connect', (connect_event) => {
	console.log('connection success!');
	
	const port = connect_event.ports[0];
	port.addEventListener('message', (event) => {
		console.log('communication_bridge___shareworker get message : ', event.data);
	});
	port.start();
});
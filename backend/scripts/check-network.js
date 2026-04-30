const net = require('net');

const host = 'cluster0.mlt3tkr.mongodb.net';
const port = 27017;

console.log(`Checking connection to ${host}:${port}...`);

const client = new net.Socket();
client.setTimeout(5000);

client.connect(port, host, () => {
    console.log('SUCCESS: Connection to Atlas port 27017 established!');
    client.destroy();
});

client.on('error', (err) => {
    console.error('FAILURE: Could not connect to Atlas.');
    console.error('Error:', err.message);
    client.destroy();
});

client.on('timeout', () => {
    console.error('FAILURE: Connection timed out.');
    client.destroy();
});

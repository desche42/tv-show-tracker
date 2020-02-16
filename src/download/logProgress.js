const prettyBytes = require('pretty-bytes');


/**
 * Thanks https://github.com/mafintosh/torrent-stream/issues/72
 * @param {*} file
 * @param {*} engine
 */
module.exports = function logProgress(file, engine) {
	var fileStart = file.offset;
	var fileEnd = file.offset + file.length;
	const pieceLength = engine.torrent.pieceLength;
	var firstPiece = Math.floor(fileStart / pieceLength);
	var lastPiece = Math.floor((fileEnd - 1) / pieceLength);

	const file_pieces_progess = Array.from(engine.bitfield.buffer)
		.map(n => leftpad(n.toString(2), 8, "0"))
		.join("")
		.split("")
		.slice(firstPiece, lastPiece - firstPiece);

	const downloaded_file_pieces_amount = file_pieces_progess.filter(n => n == 1)
		.length;
	const total_file_piceces = lastPiece - firstPiece;
	const percentage = downloaded_file_pieces_amount / total_file_piceces * 100;

	if (!(Math.floor(percentage) % 5) && (percentage - Math.floor(percentage) < 0.1) && percentage < 100) {
		debug(`${file.name}:  ${(percentage).toFixed(2)}% @${prettyBytes(engine.swarm.downloadSpeed())}/s`);
	}
}

function leftpad (str, len, ch) {
	str = String(str);
	let i = -1;
	if (!ch && ch !== 0) ch = ' ';
	len = len - str.length;
	while (++i < len) { str = ch + str; }
	return str;
}

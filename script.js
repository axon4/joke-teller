const jokeButton = document.getElementById('joke');
const rePlayButton = document.getElementById('replay');
const audio = document.getElementsByTagName('audio')[0];
const textArea = document.getElementById('textarea');
const copyButton = document.getElementById('copy');

// pass joke to VoiceRSS-API
function tellMe(joke) {
	VoiceRSS.speech({
		key: 'f27c75064c194476af76409e9a66bdfb',
		src: joke,
		hl: 'en-gb',
		v: 'Harry',
		r: 0,
		c: 'mp3',
		f: '44khz_16bit_stereo',
		ssml: false
	});
};

function toggleButtons(heard, rePlay = false) {
	jokeButton.disabled = !jokeButton.disabled;
	rePlayButton.disabled = !rePlayButton.disabled;

	if (!heard) {
		rePlayButton.hidden = true;
		textArea.hidden = true;
		copyButton.hidden = true;
	} else if (heard && rePlay) {
		rePlayButton.hidden = false;
		textArea.hidden = false;
		copyButton.hidden = false;
	};
};

async function getJokes() {
	const API = 'https://sv443.net/jokeapi/v2/joke/Programming,Miscellaneous?blacklistFlags=nsfw,religious,political,racist,sexist';
	let joke;

	try {
		const response = await fetch(API);
		const data = await response.json();

		if (data.setup || data.delivery) {
			joke = `${data.setup}... ${data.delivery}`;
		} else {
			joke = data.joke;
		};

		tellMe(joke);
		textArea.innerText = joke;
	} catch (error) {
		console.log('Error Getting Jokes:', error);
	};
};

function copy() {
	if (document.selection) {
		let range = document.body.createTextRange();

		range.moveToElementText(textArea);
		range.select().createTextRange();
		document.execCommand('copy');
	} else if (window.getSelection) {
		let range = document.createRange();

		range.selectNode(textArea);
		window.getSelection().addRange(range);
		document.execCommand('copy');
	};
};

jokeButton.addEventListener('click', () => {
	getJokes();
	toggleButtons(false);
});
audio.addEventListener('ended', () => {toggleButtons(true, true)});
rePlayButton.addEventListener('click', () => {
	audio.play();
	toggleButtons(true);
});
copyButton.addEventListener('click', copy);
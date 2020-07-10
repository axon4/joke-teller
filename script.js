const jokeButton = document.getElementById('joke');
const replayButton = document.getElementById('replay');
const audio = document.getElementsByTagName('audio')[0];
const textarea = document.getElementById('textarea');
const copyButton = document.getElementById('copy');

// Pass joke to VoiceRSS API
function tellMe(joke) {
	VoiceRSS.speech({
		key: 'f27c75064c194476af76409e9a66bdfb',
		src: joke,
		hl: 'en-gb',
		r: 0,
		c: 'mp3',
		f: '44khz_16bit_stereo',
		ssml: false
	});
};

function toggleButtons(heard, replay=false) {
	jokeButton.disabled = !jokeButton.disabled;
	replayButton.disabled = !replayButton.disabled;

	if (!heard) {
		replayButton.hidden = true;
		textarea.hidden = true;
		copyButton.hidden = true;
	} else if (heard && replay) {
		replayButton.hidden = false;
		textarea.hidden = false;
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
		textarea.innerText = joke;
	} catch (error) {
		console.log('Error Getting Jokes:', error);
	};
};

function copy() {
	if (document.selection) {
		let range = document.body.createTextRange();
		range.moveToElementText(textarea);
		range.select().createTextRange();
		document.execCommand("copy");
	} else if (window.getSelection) {
		let range = document.createRange();
		range.selectNode(textarea);
		window.getSelection().addRange(range);
		document.execCommand("copy");
	};
};

jokeButton.addEventListener('click', () => {
	getJokes();
	toggleButtons(false);
});
audio.addEventListener('ended', () => toggleButtons(true, true));
replayButton.addEventListener('click', () => {
	audio.play();
	toggleButtons(true);
});
copyButton.addEventListener('click', copy);
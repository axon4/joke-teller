const jokeButton = document.getElementById('button-joke');
const replayButton = document.getElementById('button-replay');
const audio = document.getElementById('audio');

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

function toggleButtons(heard=true, replay=false) {
	jokeButton.disabled = !jokeButton.disabled;
	replayButton.disabled = !replayButton.disabled;

	if (!heard) {
		replayButton.hidden = true;
	};
	if (heard && replay) {
		replayButton.hidden = false;
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
	} catch (error) {
		console.log('Error Getting Jokes:', error);
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
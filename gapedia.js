const togglePlayButton = document.getElementById("toggle-play");

const textContainer = document.getElementById("post-body");

let isPlaying = false;

let currentParagraph = 0;

const paragraphs = textContainer.querySelectorAll("post-body,.post-body");

let currentHighlightedSpan = null;

let currentWordIndex = 0;

togglePlayButton.addEventListener("click", function () {

  if (!isPlaying) {

      if (currentParagraph >= paragraphs.length) {

          // Reset ke awal jika sudah selesai

          currentParagraph = 0;

      }

      isPlaying = true;

      togglePlayButton.innerHTML = `

          <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">

              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>

          </svg>

          Jeda

      `;

      play();

  } else {

      isPlaying = false;

      togglePlayButton.innerHTML = `

          <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">

              <path d="M8 5v14l11-7z"/>

          </svg>

          Putar

      `;

      speechSynthesis.cancel();

  }

});

function play() {

  if (currentParagraph < paragraphs.length) {

      const paragraph = paragraphs[currentParagraph];

      const text = paragraph.textContent;

      speak(text);

  } else {

      isPlaying = false;

      togglePlayButton.innerHTML = `

          <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">

<path d="M8 5v14l11-7z"/>

          </svg>

          Putar

      `;

  }

}

function speak(text) {

  const words = text.split(" ");

  const rate = 1.2; // Atur kecepatan (contoh: 1.0 = 1x lebih cepat)

  function speakWord() {

      if (currentWordIndex < words.length) {

          if (currentHighlightedSpan) {

              unhighlightWord(currentHighlightedSpan);

          }

          const word = words[currentWordIndex];

          highlightWord(paragraphs[currentParagraph], currentWordIndex);

          const utterance = new SpeechSynthesisUtterance(word);

          utterance.lang = "id-ID"; // Atur bahasa yang sesuai

          utterance.rate = rate; // Atur kecepatan baca

          speechSynthesis.speak(utterance);

          utterance.onend = function () {

              currentWordIndex++;

              speakWord();

          };

      } else {

          // Setelah selesai membaca kata-kata, lanjutkan ke kata berikutnya

          currentWordIndex = 0;

          currentParagraph++;

          setTimeout(play, 500); // Jeda 500ms sebelum membaca paragraf berikutnya

      }

  }

  speakWord();

}

function highlightWord(paragraph, wordIndex) {

  const words = paragraph.textContent.split(" ");

  words[wordIndex] = `<span class="highlighttts">${words[wordIndex]}</span>`;

  paragraph.innerHTML = words.join(" ");

  currentHighlightedSpan = paragraph.querySelector(".highlighttts");

}

function unhighlightWord(span) {

  const text = span.textContent;

  span.outerHTML = text;

}

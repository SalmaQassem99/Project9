const playButton = document.querySelector(".play");
const homePage = document.querySelector(".homepage");
const gamePage = document.querySelector(".game");
const matchItems = document.querySelectorAll(
  ".match-cards .match-card .img-container .match-img"
);
const cardItems = document.querySelectorAll(
  ".cards .card .img-container .card-img"
);
const matchContainers = document.querySelectorAll(".match-cards .match-card");
const cardContainers = document.querySelectorAll(".cards .card");
const scoreItem = document.querySelector(".score");
const successModal = document.querySelector(".success-card");
const closeButton = document.querySelector(".closeModal");
const overlay = document.querySelector(".overlay");
let animationCounter = 0;
let counter = 0;
playButton.addEventListener("click", () => {
  document.querySelector("#start-audio").play();
  homePage.classList.add("hide");
  homePage.addEventListener("animationend", () => {
    homePage.classList.remove("hide");
    homePage.style.visibility = "hidden";
    gamePage.style.visibility = "visible";
    matchContainers.forEach((card) => {
      card.style.visibility = "visible";
      card.classList.add("show");
      card.addEventListener("animationend", () => {
        animationCounter++;
        card.classList.remove("show");
        if (animationCounter === matchContainers.length) {
          cardContainers.forEach((item) => {
            item.style.visibility = "visible";
            item.classList.add("show");
            item.addEventListener("animationend", () => {
              item.classList.remove("show");
            });
          });
        }
      });
    });
  });
});
cardItems.forEach((item) => {
  item.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("id", event.target.dataset.index);
  });
});
matchItems.forEach((matchItem) => {
  matchItem.addEventListener("dragover", (event) => {
    event.preventDefault();
  });
  matchItem.addEventListener("drop", (event) => {
    event.preventDefault();
    const index = event.target.dataset.index;
    const cardId = event.dataTransfer.getData("id");
    const cardItem = document.querySelector(
      `.cards .card .img-container .card-img[data-index="${cardId}"]`
    );
    if (index === cardId) {
      document.querySelector("#correct-audio").play();
      counter += 1;
      scoreItem.textContent = `${counter}/${matchItems.length}`;
      document
        .querySelector(":root")
        .style.setProperty(
          "--width",
          `${(100 / matchItems.length) * counter}%`
        );
      const matchedImg = document.querySelector(
        `.match-cards .match-card .img-container .matched-img[data-index="${cardId}"]`
      );
      matchedImg.src = cardItem.src;
      matchedImg.style.visibility = "visible";
      matchItem.parentElement.parentElement.classList.add("animate");
      matchItem.parentElement.parentElement.addEventListener(
        "animationend",
        () => {
          matchItem.parentElement.parentElement.classList.remove("animate");
        }
      );
      document
        .querySelector(`audio[id="${event.target.dataset.index}"]`)
        .play();
      cardItem.style.visibility = "hidden";
    } else {
      document.querySelector("#wrong-audio").play();
      cardItem.parentElement.parentElement.classList.add("vibrate");
      cardItem.parentElement.parentElement.addEventListener(
        "animationend",
        () => {
          cardItem.parentElement.parentElement.classList.remove("vibrate");
        }
      );
    }
    if (counter === matchItems.length) {
      const text = document.querySelector(".text-card .score-text");
      text.textContent = `${counter}/${matchItems.length}`;
      successModal.classList.add("show");
      overlay.classList.add("show");
    }
  });
});
document.addEventListener("click", function (event) {
  const isVisible =
    window.getComputedStyle(successModal).visibility === "visible";
  var isClickInside =
    successModal.contains(event.target) || event.target === closeButton;
  if (!isClickInside && isVisible) {
    successModal.classList.remove("show");
    setTimeout(() => {
      overlay.classList.remove("show");
    }, 400);
  }
});
document.querySelector(".closeModal").addEventListener("click", () => {
  successModal.classList.remove("show");
  setTimeout(() => {
    overlay.classList.remove("show");
  }, 400);
});
window.addEventListener("load", () => {
  scoreItem.textContent = `0/${matchItems.length}`;
});


// Define the behaviour for our new type of HTML element.
class AstroHeart extends HTMLElement {
  constructor() {
    super();
    let count = 0;

    const heartButton = this.querySelector('button');
    const countSpan = this.querySelector('span');

    // Each time the button is clicked, update the count.
    heartButton.addEventListener('click', () => {
      count++;
      countSpan.textContent = count.toString();
    });
  }
  hello() {
    console.log('Hello');
    }
}

// Tell the browser to use our AstroHeart class for <astro-heart> elements.
customElements.define('astro-heart', AstroHeart);

import html from './button.html';

const template = document.createElement('template');
template.innerHTML = html;

class Button extends HTMLElement {
	constructor() {
		super();

		this.attachShadow({ mode: 'open' });
		this.shadowRoot?.appendChild(template.content.cloneNode(true));
	}
}

customElements.define('Button', Button);

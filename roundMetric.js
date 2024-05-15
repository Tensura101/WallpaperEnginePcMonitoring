class RoundMetric extends HTMLElement {
    // # - private
    /**
     * @type {HTMLTemplateElement}
     */
    static #template = document.getElementById('round-metric');

	/**
	 * @type {HTMLHeadingElement}
	 */
	title;

	/**
	 * @type {HTMLSpanElement}
	 */
	value;

	/**
	 * @type {HTMLDivElement}
	 */
	container;

	mouseIsDown = false;

	width;
	height;
	#locationX;
	#locationY;

    constructor() {
        super();

		let templateContent = RoundMetric.#template.content;
		const shadowRoot = this.attachShadow({ mode: "open" });
		shadowRoot.appendChild(templateContent.cloneNode(true));

        this.title = shadowRoot.querySelector('#title');

        this.value = shadowRoot.querySelector('#value');
		
		this.container = shadowRoot.querySelector('#container');
		
		this.init();

		this.addEventListener('mousedown', () => this.mouseIsDown = true);
		this.addEventListener('mouseup', () => this.mouseIsDown = false);
		this.addEventListener('mousemove', this.handleDragging);
    }

	init(){
		this.title.innerText = this.getAttribute('metric-title');
	}

	/**
	 * 
	 * @param {MouseEvent} event 
	 * @returns 
	 */
	handleDragging(event) {
		if(!this.mouseIsDown){
			return;
		}
		
		let mouseX = event.screenX;
		let mouseY = event.screenY;
		this.locationX = mouseX - Math.round(this.container.clientWidth/2);
		this.locationY = mouseY - Math.round(this.container.clientHeight);

		console.log(event, this.container.clientWidth, this.container.clientHeight);

	}


	get locationX(){
		return this.#locationX;
	}
	get locationY(){
		return this.#locationY;
	}

	set locationX(value){
		this.#locationX = value;
		this.container.style.left = value + 'px';
	}

	set locationY(value){
		this.#locationY = value;
		this.container.style.top = value + 'px';
	}
}

customElements.define(
	"round-metric",
	RoundMetric
);
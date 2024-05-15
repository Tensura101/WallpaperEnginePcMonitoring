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

	/**
	 * @type {HTMLDivElement}
	 */
	resize;

	/**
	 * @type {HTMLDivElement}
	 */
	metric;

	isMouseDownOnComponent = false;
	isMouseDownOnResize = false;
	

	#width;
	#height;
	#locationX;
	#locationY;

	interval;

    constructor() {
        super();

		let templateContent = RoundMetric.#template.content;
		let shadowRoot = this.attachShadow({ mode: "open" });
		shadowRoot.appendChild(templateContent.cloneNode(true));

        this.title = shadowRoot.querySelector('#title');

        this.value = shadowRoot.querySelector('#value');
		
		this.container = shadowRoot.querySelector('#container');

        this.resize = shadowRoot.querySelector('#resize');

        this.metric = shadowRoot.querySelector('#metric');

		this.width = 250;
		this.height = 250;

		
		this.title.innerText = this.getAttribute('metric-title');


		this.handleResize = this.handleResize.bind(this);

		this.addEventListener('mousedown', () => this.isMouseDownOnComponent = true);
		document.addEventListener('mouseup', () => this.isMouseDownOnComponent = false);
		this.addEventListener('mousemove', this.handleDragging);

		this.handleResize
		this.resize.addEventListener('mousedown', () => this.isMouseDownOnResize = true);
		document.addEventListener('mouseup', () => this.isMouseDownOnResize = false);
		document.addEventListener('mousemove', this.handleResize);

		// this.interval = setInterval(() => this.updateValue(), 1000);
    }


	/**
	 * 
	 * @param {MouseEvent} event 
	 * @returns 
	 */
	handleDragging(event) {
		if(!this.isMouseDownOnComponent || this.isMouseDownOnResize){
			return;
		}
		
		let mouseX = event.clientX;
		let mouseY = event.clientY;
		this.locationX = mouseX - Math.round(this.container.clientWidth/2);
		this.locationY = mouseY - Math.round(this.container.clientHeight/2);

		console.log(event, this.container.clientWidth, this.container.clientHeight);
	}

	/**
	 * 
	 * @param {MouseEvent} event 
	 * @returns 
	 */
	handleResize(event) {
		if(!this.isMouseDownOnResize){
			return;
		}

		
		let mouseX = event.clientX;
		let mouseY = event.clientY;
		let width = Math.abs(this.locationX - mouseX);
		let height = Math.abs(this.locationY - mouseY);

		this.width = Math.min(width, height);
		this.height = Math.min(width, height);
	}

	updateValue(){
		fetch('http://localhost:5050')
			.then((response) => response.json())
			.then( (json) => {
				this.value.innerText = json.CPUMonitoring.Load + '%';
				console.log(json);
			})
			.catch((error) => {
				console.error(error);
			})
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


	get width(){
		return this.#width;
	}
	get height(){
		return this.#height;
	}

	set width(value){
		this.#width = value;
		this.metric.style.width = value + 'px';
	}

	set height(value){
		this.#height = value;
		this.metric.style.height = value + 'px';
	}
}

customElements.define(
	"round-metric",
	RoundMetric
);
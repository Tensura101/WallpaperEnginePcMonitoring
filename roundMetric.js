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

	hardware = '';
	type = '';
	unit = '';
	maxValueKey = undefined;

	storageUpdateEnabled = false;

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



		
		this.title.innerText = this.getAttribute('metric-title');

		this.hardware = this.getAttribute('hardware');
		this.type = this.getAttribute('type');
		this.unit = this.getAttribute('unit');
		this.maxValueKey = this.getAttribute('max-value-key');


		this.loadMetricStateFromSettings();


		this.handleResize = this.handleResize.bind(this);

		this.addEventListener('mousedown', () => this.isMouseDownOnComponent = true);
		document.addEventListener('mouseup', () => this.isMouseDownOnComponent = false);
		this.addEventListener('mousemove', this.handleDragging);

		this.handleResize
		this.resize.addEventListener('mousedown', () => this.isMouseDownOnResize = true);
		document.addEventListener('mouseup', () => this.isMouseDownOnResize = false);
		document.addEventListener('mousemove', this.handleResize);

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

	updateValue(value){
		this.value.innerHTML = value;
	}

	getSettingsFromStorage(subKey){
		let metricSettings = null;
		const key = `${this.hardware}.${this.type}`;
		try {
			metricSettings = localStorage.getItem(`${key}.${subKey}`)
		} catch (error) {
			console.log(error);
		}

		try {
			metricSettings = localStorage.get(`${key}.${subKey}`) //WallpaperEngine
		} catch (error) {
			console.log(error);
		}

		return metricSettings;
	}

	updateMetricSettings(){
		const key = `${this.hardware}.${this.type}`;
		let metricSettings = {
			width: this.width,
			height: this.height,
			locationX: this.locationX,
			locationY: this.locationY
		};
		
		console.log(metricSettings, Object.keys(metricSettings));
		for (const subKey of Object.keys(metricSettings)) {
			try {
				localStorage.setItem(`${key}.${subKey}`, metricSettings[subKey])
			} catch (error) {
				console.warn(error);
			}
	
			try {
				localStorage.set(`${key}.${subKey}`, metricSettings[subKey]) //WallpaperEngine
			} catch (error) {
				console.warn(error);
			}
		}

		

	}

	async loadMetricStateFromSettings(){
		this.storageUpdateEnabled = false;
		this.locationX = this.getSettingsFromStorage('locationX') ?? 600;
		this.locationY = this.getSettingsFromStorage('locationY') ?? 600;
		this.width = this.getSettingsFromStorage('width') ?? 250;
		this.height = this.getSettingsFromStorage('height') ?? 250;
		this.storageUpdateEnabled = true;
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
		if(this.storageUpdateEnabled){
			this.updateMetricSettings();
		}
	}

	set locationY(value){
		this.#locationY = value;
		this.container.style.top = value + 'px';
		if(this.storageUpdateEnabled){
			this.updateMetricSettings();
		}
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
		if(this.storageUpdateEnabled){
			this.updateMetricSettings();
		}
	}

	set height(value){
		this.#height = value;
		this.metric.style.height = value + 'px';
		if(this.storageUpdateEnabled){
			this.updateMetricSettings();
		}
	}
}

customElements.define(
	"round-metric",
	RoundMetric
);

/**
 * Repeats some text a given number of times.
 *
 * @param {number} min
 * @param {number} max
 * @param {number} number
 */
function clamp(min, max, number) {
return Math.min(Math.max(number, min), max);
};

function convertRange( value, domain, range ) { 
    return ( value - domain[ 0 ] ) * ( range[ 1 ] - range[ 0 ] ) / ( domain[ 1 ] - domain[ 0 ] ) + range[ 0 ];
}

// convertRange( 328.17, [ 300.77, 559.22 ], [ 1, 10 ] );

export class ScrollableRangeInput extends HTMLElement {
    $track
    $slider
    $contentSlot
    min = 0
    max= 100
    _value = 0

    valueInPixels = 0
    maxValueInPx = 0;

    slideAmount = 0;
    maxSlide = 0;
    maxScroll = 0;
    

    get scrollAmount(){
        return this.$scroller.scrollLeft;
    }
    ignoreNextScrollEvent = false;
    set scrollAmount(v){
        this.ignoreNextScrollEvent = true;
        this.$scroller.scrollTo(v, 0)
    }

    // The padding that is added to the left and right of the $scroller element
    scrollerPaddingInPx = 50;

    // rename this to isMouseMoverAttached
    isAnimationRunning = false;

    // Do not dispatch a change event when 

    boundingClientRect;

    static observedAttributes = ["min", "max", "value"];

    constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open' });
        const template = document.querySelector("#range-input-template");
        const clone = template.content.cloneNode(true);
        shadow.appendChild(clone) 

        this.$track = shadow.getElementById('track')
        this.$slider = shadow.getElementById('slider')
        this.$scroller = shadow.getElementById('scroller')
        this.$contentSlot = shadow.getElementById('content-slot')
        this.$line = shadow.getElementById('line')

        this.$scroller.addEventListener('scroll', this.scrollHandler.bind(this))


        const mopedListener = (e)=>{
            console.log('slottdchangees')
            const content = e.target.assignedNodes()[0]
            console.log(content)
            const {width, height} = content.getBoundingClientRect()
            this.maxValueInPx = width;
            this.maxScroll = width - this.boundingClientRect.width + this.scrollerPaddingInPx*2;  
            

            
            shadow.getElementById('overlay').style.height = height + 'px';
            this.$slider.style.height = height + 'px';
            // resizeObserver.observe(content)
            
        }

        this.$contentSlot.addEventListener('slotchange', mopedListener)

        const mouseMoveListener = (e)=>{
            this.lastMouseEvent = e;
        }
        const touchmoveListener = (e) =>{
            if (e.cancelable) {
                e.preventDefault()
            }
            this.lastMouseEvent = e.touches[0]
        }

        this.$slider.addEventListener('dragstart', e =>{
            if(e.cancelable){
                e.preventDefault()
            }
        })

        this.$slider.addEventListener('touchstart', (e)=>{
            document.addEventListener('touchmove', touchmoveListener, {passive: false})
            this.dataset['active'] = true;
            this.isAnimationRunning = true;
            this.lastMouseEvent = e.touches[0]
            window.requestAnimationFrame(this.render.bind(this))
            })
            
            const mouseDownListener = (e)=>{
                document.addEventListener('mousemove', mouseMoveListener, {passive: true})
                this.dataset['active'] = true;
                this.isAnimationRunning = true;
                this.lastMouseEvent = e;
                window.requestAnimationFrame(this.render.bind(this))
            }
                
            this.$slider.addEventListener('mousedown', mouseDownListener)
            this.$line.addEventListener('mousedown', mouseDownListener)

        const removeListeners = ()=>{
            document.removeEventListener('touchmove', touchmoveListener)
            document.removeEventListener('mousemove', mouseMoveListener)
            this.dataset['active'] = false;
            this.isAnimationRunning =false;
            this.previousTimeStamp = null;
        }
        // Unfortunately the unfying pointer API does not work here because pointer events are cancelled if you hold and drag
        document.addEventListener('mouseup', removeListeners)
        document.addEventListener('touchend', removeListeners)

        window.addEventListener('resize', this.resizeHandler.bind(this))

    }

    resizeHandler(){
        this.boundingClientRect = this.getBoundingClientRect()
        this.maxSlide = this.boundingClientRect.width - this.scrollerPaddingInPx*2;
        this.maxScroll = this.maxValueInPx - this.boundingClientRect.width + this.scrollerPaddingInPx*2; 

        if (this.slideAmount > this.maxSlide) {
            this.doStuff(this._value)
        }
    }

    // parseAttributes() {
    //     this.min = parseFloat(this.getAttribute('min'))
    //     this.max = parseFloat(this.getAttribute('max'))
    //     this.value = parseFloat(this.getAttribute('value'))
    // }

    connectedCallback(){
        // this.boundingClientRect = this.getBoundingClientRect()
        this.resizeHandler()
        // this.parseAttributes()
    }

    
    scrollHandler(e){
        if (this.ignoreNextScrollEvent) {
            this.ignoreNextScrollEvent = false;
            return
        }
        this.scrollAmount = this.$scroller.scrollLeft;
        this.valueInPixels = this.slideAmount + this.scrollAmount
        this._value = convertRange(this.valueInPixels, [0, this.maxValueInPx], [this.min, this.max])
        this.dispatchEvent(new Event('change'))
    }

    // set max(value){
    //     this.max = value
    // }
    // get max(){
    //     return this.max
    // }

    get value(){
        return this._value;
    }

    doStuff(v){
        this._value = v
        //position is the input value in pixels
        this.valueInPixels = convertRange(v, [this.min, this.max], [0, this.maxValueInPx])

        // When the value is set from the outside the slider should be positioned as close to the center as possible
        const preferredSliderValue = this.maxSlide / 2;
        // If we subtract the preferred Slider Value from the total Value and clamp between the allowed scrollValues ...
        this.scrollAmount = clamp(0, this.maxScroll, this.valueInPixels - preferredSliderValue)
        // ... we just have to move the slider by the amount that is left over.
        this.slideAmount = this.valueInPixels - this.scrollAmount
        this.$slider.style.transform = `translateX(${this.slideAmount}px)`
    }

    set value(v){
        // prevent update when value is the same
        // but also expose method 
        if (v == this._value){
            return;
        }
        this.doStuff(v)
    }


    // attributeChangedCallback(name, oldValue, newValue){
    //     console.log('attributechangedcallback')
    //     switch (name) {
    //         case 'min':
    //             this.min = parseFloat(newValue)
    //             break;
    //         case 'max':
    //             this.max = parseFloat(newValue)
    //         case 'value':
    //         this.value = parseFloat(newValue)
    //         default:
    //             break;
    //     }
    // }

    isAnimationFrameRequested = false;
    lastMouseEvent = null;
    

    render(timeStamp){
        if (! this.isAnimationRunning) {
            this.previousTimeStamp = null;
            return;
        }

        const elapsedTime = this.previousTimeStamp ? timeStamp - this.previousTimeStamp : 0;
        this.previousTimeStamp = timeStamp;

        // the relative position the the left edge of the host (this)
        const relativeMousePos = this.lastMouseEvent.clientX - this.boundingClientRect.left;

        this.slideAmount = clamp(0, this.maxSlide,  relativeMousePos - this.scrollerPaddingInPx)
        this.$slider.style.transform = `translateX(${this.slideAmount}px)`

        const scrollTrapWidth = 50;
        let direction = 0;
        let intensity = 0;
            if (relativeMousePos < 50 ){
                console.log('in left trap')
                intensity = (50 - relativeMousePos) / 50
                direction = -1
            }else if (relativeMousePos > this.boundingClientRect.width - scrollTrapWidth){
                intensity = (relativeMousePos - (this.boundingClientRect.width - 50)) / 50;
                direction = 1
            }

            
            const maxScrollSpeed = 2
            const scrollSpeedPxPerMs = maxScrollSpeed * intensity;
            const scrollBy = this.scrollAmount + elapsedTime * scrollSpeedPxPerMs *direction
            this.scrollAmount = clamp(0, this.maxScroll, scrollBy)

            this.scroll
            this.$scroller.scrollTo(this.scrollAmount, 0)

            this.valueInPixels = this.scrollAmount + this.slideAmount
            const newVal = convertRange(this.valueInPixels, [0, this.maxValueInPx], [this.min, this.max])

            if (this._value !== newVal) {
                this._value = newVal
                this.dispatchEvent(new Event('change'))
            }
            window.requestAnimationFrame(this.render.bind(this))
        }



}

customElements.define('scrollable-range-input', ScrollableRangeInput);

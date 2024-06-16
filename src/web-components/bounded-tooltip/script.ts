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

export class BoundedTooltip extends HTMLElement {
    isHidden: boolean = true;
    boundingElement!: HTMLElement;
    content: HTMLElement | null = null;
    // toolTip: HTMLDivElement;
    constructor() {
        super();
    }

    connectedCallback(){
        this.style.visibility = 'hidden'
        this.style.position = 'absolute'
        this.style.left = '0'
        this.style.top = '0'

        const boundsSelector = this.getAttribute('bounds')
        const contentSelector = this.getAttribute('for')
        
        if(! boundsSelector || !contentSelector){
            throw Error("You need to specify 'for' and 'bounds' Attributes when instantiating BoundedTooltip")
        }
        const boundingElement = document.querySelector(boundsSelector)
        if (!boundingElement){
            throw Error(`Cannot find bounds with Selector "${boundsSelector}"`)
        }
        this.boundingElement = boundingElement as HTMLElement;

        const content = this.querySelector(contentSelector)
        if (!content) {
            this.listenForChildren(contentSelector)
        }else{
            this.content = content as HTMLElement;
        }
    }

    listenForChildren(contentSelector: string){
        const observer = new MutationObserver((mutationsList, observer) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (let node of mutation.addedNodes) {
                        if (node instanceof HTMLElement && node.matches(contentSelector)) {
                            this.content = node;
                            observer.disconnect();
                            return;
                        }
                    }
                }
            }
        });
        observer.observe(this, {childList: true})
    }

    hide(){
        this.style.visibility = 'hidden';
        this.isHidden = true;
    }

    show(e){
        this.isHidden = false;

        if (!this.content) {
            throw new Error("Cannot show BoundedTooltip without adding a childNode first");
        }

        const popoverRect = this.content.getBoundingClientRect()
        const mapContainerRect = this.boundingElement.getBoundingClientRect()

        console.log(popoverRect, mapContainerRect)

        const minX = 0
        const maxX = mapContainerRect.width - popoverRect.width
        // $popover.style.top = 
        const translateX = clamp(minX, maxX, e.clientX - popoverRect.width/2) + 'px'

        let translateY = clamp(0, mapContainerRect.height, e.clientY - popoverRect.height/2) + 'px'

        // const popoverCanBePlacedAboveCursor = e.clientY > popoverRect.height
        // if (popoverCanBePlacedAboveCursor){
        //     translateY = e.clientY - popoverRect.height + 'px'
        // }else{
        //     translateY = e.clientY   + 'px'
        // }
        console.log(translateX, translateY)
        this.style.transform = `translate(${translateX}, ${translateY})`;
        this.style.visibility = 'visible'
    }

}

// export const BoundedTooltip = BoundedTooltip

// Tell the browser to use our AstroHeart class for <astro-heart> elements.
customElements.define('bounded-tooltip', BoundedTooltip);
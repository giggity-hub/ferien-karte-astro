

export interface CustomSelectOptions {
    [key: string]: {label: string}
}

export class CustomSelect extends HTMLElement{
    #options: CustomSelectOptions = {}
    #label: string = ""
    #value: string = ""
    $dropdownList: HTMLElement;
    $button: HTMLButtonElement;
    #isOpen = false;

    get value(){
        return this.#value;
    }
    set value(v){
        this.#value = v
        this.#label = this.options[v].label
        this.render()
    }
    
    constructor(){
        super()

        const $template = <HTMLTemplateElement>document.getElementById('custom-select-template')
        const shadow = this.attachShadow({mode: "open"})
        shadow.appendChild($template.content.cloneNode(true))

        this.$dropdownList = <HTMLUListElement>shadow.querySelector('.options')
        this.$button = <HTMLButtonElement>shadow.querySelector('button')

        this.$button.addEventListener('click', this.toggleOpen.bind(this))

        const clickOutsideHandler = (event: MouseEvent)=>{
            // can't use currentTarget because the event is emitted from shadow DOM so the currentTarget to the light DOM will always be the host
            const currentTarget = <Node>event.composedPath()[0];
            const isClickInside = (currentTarget === shadow) || shadow.contains(currentTarget)
            if (!isClickInside){
                this.close()
            }
        }
        // Pointerdown is better than click because it also handles touch and canceled inputs
        document.addEventListener('pointerdown', clickOutsideHandler)
    }

    render(){

        this.$button.textContent = this.#label
        this.$dropdownList.innerHTML = '';

        Object.keys(this.options || {}).forEach(key => {
            let option = this.options[key];
            let $option = document.createElement('li');
            if (this.#value && this.#value == key){
                $option.classList.add('is-selected')
            }
            // $option.textContent = option.label;
            const $btn = document.createElement('div')
            $btn.textContent = option.label;
            $option.append($btn)
            $option.addEventListener('click', ()=>{
                this.#value = key;
                this.#label = option.label;
                // close triggers a rerender;
                this.close()
                this.render()
                this.dispatchEvent(new Event('change'))

            })

            this.$dropdownList.appendChild($option);
        });
    }

    set isOpen(v){
        this.#isOpen = v;
        if (v) {
            this.$dropdownList.classList.add('is-open')
        }else{
            this.$dropdownList.classList.remove('is-open')
        }
        // this.render()
    }
    get isOpen(){
        return this.#isOpen;
    }

    static get helloBoi(){
        return 1000000;
    }

    #determinePopoverPlacement(){
        const rect = this.getBoundingClientRect()
        const distanceToViewPortBottom = window.innerHeight - rect.top - rect.height
        this.dataset.place = rect.top > distanceToViewPortBottom ? "above" : "below"
    }

    toggleOpen(){
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.#determinePopoverPlacement()
        }
        this.render()
    }
    close(){
        this.isOpen = false;
    }

    get options(){
        
        return this.#options
    }

    set options(v){
        
        this.#options = v;
        this.render()
    }
}

customElements.define('custom-select', CustomSelect)
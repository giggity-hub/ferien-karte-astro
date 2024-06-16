
class MapPopover extends HTMLElement{
    coatOfArms!: HTMLImageElement
    name!: HTMLHeadingElement;
    holidayType!: HTMLParagraphElement;
    holidayStart!: HTMLSpanElement;
    holidayEnd!: HTMLSpanElement;

    constructor(){
        super();

        const $template = <HTMLTemplateElement|null>document.querySelector('#map-popover-template')
        if (!$template) {
            throw Error("cannot find template with id 'map-popover-template' for MapPopover")
        }
        // const shadow = this.attachShadow({mode: "open"})
        this.append($template.content.cloneNode(true))

        const props = ["coatOfArms", "name", "holidayType", "holidayStart", "holidayEnd"] as const;
        for (const propName of props){
            const $el = this.querySelector(`[data-property="${propName}"]`) as HTMLElement | null;
            if (!$el) {
                throw Error("Cannot find Element with data-property inside MapPopover")
            }
            (this[propName] as HTMLElement) = $el;
        }
    }

    render(bundesland: Bundesland, holiday: Holiday | null){
        this.coatOfArms.src = bundesland.coatOfArms;
        this.name.textContent = bundesland.name;
        console.log(holiday)
        if(holiday){
            this.holidayType.textContent = holiday.holiday_type;
            this.holidayStart.textContent = holiday.start;
            this.holidayEnd.textContent = holiday.end;
            this.classList.add('has-current-holiday')
        }else{
            this.classList.remove('has-current-holiday')
        }
        
    }

}

customElements.define('map-popover', MapPopover)
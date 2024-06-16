export function clamp(min: number, max: number, number: number) {
    return Math.min(Math.max(number, min), max);
};

export function convertRange(value: number, domain: [number, number], range: [number, number] ) { 
    return ( value - domain[ 0 ] ) * ( range[ 1 ] - range[ 0 ] ) / ( domain[ 1 ] - domain[ 0 ] ) + range[ 0 ];
};
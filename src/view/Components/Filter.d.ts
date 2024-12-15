export type Filter<T extends 'search' | 'checkbox'> = {
    name: string,
    id: string,
    type: T,
    function: (npcs: (Actor | CompendiumIndexData)[], arg: any) => Actor[]
    value?: any;
}
import React, {useCallback, useState} from "react";
import ReactSelect from "react-select";
import CreatableSelect from "react-select/creatable";

type OptionType = {
    label: string;
    value: string | number;
}

export interface ReactSelectInterface {
    target: { name: string | null; value: number | string | null };
}

type Props = {
    name: string;
    value: string | undefined | number;
    options: OptionType[];
    className: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    onChange: (event: any) => void;
}

const Select = (props: Props) => {
    const { options, value, name, onChange, ...otherProps} = props;

    const onChangeFunction = (event: any) =>{
        let { value } = event;
        onChange({target: {name: name, value: value ?? ""}});
    }

    let selected = null;
    if(options){
        options && options.map((pair)=>{
            if(pair.value === value){
                selected = pair;
            }
        })
    }

    return (
        <>
            <ReactSelect {...otherProps}
                         isMulti={false}
                         name={name}
                         options={options}
                         value={selected}
                         onChange={onChangeFunction}/>
        </>
    );
}

export interface ReactMultiSelectInterface {
    target: {
        name: string | null;
        value: string[];
    }
}

type MultiSelectProps = {
    name: string;
    selected: string[];
    options: string[];
    placeholder?: string;
    className?: string;
    required?: boolean;
    disabled?: boolean;
    onChange: (event: ReactMultiSelectInterface) => void;
}

type MultiSelectTagProps = {
    name: string;
    value: string[];
    options: string[];
    placeholder?: string;
    className?: string;
    required?: boolean;
    disabled?: boolean;
    onChange: (event: ReactMultiSelectInterface) => void;
}

export const MultipleSelect = (props: MultiSelectProps) => {
    const { options, name, selected, onChange, ...otherProps } = props;

    const onChangeFunction = (event: any) =>{
        let value = (event && event.map((option)=> option.value)) ?? [];
        onChange({target: {name: name, value: value}});
    }

    return (
        <>
            <ReactSelect {...otherProps}
                         isMulti={true}
                         value={selected && selected.map(option=> ({label: option, value: option}))}
                         options={options && options.map(option=> ({label: option, value: option}))}
                         onChange={onChangeFunction}/>
        </>
    );
}

export const MultipleSelectTag = (props: MultiSelectTagProps) => {
    const { options, name, value, onChange, className, ...otherProps } = props;

    const onChangeFunction = (event: any) =>{
        let value = (event && event.map((option)=> option.value)) ?? [];
        onChange({target: {name: name, value: value}});
    }

    const [ searchKeyword, setSearchKeyword ] = useState<string>("");
    const handleInputChange = useCallback((typedOption) => {
        if (typedOption.length > 0 ) {
            setSearchKeyword(typedOption)
        } else {
            setSearchKeyword("")
        }
    }, []);

    return (
        <>
            <CreatableSelect {...otherProps}
                             className={`${className ?? ""} ${searchKeyword.length > 0 ? "" : "hide-options"}`}
                             isMulti={true}
                             onInputChange={handleInputChange}
                             value={value && value.map(option=> ({label: option, value: option}))}
                             options={GetSortedValue(options,searchKeyword)}
                             onChange={onChangeFunction}/>
        </>
    );
}

function GetSortedValue(options: any, keyword: string): any[]{
    if(keyword && keyword.length > 0 && options){
        let keywordLength = keyword.length;
        let searched: any[] = [], notSearched: any[] = [];
        try {
            options = options.slice().sort((a, b) => a.length - b.length)
        } catch (e) {
        }
        options.map((option)=>{
            if(option.slice(0,keywordLength).toLowerCase() === keyword.toLowerCase()){
                searched.push({label: option, value: option});
            } else {
                notSearched.push({label: option, value: option});
            }
        })

        return([...searched,...notSearched])
    }
    return([]);
}

export default Select;

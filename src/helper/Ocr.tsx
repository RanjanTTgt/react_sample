import _ from "lodash";

export const convertToBase64 = (src: any) => new Promise((resolve, reject) => {
    if (src) {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            if(typeof(reader.result) === "string"){
                const b64data = reader.result.replace(/^data:image\/(png|jpg);base64,/, '');
                resolve(b64data);
            }
        });
        reader.readAsDataURL(src);
    }
})

export function IgnoreVariables(data: string, variables: string[]) {
    variables.map((variable) => {
        let index = data.toLowerCase().indexOf(variable.toLowerCase());
        while (index != -1) {
            data = `${data.slice(0, index)}${data.slice(index + variable.length)}`
            index = data.toLowerCase().indexOf(variable.toLowerCase());
        }
    })
    return data;
}

export const filterText = (data: string, startKey: RegExp, endKey: RegExp) => {
    let startRegex = data.toLowerCase().match(startKey);
    let endRegex = data.toLowerCase().match(endKey);
    if (startRegex && startRegex.index != null && endRegex && endRegex.index != null) {
        if (startRegex.index != -1 && endRegex.index != -1 && startRegex.index < endRegex.index) {
            return (data.slice(startRegex.index, endRegex.index).trim());
        }
    }
    return data;
}

type bracesType = "[]" | "()" | "{}";
const ReplaceBracesData = (data: string, braces: bracesType) => {
    let startIndexArray: number[] = [], endIndexArray: number[] = [], newData: string = data,
        startIndex: number = newData.indexOf(braces[0]),
        endIndex: number = newData.indexOf(braces[1]);

    while (startIndex > -1) {
        startIndexArray.push(startIndex);
        startIndex = data.indexOf(braces[0], startIndex + 1);
    }
    while (endIndex > -1) {
        endIndexArray.push(endIndex);
        endIndex = data.indexOf(braces[1], endIndex + 1);
    }
    let indexArrayData = [];

    for (let i = 0; i < startIndexArray.length; i++) {
        let startIndex: number = startIndexArray[i];
        let endIndex: number = endIndexArray[0]
        let nextStartIndex: number = startIndexArray[i + 1];
        if (!nextStartIndex) {
            nextStartIndex = data.length;
        }

        if (startIndex < endIndex && endIndex < nextStartIndex) {
            indexArrayData.push([startIndex, endIndex]);
            startIndexArray = startIndexArray.filter(obj => obj != startIndex);
            endIndexArray = endIndexArray.filter(obj => obj != endIndex);
            i = -1;
        }
    }

    _.map(indexArrayData, ([start, end]) => {
        const pd = data.slice(start, end + 1);
        let value = data.slice(start + 1, end).trim();
        if (value && value.indexOf(",") > -1) {
            data = data.replace(pd, `,${value},`);
        }
    });

    return data;
}

export function convertOcrValue(data: string, variables?: string[], startKey?: RegExp, endKey?: RegExp,) {
    if (startKey && endKey) {
        data = filterText(data, startKey, endKey);
    }
    if (variables && variables.length > 0) {
        data = IgnoreVariables(data, variables);
    }

    data = data.replace(/\n/g, " ").replace(/ and | AND | And /g, ",");
    data = ReplaceBracesData(data, "[]");
    data = ReplaceBracesData(data, "()");

    let newDataArray: string[] = [], convertedData: string = "";
    _.map(data.split(","),async (d, i) => {
        convertedData = d.trim();
        if (d.includes("(") && d.includes(")") || d.includes("[") && d.includes("]")) {
            convertedData = getConvertedData(d,"(", ")");
            convertedData = getConvertedData(convertedData,"[", "]");
        } else if (d.includes("(") || d.includes(")") ||d.includes("[") || d.includes("]")) {
            convertedData = d.split("(").join("").split(")").join("").trim();
            convertedData = convertedData.split("[").join("").split("]").join("").trim();
        }
        if (convertedData && convertedData.length > 0) {
            newDataArray.push(convertedData)
        }
    });

    return (newDataArray);
}

function getConvertedData(data: string, startBrace: string, endedBrace: string){
    let startIndex = data.indexOf(startBrace);
    if (startIndex > 0) {
        return data.trim();
    } else {
        return data.split(startBrace).join("").split(endedBrace).join("").trim();
    }
}

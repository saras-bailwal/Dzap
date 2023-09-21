import React, { useEffect, useState } from "react";
import { Textarea } from "./Textarea";
import Button from "@mui/material/Button";

export default function App() {

  let arryofWrongAmt: any = [];
  let arryofWrongAdd: any = [];
  let keyValofData: any = [];
  let mapz: any = {};
  const [value, setValue] = useState("");
  const [amtCheckArr, setAmtCheckArr] = useState<any>([]);
  const [addCheckArr, setAddCheckArr] = useState<any>([]);
  const [baseObjDetails, setBaseObjDetails] = useState<any>([]);
  const [keyName, setKeyDupIndx] = useState<any>({});
  const [validated, setValidatedFlag] = useState(false);

  const validateData = () => {
    let newVal = value.replace(/\r\n/g, "\n").split("\n");
    if (newVal.length === 1) alert("Please enter valid details!");
    let BASELIMITER = [" ", ",", "="];
    newVal.forEach((el: any, indx: any) => {
      BASELIMITER.map((item: any) => {
        if (el.indexOf(item) > -1) {
          let l1: any = el.split(item);
          let obj1: any = {};
          if (!l1[0].startsWith('0x') && l1[0].length !== 42) {
            arryofWrongAdd.push("Line "+(indx+1));
          }
          if (isNaN(l1[1])) {
            if (!arryofWrongAmt.includes("Line "+(indx+1))) arryofWrongAmt.push("Line "+(indx+1));
          } else {
            const objIfExist = keyValofData.some((x: any) => x.add === l1[0] && x.amt === parseInt(l1[1]));
            if (!objIfExist) {
              obj1[l1[0]] = parseInt(l1[1]);
              obj1["add"] = l1[0];
              obj1["amt"] = parseInt(l1[1]);
              keyValofData.push(obj1);
            }
          }
        }
      })
      setAddCheckArr([...arryofWrongAdd]);
      setAmtCheckArr([...arryofWrongAmt]);
      setBaseObjDetails([...keyValofData]);
    });

    
    for (var i = 0; i < keyValofData.length; i++) {
        var element = keyValofData[i].add;

        if (!mapz[element]) {
            mapz[element] = [i+1];
        }
        else {
            mapz[element].push(i+1);
        }
    }
    setKeyDupIndx({...mapz})
    setValidatedFlag(true);
  };

  const keepTheFirst = () => {
    let yy = Object.values(keyName);
    let cc: any = [];
    yy.forEach((el: any) => {
      let elm = el[0]-1;
      cc.push(baseObjDetails[elm]['add'] + " " + baseObjDetails[elm]['amt'])
    })
    setValue(cc.join("\n"));
    setKeyDupIndx([]);
  };

  const combineDuplicates = () => {
    let mm = Object.values(keyName);
    let dd: any = [];
    mm.forEach((el: any) => {
      if (el.length === 1) {
        dd.push(baseObjDetails[el[0]-1]['add'] + " " + baseObjDetails[el[0]-1]['amt'])
      } else {
        let baseAmt = 0;
        let baseAdd = "";
        el.forEach((l: any) => {
          baseAmt += baseObjDetails[l-1]['amt'];
          baseAdd = baseObjDetails[l-1]['add'];
        })
        dd.push(baseAdd + " " + baseAmt)
      }
    })
    setValue(dd.join("\n"));
    setKeyDupIndx([]);
  };

  return (
    <div className="App">
      Addresses with Amounts
      <Textarea
        name="test-textarea"
        value={value}
        onValueChange={(value: string) => setValue(value)}
        numOfLines={10}
      />
      Separated by ',' or '' or '='
      <ul>
        {amtCheckArr.map((amt: any) => (
          <li style={{color:'red'}}>{amt} wrong amount entered</li>
        ))}
      </ul>
      <ul>
        {addCheckArr.map((add: any) => (
          <li style={{color:'red'}}>{add} wrong addresses entered</li>
        ))}
      </ul>
      {(validated && Object.keys(keyName).length > 0) ?
        <>
        <ul>
        {
        Object.keys(keyName).map((x) => (
            (keyName[x].length > 1) ? 
            <>
            <li style={{color:'red'}}>Address {x} encountered duplicate in Line {keyName[x].join(" | ")}</li>
            </>
          : null
        ))
        }
        {
          (validated && Object.keys(keyName).length > 0)?
            <>
            <div style={{display: 'flex', justifyContent: "space-around"}}>
            <div>Duplicated</div><div>
                <Button variant="text" onClick={keepTheFirst}>
                  Keep the first one
                </Button>
                <span> | </span>
                <Button variant="text" onClick={combineDuplicates}>
                  Combine Balance
                </Button>
              </div>
            </div>
           </>
              : null
        }
        </ul>
       </>
      : null}
       <Button variant="contained" size="large" onClick={validateData}>
        Validate Data
      </Button>
    </div>
  );
}

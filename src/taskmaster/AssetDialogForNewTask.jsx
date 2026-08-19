
import { Dialog } from "primereact/dialog";
import AssetTree from "../components/shared/tree/AssetTree.component";
import { MultiSelect } from "primereact/multiselect";
import { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export default function AssetDialogForNewTask(props) {
  
    const toast = useRef(null);
    // const [selectedAssets,setSelectedAssets] = useState([]);
    const [selectedAsset,setSelectedAsset] = useState({});
    // const [count,setCount] = useState(0);
    const [extraAssets,setExtraAssets] = useState([]);


    let {
    onHide,
    treeData,
    logbooks,
    selectedLogbook,
    setSelectedLogbook,
    setSelectedNode,
    assetDialogVisible,
    selectedAssets,
    setSelectedAssets,
    activityName,
    count,
    setCount,
    assetData,
    setAssetData 
  } = props;

  console.log('TREE DATA',treeData);

  console.log(selectedLogbook);

  console.log(assetData);


  useEffect(() => {

    setCount(0);

  },[]);


  useEffect(() => {


    if(selectedAssets){

        if(typeof setAssetData === 'function')
        setAssetData(selectedAssets.map(asset => {
          
          return {assetName : asset.assetName,
        logbook : selectedLogbook.lookbookname}
    }));  

    }


  },[selectedAssets])

  
  const logbookDropdoenHandler = (event) => {


          if(count === 0){
          
            setSelectedLogbook(event.target.value);

          }
          else {
          if(selectedLogbook.lookbookname === event.target.value.lookbookname){
          
            setSelectedLogbook(event.target.value);
             
          }
          else {
            toast.current.show({severity:'warn', summary: 'Selected logbook : '+selectedLogbook.lookbookname, detail:'Logbook must be same for all assets', life: 3000});

          }

        }

        console.log('Prev Selected logbook',selectedLogbook,'DropDown Select',event.target.value);

      }


  console.log(assetData);


  return ( 
    <Dialog onHide={onHide} visible={assetDialogVisible} style={{ width: "50rem", height: "50rem" }}>

        <Toast ref={toast} />

      {/* <h3>Type of Asset</h3> */}

      {/* <Dropdown
              value={assetGroup}
              placeholder="Select reviewer"
              options={props.assetGroup ? props.assetGroup : ''}
              optionLabel="GroupName"
              required
              onChange={(e) => {
                
                setAssetGroup(e.value);

                console.log(e.value);

              }}
            /> */}

      {/* <h3>Logbook</h3>
            <Dropdown
              value={assetGroup}
              placeholder="Select Logbook"
              options={logbooks ? props.logbooks : ''}
              optionLabel="GroupName"
              required
              onChange={(e) => {
                
                setAssetGroup(e.value);

                console.log(e.value);

              }}
            />  */}

            <h2 style={{textAlign : 'center',position : 'relative',bottom : '2rem',paddingTop : 30}}>Activity : <i>{activityName}</i></h2>

            <div style={{width : '20rem'}}>
                <h3>Select an Asset</h3>
      <AssetTree
        data={treeData}
        setSelectedNodeFn={(node) => {
          console.log("selected node", node);

          setSelectedNode(node);

          setSelectedAsset(node);

          // Resetting the selected logbooks every time a new asset is selected
          // setSelectedLogbook('');
        }}
      />
    </div>

        <div style={{position : 'absolute', left : '30rem',top : '10rem'}} >
    <h3 >Select Logbook</h3>
      <Dropdown
        options={logbooks}
        name='Select Logbooks'
        optionLabel="lookbookname"
        value={selectedLogbook}
        onChange={(e) => {

           logbookDropdoenHandler(e); 

        }}
        placeholder="Select Logbooks"
     />
    </div>

      

    <Button type='button' label='Add asset' disabled={Object.keys(selectedAsset).length === 0} onClick={() => {

            // setAssetDialogVisible(false);

            console.log(selectedAsset); 

            console.log(selectedLogbook);

            if(count !== 0 && (Object.keys(selectedLogbook).length !== 0) && logbooks){ 
               
              let logbookNames = logbooks.map(logbook => logbook.lookbookname);

               if(!logbookNames.includes(selectedLogbook.lookbookname)){

                toast.current.show({severity:'info', summary: 'Info', detail:'Please select a logbook', life: 3000});

                return;
              
              };

              }

            if(selectedAssets)
            setSelectedAssets(selectedAssets.concat({assetName : selectedAsset.assetName, lookbookname : selectedLogbook}));

            setCount(1);

    }} style={{position : 'relative',top : '3rem',left : '7rem'}}
    />


    <Button type='button' label='Reset Form' onClick={() => {

          setSelectedAssets([]);

          setSelectedLogbook({});

          setCount(0);

          setAssetData([]);

          toast.current.show({severity:'info', summary: 'Info', detail:'Form Reset', life: 3000});
      
    }} style={{position : 'relative',top : '3rem',left : '25rem'}}/>

    {console.log('AssetData',assetData)}

    <DataTable value={assetData} style={{position : 'relative',top : '5rem'}}>
      
      <Column field="assetName" header='Asset Name'/>
      <Column field="logbook" header='Logbook'/>

    </DataTable>

        {console.log('ASSETS',selectedAssets)}
        {console.log('selected logbook',selectedLogbook)}
        {console.log('selected asset',selectedAsset)}
        {console.log('logbooks',logbooks)}
        {console.log('count',count)}
        {console.log('Extra assets',extraAssets)}

    </Dialog>
  );
 
}

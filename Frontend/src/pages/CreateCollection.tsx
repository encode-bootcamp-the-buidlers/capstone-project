import React, {useEffect, useState} from "react";

//Connectin to IPFS via infura
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

export function CreateCollection() {
    //state variables
    const [name, setName] = useState("") // name of collection
    const [files, setFiles] = useState([]) //collection items stored as an array of buffers

    //funtions
    //function which captures files which will be uploaded to IPFS
    // to do 
    const captureFile = (event : any) => {
        event.preventDefault()

        const reader = new window.FileReader()

        const newfiles = [...files] //load in existing files

        for(const file in event.target.files){
            //transform to files into buffer
            // lower code does not work due to ts
            /*reader.readAsArrayBuffer(file)
            reader.onloadend = () => {
                newfiles.push(Buffer(reader.result)) 
            }*/
        }
        
        setFiles(newfiles)
    }

    //function uploads collection to IPFS and stores the respective keys on ethereum
    const createCollection = async () => {
        try {
            for(const file in files){
                var decentralFile = await ipfs.add(file) // Adding file inside state variable 'buffer' to IPFS using the IPFS connection from above
                //store the key (aka cid) to the files in IPFS on the ethereum blockchain
                    // to do
                console.log("CID of IPFS file:", decentralFile.path)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return( 
        <div>
            <label htmlFor='input-name'>Collection name: </label>
            <input name='input-name' type="text" onChange={(e) => setName(e.target.value)}/>

            <label htmlFor='input-file'>Select your collection items: </label>
            <input name='input-file' type="file" onChange={captureFile}/>
            <button type="button" onClick={createCollection}>Create your colletion</button>
        </div>
    );
}
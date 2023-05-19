import {useState} from 'react'
import {Data} from './Components/Data'
import * as XLSX from 'xlsx'

function App() {


  
  // on change states
  const [excelFile, setExcelFile]=useState(null);
  const [excelFileError, setExcelFileError]=useState(null);  
 
  // submit
  const [excelData, setExcelData]=useState(null);
  // it will contain array of objects

  // handle File
  const fileType=['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  const handleFile = (e)=>{
    let selectedFile = e.target.files[0];
    if(selectedFile){
      console.log(selectedFile.type);
      if(selectedFile&&fileType.includes(selectedFile.type)){
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload=(e)=>{
          setExcelFileError(null);
          setExcelFile(e.target.result);
        } 
      }
      else{
        setExcelFileError('Please select only excel file types');
        setExcelFile(null);
      }
      // console.log(selectedFile.type);
    }
    else{
      console.log('plz select your file');
    }
  }

  // submit function
  const handleSubmit=(e)=>{
    e.preventDefault();
    if(excelFile!==null){
      const workbook = XLSX.read(excelFile,{type:'buffer'});
      const worksheetName = workbook.SheetNames[0];
      const worksheet=workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      console.log("data"+data);
      setExcelData(data);
    }
    else{
      setExcelData(null);
    }
  }
  let jsonData = "";
   if (!excelData || excelData.length === 0) {
   console.log("datais require");
   }
   else {
     
     
     const transformedData = {};
     
     excelData.forEach(item => {
       const { keyword, ID, polish } = item;
       transformedData[keyword] = { id: ID, translation: polish };
      });
      
       jsonData = JSON.stringify(transformedData, null, 4);
    }
  return (
    <div className="container">

      {/* upload file section */}
      <div className='form'>
        <form className='form-group' autoComplete="off"
        onSubmit={handleSubmit}>
          <label><h5>Upload Excel file</h5></label>
          <br></br>
          <input type='file' className='form-control'
          onChange={handleFile} required></input>                  
          {excelFileError&&<div className='text-danger'
          style={{marginTop:'5px'}}>{excelFileError}</div>}
          <button type='submit' className='btn btn-success'
          style={{marginTop:5+'px'}}>Submit</button>
        </form>
      </div>

      <br></br>
      <hr></hr>

      {/* view file section */}
      {/* <h5>View Excel file</h5> */}
      <h3>Approved List of Employees</h3>
      <div className='viewer'>
        <pre>{jsonData}</pre>
          
      </div>

    </div>
  );
}

export default App;
import React , {Component} from 'react';
import axios from 'axios';
import {Modal , Button, ModalBody, ModalFooter, ModalHeader, Form, FormGroup, InputGroup, InputGroupText, Input} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data : [],
      path : '/',
      addState: false
    }
  }

  apiCall = async(data, action) => {
    console.log(data);
    const url = '/api/'+action;
    console.log(url);
    const res = await axios.post(url, data)
                      .then(response => response)
                      .then(response => {
                        console.log(response);
                        return response;
                      }).catch(err => {console.log(err); return false});
    console.log({res});
    return res;
  }

  addContent = async() => {
      if(document.querySelector('input[name="fileType"]:checked')) {
        const name = document.getElementById('fileName').value;
        const type = document.querySelector('input[name="fileType"]:checked').value;
        const size = type !== "file" ? 0 : document.getElementById('size').value;
        console.log({name, type, size});
        if(name === "" || type === null || size === ""){
          console.log("returning ")
          return;
        }
        let apiResponse = await this.apiCall({name, type, size, parent: this.state.path} , "addContent");
        console.log(apiResponse);
        if(apiResponse.data.status){
          let data = this.state.data;
          console.table(data);
          data.push({name, type, size});
          this.setState((state) =>({
            data 
          }));
        }        
      }
    return;
  }

  getContent = async(isParent, path) => {
    var path;
    if(isParent){
      var idx = this.state.path.lastIndexOf('/');
      if(idx === 0)
        path = "/";
      else
        path =  this.state.path.slice(0, idx);
    }
    else{
      if(path != null){
        if(this.state.path === '/')
        path = this.state.path + path;
      else
        path = this.state.path + '/' + path;
      }
      else
        path = this.state.path;
    }
    
    let contentResponse = await this.apiCall({path} , 'getContent');
    console.log(contentResponse.data);
    if(contentResponse.data.status) {
      let data = this.state.data;
      this.setState((state) => ({
        data: contentResponse.data.response,
        path
      }))
    }
  }

  searchContent = async() => {
    let name = document.getElementById('search').value;
    if(name === "")
      return;
    let searchResponse = await this.apiCall({name, path : this.state.path} , 'getContent/search');
    console.log(searchResponse);
    if(searchResponse.data.status) {
      this.setState((state) => ({
        data: searchResponse.data.response
      }))
    }
    document.getElementById('search').value = "";
  }

  sortContent =  async() => {
    const sortContentResponse = await this.apiCall({path: this.state.path} , 'getContent/reverse');
    if(sortContentResponse.data.status) {
      this.setState((state)=> ({data: sortContentResponse.data.response}));
    }
  }

  modifyContent = async() => {

  }

  deleteContent = async(path, type, name, key) => {
    const deleteResponse = await this.apiCall({path, type, name}, 'deleteContent');
    console.log(deleteResponse);
    if(deleteResponse.data.status){
      let data =[];
      for(var i  = 0;  i < this.state.data.length; i++)
        if(i !== key)
          data.push(this.state.data[i]);
      this.setState((state) => ({
        data
      }))
    }
  }

  async componentDidMount() {
    const response = await this.getContent(false , null);
    console.log(response)
  }

  render(){
    const data = this.state.data;
    const path = this.state.path;
    const addState = this.state.addState;
    const addToggle = () => this.setState({addState : !addState})
    return (
      <>
        <div className="container">
          <div className='card-header'>
            Current path: {path}
            
            <button onClick={this.searchContent} className='btn btn-secondary mb-2' style={{float: "right"}}> Search </button>
            <input type="text" id="search" style={{float:"right"}} className='mr-3'/>
            <button onClick={addToggle} style={{float: "right"}} className='mr-2 btn-secondary'> Add File/ Folder </button>
            
          </div>
          <div className='card-body row'>
            <div className='col-6'> File Name</div>
            <div className='col-3'> File Size</div>
            <div className='col-3'> Operations</div>
            <div className="col-9" style={{cursor: "pointer"}} onClick={() => this.getContent(true)}> .... </div>
            <div className="col-3" style={{cursor: "pointer"}} onClick={() => this.sortContent()}> Arrange <span className='fa fa-arrow-up'></span></div>
            { data.map((item, key) => {
              return(
                <div className='col-12 row' id={key}>
                  <div className='col-6'>
                    {item.type === "file" ? 
                      <span className="fa fa-file mr-2"></span> : 
                      <span className='fa fa-folder-open-o mr-2' style={{cursor: "pointer"}} onClick={() => this.getContent(false, item.name)}></span>
                    }
                      {item.name}
                    </div>
                  {
                  (item.type === "file") ? <div className='col-3'> {item.size}</div> : <div className='col-3'> </div>}
                  <div className='col-3'>
                    <span className='fa fa-trash-o col-3' onClick={() => this.deleteContent(path, item.type, item.name , key)}></span>
                    <span className='fa fa-pencil col-3' onClick={() => this.modifyContent(path, item.type, item.name, key)}></span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* modal for handling add */}
        <Modal isOpen={addState} toggle={addToggle} className="">
          <ModalHeader toggle={addToggle}>Modal title</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <InputGroup> 
                  <InputGroupText> Name : </InputGroupText>
                  <Input type="text" placeholder="Enter extension too for file names" id="fileName"/>
                </InputGroup>
              </FormGroup>
              <FormGroup className='row'>
                <InputGroup className='col-md-6'>
                  <InputGroupText>
                    <Input addon type="radio" name="fileType" aria-label="Checkbox for following text input" value="file" />
                  </InputGroupText>
                  <Input placeholder="File" className='form-control-plaintext' readOnly/>
                </InputGroup>
                <InputGroup className='col-md-6'>
                  <InputGroupText>
                    <Input addon type="radio" name="fileType" aria-label="Checkbox for following text input" value="folder" />
                  </InputGroupText>
                  <Input placeholder="folder" className='form-control-plaintext' readOnly/>
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup> 
                  <InputGroupText> Size : </InputGroupText>
                  <Input type="text" placeholder="Enter extension too for file names" id="size"/>
                </InputGroup>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={()=> {this.addContent(); addToggle()}}>Do Something</Button>
            <Button color="secondary" onClick={addToggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </>
    )
  }
}

export default App;
